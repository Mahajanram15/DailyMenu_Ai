import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Vendor, MenuItem, Order, OrderStatus, DietaryType, QueueState } from '../types';
import { INITIAL_VENDORS, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../data/mockData';
import { useToast } from '../components/ui/Toast';
import { dbService, normalizeOrderStatus, calculateQueueMetrics } from '../services/dbService';
import { getBackendProviderName, isSupabaseConfigured } from '../services/supabaseClient';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customization?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'customer';
  vendorId?: string;
}

interface AppContextType {
  vendors: Vendor[];
  activeVendor: Vendor;
  setActiveVendorId: (id: string) => void;
  updateVendorStatus: (status: 'open' | 'rush' | 'closed') => void;
  menuItems: MenuItem[];
  orders: Order[];
  queueState: QueueState;
  cart: CartItem[];
  addToCart: (item: MenuItem, customization?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  createOrder: (customerName: string, phone: string, paymentMethod: 'UPI' | 'Cash', tableOrCounter?: string, targetVendorId?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  user: User | null;
  login: (email: string, role?: 'vendor' | 'customer') => void;
  logout: () => void;
  selectedLanguage: 'en' | 'hi' | 'ta' | 'te' | 'mr';
  setSelectedLanguage: (lang: 'en' | 'hi' | 'ta' | 'te' | 'mr') => void;
  realtimeStatus: 'connected' | 'reconnecting' | 'fallback_active';
  backendProviderName: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const backendProviderName = getBackendProviderName();
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'reconnecting' | 'fallback_active'>('connected');

  // 1. Vendors state
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('dailymenu_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [activeVendorId, setActiveVendorId] = useState<string>(() => {
    return localStorage.getItem('dailymenu_active_vendor_id') || INITIAL_VENDORS[0].id;
  });

  const activeVendor = vendors.find(v => v.id === activeVendorId) || vendors[0];

  // 2. Menu Items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('dailymenu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // 3. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dailymenu_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // 4. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dailymenu_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. User / Auth state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dailymenu_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_vendor_demo',
      name: 'Chef Rajesh Kumar',
      email: 'rajesh@chaichaat.in',
      role: 'vendor',
      vendorId: 'chai-chaat-koramangala'
    };
  });

  // 6. Multilingual support
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'ta' | 'te' | 'mr'>('en');

  // Derived Queue State
  const queueState = calculateQueueMetrics(orders);

  // Sync state to local storage whenever modified
  useEffect(() => {
    localStorage.setItem('dailymenu_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('dailymenu_active_vendor_id', activeVendorId);
  }, [activeVendorId]);

  useEffect(() => {
    localStorage.setItem('dailymenu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('dailymenu_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dailymenu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dailymenu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dailymenu_user');
    }
  }, [user]);

  // Real-time Event Listener (BroadcastChannel + LocalStorage Event + Periodic Heartbeat)
  const refreshFromStorage = useCallback(() => {
    try {
      const savedOrders = localStorage.getItem('dailymenu_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
      }
      const savedItems = localStorage.getItem('dailymenu_items');
      if (savedItems) {
        setMenuItems(JSON.parse(savedItems));
      }
      const savedVendors = localStorage.getItem('dailymenu_vendors');
      if (savedVendors) {
        setVendors(JSON.parse(savedVendors));
      }
      setRealtimeStatus('connected');
    } catch (err) {
      console.warn('Sync refresh error:', err);
      setRealtimeStatus('reconnecting');
    }
  }, []);

  useEffect(() => {
    // 1. Subscribe to instant cross-window updates
    const unsubscribe = dbService.onRealtimeUpdate((event) => {
      refreshFromStorage();
    });

    // 2. Periodic polling heartbeat fallback every 3.5s to ensure rock-solid consistency
    const interval = setInterval(() => {
      refreshFromStorage();
    }, 3500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [refreshFromStorage]);

  // Cart operations
  const addToCart = (item: MenuItem, customization?: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + 1, customization: customization || ci.customization }
            : ci
        );
      }
      return [...prev, { item, quantity: 1, customization }];
    });
    showToast({
      type: 'success',
      title: 'Added to Tray',
      message: `${item.name} added to your tray`,
      duration: 2500
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  // Vendor Status Update
  const updateVendorStatus = (status: 'open' | 'rush' | 'closed') => {
    const updated = vendors.map((v) => (v.id === activeVendorId ? { ...v, status } : v));
    setVendors(updated);
    dbService.broadcastUpdate('MENU_UPDATED', { vendorId: activeVendorId, status });
    showToast({
      type: 'info',
      title: 'Storefront Status Updated',
      message: `Your kitchen status is now set to "${status.toUpperCase()}"`,
    });
  };

  // Order creation
  const createOrder = (
    customerName: string,
    phone: string,
    paymentMethod: 'UPI' | 'Cash',
    tableOrCounter: string = 'Counter Pickup',
    targetVendorId?: string
  ): Order => {
    const nextTokenNum = (orders.length > 0 ? Math.max(...orders.map(o => o.tokenNumber)) : 20) + 1;
    const assignedVendorId = targetVendorId || activeVendorId;
    const tokenCode = `A${nextTokenNum}`;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenNumber: nextTokenNum,
      tokenCode: tokenCode,
      customerName: customerName.trim() || 'Guest Foodie',
      customerPhone: phone.trim() || '+91 99999 88888',
      items: [...cart],
      status: 'PLACED',
      totalAmount: cartTotal,
      paymentMethod,
      paymentStatus: 'paid',
      createdAt: 'Just now',
      createdAtTimestamp: Date.now(),
      estimatedMinutes: Math.min(25, Math.max(5, cartCount * 3)),
      vendorId: assignedVendorId,
      tableOrCounter,
      updatedAt: new Date().toISOString()
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('dailymenu_orders', JSON.stringify(nextOrders));
    clearCart();

    // Broadcast instant update so all open vendor dashboards and kitchen displays pick it up!
    dbService.broadcastUpdate('ORDER_CREATED', newOrder);
    
    return newOrder;
  };

  // Order status update (Supports 6-stage lifecycle: PLACED -> ACCEPTED -> PREPARING -> READY -> COMPLETED -> CANCELLED)
  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    const normalized = normalizeOrderStatus(status);
    const nextOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: normalized,
          cancellationReason: reason || o.cancellationReason,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });

    setOrders(nextOrders);
    localStorage.setItem('dailymenu_orders', JSON.stringify(nextOrders));
    dbService.broadcastUpdate('ORDER_UPDATED', { orderId, status: normalized });

    showToast({
      type: normalized === 'READY' ? 'success' : normalized === 'CANCELLED' ? 'warning' : 'info',
      title: `Order ${orderId} Updated`,
      message: `Status moved to ${normalized}`,
      duration: 2500
    });
  };

  const cancelOrder = (orderId: string, reason: string = 'Kitchen high load') => {
    updateOrderStatus(orderId, 'CANCELLED', reason);
  };

  // Menu items management
  const addMenuItem = (item: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const nextItems = [newItem, ...menuItems];
    setMenuItems(nextItems);
    localStorage.setItem('dailymenu_items', JSON.stringify(nextItems));
    dbService.broadcastUpdate('MENU_UPDATED', newItem);

    showToast({
      type: 'success',
      title: 'Dish Added to Daily Menu',
      message: `${newItem.name} is now live on customer storefront`,
    });
    return newItem;
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const nextItems = menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setMenuItems(nextItems);
    localStorage.setItem('dailymenu_items', JSON.stringify(nextItems));
    dbService.broadcastUpdate('MENU_UPDATED', { id, updates });

    showToast({
      type: 'info',
      title: 'Dish Updated',
      message: `Menu item changes saved successfully`,
    });
  };

  const deleteMenuItem = (id: string) => {
    const nextItems = menuItems.filter((item) => item.id !== id);
    setMenuItems(nextItems);
    localStorage.setItem('dailymenu_items', JSON.stringify(nextItems));
    dbService.broadcastUpdate('MENU_UPDATED', { deletedId: id });

    showToast({
      type: 'warning',
      title: 'Dish Removed',
      message: 'Item has been deleted from your daily menu',
    });
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) => {
      const nextItems = prev.map((item) => {
        if (item.id === id) {
          const next = !item.isAvailable;
          showToast({
            type: next ? 'success' : 'warning',
            title: next ? 'Dish Available' : 'Dish Marked Sold Out',
            message: `${item.name} is ${next ? 'active' : 'hidden from order cart'}`
          });
          return { ...item, isAvailable: next };
        }
        return item;
      });
      localStorage.setItem('dailymenu_items', JSON.stringify(nextItems));
      dbService.broadcastUpdate('MENU_UPDATED', { id, toggled: true });
      return nextItems;
    });
  };

  // User auth simulation
  const login = (email: string, role: 'vendor' | 'customer' = 'vendor') => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: role === 'vendor' ? 'Chef Rajesh Kumar' : 'Arjun Roy',
      email,
      role,
      vendorId: 'chai-chaat-koramangala'
    };
    setUser(newUser);
    showToast({
      type: 'success',
      title: 'Welcome to DailyMenu AI',
      message: `Signed in as ${newUser.name} (${role})`,
    });
  };

  const logout = () => {
    setUser(null);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out securely',
    });
  };

  return (
    <AppContext.Provider
      value={{
        vendors,
        activeVendor,
        setActiveVendorId,
        updateVendorStatus,
        menuItems,
        orders,
        queueState,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        user,
        login,
        logout,
        selectedLanguage,
        setSelectedLanguage,
        realtimeStatus,
        backendProviderName
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
