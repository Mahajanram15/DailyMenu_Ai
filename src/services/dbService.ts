import { Vendor, MenuItem, Order, OrderStatus, QueueState } from '../types';
import { INITIAL_VENDORS, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// BroadcastChannel for instant cross-tab / cross-window zero-latency real-time synchronization
const REALTIME_CHANNEL_NAME = 'dailymenu_realtime_events';
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(REALTIME_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this browser environment');
}

/**
 * Normalizes any legacy or case variant status to standardized uppercase lifecycle:
 * PLACED -> ACCEPTED -> PREPARING -> READY -> COMPLETED -> CANCELLED
 */
export function normalizeOrderStatus(status: string): OrderStatus {
  const upper = status.toUpperCase();
  if (upper === 'PENDING' || upper === 'PLACED') return 'PLACED';
  if (upper === 'ACCEPTED') return 'ACCEPTED';
  if (upper === 'PREPARING' || upper === 'COOKING') return 'PREPARING';
  if (upper === 'READY') return 'READY';
  if (upper === 'COMPLETED' || upper === 'DELIVERED') return 'COMPLETED';
  if (upper === 'CANCELLED' || upper === 'CANCELED') return 'CANCELLED';
  return 'PLACED';
}

/**
 * Queue Engine: Automatically calculates current serving token, orders ahead, and estimated wait minutes.
 */
export function calculateQueueMetrics(orders: Order[], targetOrderIdOrToken?: string | number): QueueState {
  // Active orders in the kitchen (Placed, Accepted, Preparing, Ready)
  const activeOrders = orders.filter((o) => {
    const s = normalizeOrderStatus(o.status);
    return s === 'PLACED' || s === 'ACCEPTED' || s === 'PREPARING' || s === 'READY';
  });

  // Ready orders currently at the counter
  const readyOrders = orders.filter((o) => normalizeOrderStatus(o.status) === 'READY');
  
  // Current serving token: The highest token currently marked READY, or lowest PREPARING
  let currentServingToken: string | number = 'None';
  if (readyOrders.length > 0) {
    currentServingToken = readyOrders[0].tokenCode || `#A${readyOrders[0].tokenNumber}`;
  } else if (activeOrders.length > 0) {
    const prep = activeOrders.find((o) => normalizeOrderStatus(o.status) === 'PREPARING');
    if (prep) {
      currentServingToken = prep.tokenCode || `#A${prep.tokenNumber}`;
    } else {
      currentServingToken = activeOrders[0].tokenCode || `#A${activeOrders[0].tokenNumber}`;
    }
  }

  // Calculate orders ahead for a specific target token/order
  let ordersAhead = 0;
  let estimatedWaitMin = 6;

  if (targetOrderIdOrToken) {
    const targetOrder = orders.find(
      (o) => o.id === targetOrderIdOrToken || o.tokenCode === targetOrderIdOrToken || o.tokenNumber === targetOrderIdOrToken
    );

    if (targetOrder) {
      const targetStatus = normalizeOrderStatus(targetOrder.status);
      if (targetStatus === 'READY' || targetStatus === 'COMPLETED') {
        ordersAhead = 0;
        estimatedWaitMin = 0;
      } else {
        // Count active orders placed before this order
        const earlierOrders = activeOrders.filter(
          (o) => o.tokenNumber < targetOrder.tokenNumber && o.id !== targetOrder.id
        );
        ordersAhead = earlierOrders.length;
        
        // Sum preparation time estimates of preceding active orders
        const precedingTime = earlierOrders.reduce((acc, o) => acc + (o.estimatedMinutes || 4), 0);
        estimatedWaitMin = Math.max(2, Math.min(45, (targetOrder.estimatedMinutes || 6) + Math.round(precedingTime * 0.4)));
      }
    }
  } else {
    // General stall average wait time
    estimatedWaitMin = activeOrders.length > 0 ? Math.min(30, Math.max(5, activeOrders.length * 3)) : 5;
  }

  return {
    vendorId: orders[0]?.vendorId || 'chai-chaat-koramangala',
    currentServingToken,
    activeOrdersCount: activeOrders.length,
    totalEstimatedWaitMin: estimatedWaitMin,
    ordersAhead,
    lastUpdated: new Date().toISOString()
  };
}

export const dbService = {
  // Emit event to all open tabs / windows
  broadcastUpdate(eventType: 'ORDER_CREATED' | 'ORDER_UPDATED' | 'MENU_UPDATED', payload: any) {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: eventType, payload, timestamp: Date.now() });
    }
    // Also trigger storage event for cross-browser fallback
    localStorage.setItem('dailymenu_last_realtime_sync', JSON.stringify({ type: eventType, timestamp: Date.now() }));
    window.dispatchEvent(new Event('storage'));
  },

  // Listen to realtime updates
  onRealtimeUpdate(callback: (event: { type: string; payload: any }) => void) {
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data) {
        callback(event.data);
      }
    };

    const handleStorage = () => {
      const raw = localStorage.getItem('dailymenu_last_realtime_sync');
      if (raw) {
        try {
          callback(JSON.parse(raw));
        } catch (e) {}
      }
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast);
    }
    window.addEventListener('storage', handleStorage);

    // If Supabase is connected, subscribe to Postgres changes
    let supabaseSubscription: any = null;
    if (isSupabaseConfigured && supabase) {
      supabaseSubscription = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
          callback({ type: 'SUPABASE_POSTGRES_CHANGE', payload });
        })
        .subscribe();
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast);
      }
      window.removeEventListener('storage', handleStorage);
      if (supabaseSubscription && supabase) {
        supabase.removeChannel(supabaseSubscription);
      }
    };
  }
};
