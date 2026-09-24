import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Plus, 
  Check, 
  X, 
  AlertTriangle,
  Sparkles,
  Flame,
  Utensils,
  ChevronRight,
  RotateCcw,
  Wifi,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, PageHeader, Modal } from '../../components/ui';
import { Order, OrderStatus } from '../../types';
import { normalizeOrderStatus } from '../../services/dbService';

// Live ticking elapsed time hook
function useOrderTimer(orderTimestamp?: number) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const calc = () => {
      if (!orderTimestamp) {
        setElapsed('Just now');
        return;
      }
      const diffMs = Date.now() - orderTimestamp;
      const totalSec = Math.floor(diffMs / 1000);
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      if (mins === 0) {
        setElapsed(`${secs}s elapsed`);
      } else {
        setElapsed(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [orderTimestamp]);

  return elapsed;
}

const LiveOrderCard: React.FC<{
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onCancelClick: (order: Order) => void;
}> = ({ order, onUpdateStatus, onCancelClick }) => {
  const normStatus = normalizeOrderStatus(order.status);
  const elapsed = useOrderTimer(order.createdAtTimestamp);

  const statusConfig: Record<string, { label: string; color: string }> = {
    PLACED: { label: 'New Order', color: 'bg-electric-500/15 text-electric-300 border-electric-500/30' },
    ACCEPTED: { label: 'Accepted', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
    PREPARING: { label: 'In Kitchen', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    READY: { label: 'Ready for Pickup', color: 'bg-brand-500/15 text-brand-300 border-brand-500/30' },
    COMPLETED: { label: 'Delivered', color: 'bg-slate-800 text-slate-400 border-slate-700' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  };

  const currentCfg = statusConfig[normStatus] || statusConfig.PLACED;
  const tokenDisplay = order.tokenCode || `#A${order.tokenNumber}`;

  return (
    <div className="rounded-2xl p-4 bg-obsidian-850 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 shadow-xl relative group">
      
      {/* Top Token & Elapsed Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-base font-mono font-black text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/20">
            {tokenDisplay}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{order.id}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
          <Clock className="w-3.5 h-3.5" />
          <span>{elapsed}</span>
        </div>
      </div>

      {/* Customer and Seating details */}
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">{order.customerName}</h4>
          <span className="text-sm font-bold font-mono text-white">₹{order.totalAmount}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>{order.tableOrCounter || 'Counter Pickup'}</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">{order.paymentMethod} (Paid)</span>
        </div>
      </div>

      {/* Itemized list with customizations */}
      <div className="space-y-1.5 py-1.5 bg-obsidian-900/80 rounded-xl p-3 border border-slate-800">
        {order.items.map((i, idx) => (
          <div key={idx} className="text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">
                <strong className="text-brand-400 font-mono">{i.quantity}×</strong> {i.item.name}
              </span>
              <span className="text-slate-400 font-mono">₹{i.item.price * i.quantity}</span>
            </div>
            {i.customization && (
              <p className="text-[11px] text-amber-300/90 italic mt-0.5 pl-4 border-l-2 border-amber-500/40">
                Note: "{i.customization}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Estimated completion callout */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Target Prep: ~{order.estimatedMinutes || 6} min</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${currentCfg.color}`}>
          {currentCfg.label}
        </span>
      </div>

      {/* Action Buttons based on order lifecycle */}
      <div className="pt-2 flex flex-col gap-2">
        {normStatus === 'PLACED' && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Accept
            </Button>
            <Button
              variant="amber"
              size="xs"
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              leftIcon={<Flame className="w-3.5 h-3.5" />}
            >
              Start Prep
            </Button>
          </div>
        )}

        {normStatus === 'ACCEPTED' && (
          <div className="flex gap-2">
            <Button
              variant="amber"
              size="sm"
              className="w-full"
              onClick={() => onUpdateStatus(order.id, 'PREPARING')}
              leftIcon={<Flame className="w-4 h-4" />}
            >
              Start Preparing
            </Button>
          </div>
        )}

        {normStatus === 'PREPARING' && (
          <Button
            variant="glow"
            size="sm"
            className="w-full"
            onClick={() => onUpdateStatus(order.id, 'READY')}
            leftIcon={<CheckCircle2 className="w-4 h-4 stroke-[3]" />}
          >
            Mark Ready for Pickup
          </Button>
        )}

        {normStatus === 'READY' && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Complete & Deliver
          </Button>
        )}

        {normStatus === 'COMPLETED' && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 py-1 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Handed to Diner
          </div>
        )}

        {normStatus !== 'COMPLETED' && normStatus !== 'CANCELLED' && (
          <button
            onClick={() => onCancelClick(order)}
            className="text-[10px] text-slate-500 hover:text-red-400 transition-colors text-right"
          >
            Cancel Order
          </button>
        )}
      </div>

    </div>
  );
};

export const VendorOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, cancelOrder, activeVendor, menuItems, realtimeStatus, backendProviderName } = useApp();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Cancel order modal
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Kitchen high rush / stock finished');

  // Buckets for 4 KDS columns: NEW, PREPARING, READY, COMPLETED
  const newOrders = orders.filter((o) => {
    const s = normalizeOrderStatus(o.status);
    return s === 'PLACED' || s === 'ACCEPTED';
  });

  const preparingOrders = orders.filter((o) => normalizeOrderStatus(o.status) === 'PREPARING');
  const readyOrders = orders.filter((o) => normalizeOrderStatus(o.status) === 'READY');
  const completedOrders = orders.filter((o) => {
    const s = normalizeOrderStatus(o.status);
    return s === 'COMPLETED' || s === 'CANCELLED';
  });

  const handleSimulateIncomingOrder = () => {
    const randomDish = menuItems[Math.floor(Math.random() * menuItems.length)];
    const names = ['Kavita Nair', 'Siddharth Joshi', 'Ananya Deshmukh', 'Tariq Khan', 'Deepak Verma'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const nextToken = (orders.length > 0 ? Math.max(...orders.map(o => o.tokenNumber)) : 20) + 1;
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenNumber: nextToken,
      tokenCode: `A${nextToken}`,
      customerName: randomName,
      customerPhone: '+91 98450 99881',
      items: [{ item: randomDish, quantity: Math.floor(1 + Math.random() * 2), customization: 'Extra spicy, separate parcel' }],
      status: 'PLACED',
      totalAmount: randomDish.price,
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      createdAt: 'Just now',
      createdAtTimestamp: Date.now(),
      estimatedMinutes: randomDish.prepTimeMin || 6,
      vendorId: activeVendor.id,
      tableOrCounter: 'Counter Pickup',
      updatedAt: new Date().toISOString()
    };
    
    // Dispatch through storage & broadcast
    const nextList = [newOrder, ...orders];
    localStorage.setItem('dailymenu_orders', JSON.stringify(nextList));
    window.dispatchEvent(new Event('storage'));
  };

  const handleConfirmCancel = () => {
    if (!orderToCancel) return;
    cancelOrder(orderToCancel.id, cancelReason);
    setOrderToCancel(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <PageHeader
        title="Kitchen Display System (KDS)"
        description="Live ticket stream with real-time sync. Move tickets across columns to automatically broadcast live status to diner screens."
        badge={
          <Badge variant="brand" size="md" dot>
            {newOrders.length + preparingOrders.length} Active Tickets
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 border border-slate-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">{backendProviderName}</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 font-semibold transition-colors ${
                soundEnabled 
                  ? 'bg-brand-500/15 text-brand-400 border-brand-500/30' 
                  : 'bg-obsidian-850 text-slate-500 border-slate-800'
              }`}
              title="Kitchen Audio Chime"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Muted'}</span>
            </button>

            <Button
              variant="glow"
              size="sm"
              onClick={handleSimulateIncomingOrder}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Simulate Customer QR Order
            </Button>
          </div>
        }
      />

      {/* 4-Column Live KDS Kanban Board: NEW, PREPARING, READY, COMPLETED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        
        {/* Column 1: NEW (Placed / Accepted) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-electric-500/10 border border-electric-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-electric-400 animate-ping" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-electric-300">
                1. NEW ORDERS
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-electric-500/20 text-electric-300">
              {newOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {newOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
                No new incoming tickets
              </div>
            ) : (
              newOrders.map((order) => (
                <LiveOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCancelClick={setOrderToCancel}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                2. PREPARING
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
                No tickets currently in kitchen
              </div>
            ) : (
              preparingOrders.map((order) => (
                <LiveOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCancelClick={setOrderToCancel}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 border border-brand-500/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300">
                3. READY FOR PICKUP
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
                No orders waiting for pickup
              </div>
            ) : (
              readyOrders.map((order) => (
                <LiveOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCancelClick={setOrderToCancel}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 4: COMPLETED */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-850 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. COMPLETED & ARCHIVED
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {completedOrders.length}
            </span>
          </div>

          <div className="space-y-3 opacity-80">
            {completedOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
                No archived tickets yet
              </div>
            ) : (
              completedOrders.slice(0, 5).map((order) => (
                <LiveOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCancelClick={setOrderToCancel}
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* Cancel Order Reason Modal */}
      {orderToCancel && (
        <Modal
          isOpen={true}
          onClose={() => setOrderToCancel(null)}
          title={`Cancel Order ${orderToCancel.id}?`}
          description="Are you sure you want to cancel this ticket? The customer status will update automatically."
          size="sm"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-obsidian-850 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs"
              >
                <option value="Kitchen high rush / stock finished">Kitchen high rush / stock finished</option>
                <option value="Customer requested cancellation">Customer requested cancellation</option>
                <option value="Item ingredient unavailable">Item ingredient unavailable</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setOrderToCancel(null)}>
                Keep Order
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
                Confirm Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
