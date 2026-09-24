export type DietaryType = 'veg' | 'non-veg' | 'egg' | 'vegan';

export interface MenuItem {
  id: string;
  menuId?: string;
  name: string;
  nativeNames?: {
    hi?: string; // Hindi
    ta?: string; // Tamil
    te?: string; // Telugu
    mr?: string; // Marathi
  };
  description: string;
  price: number;
  costPrice?: number;
  category: string;
  isAvailable: boolean;
  isChefSpecial?: boolean;
  prepTimeMin: number;
  dietary: DietaryType;
  spicyLevel?: 1 | 2 | 3;
  tags?: string[];
  image?: string;
  calories?: number;
  createdAt?: string;
}

export type OrderStatus = 
  | 'PLACED' 
  | 'ACCEPTED' 
  | 'PREPARING' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED'
  // Support legacy lowercase for seamless transition
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id?: string;
  orderId?: string;
  item: MenuItem;
  quantity: number;
  customization?: string;
  unitPrice?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt?: string;
}

export interface Order {
  id: string;
  tokenNumber: number;
  tokenCode: string; // e.g. "A24"
  customerId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Cash' | 'Card';
  paymentStatus: 'paid' | 'pending';
  createdAt: string; // ISO string or human relative time
  createdAtTimestamp?: number; // epoch ms for accurate elapsed timer calculation
  estimatedMinutes: number;
  vendorId: string;
  tableOrCounter?: string;
  cancellationReason?: string;
  updatedAt?: string;
}

export interface QueueState {
  vendorId: string;
  currentServingToken: string | number;
  activeOrdersCount: number;
  totalEstimatedWaitMin: number;
  ordersAhead: number;
  lastUpdated: string;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  address: string;
  rating: number;
  totalReviews: number;
  status: 'open' | 'rush' | 'closed';
  cuisines: string[];
  logo: string;
  banner: string;
  phone: string;
  upiId: string;
  activeTokensCount: number;
  avgPrepTime: number;
  createdAt?: string;
}

export interface Menu {
  id: string;
  vendorId: string;
  title: string;
  isActive: boolean;
  items: MenuItem[];
  createdAt?: string;
}

export interface AiGeneratedDish {
  name: string;
  nativeNameHi: string;
  description: string;
  category: string;
  estimatedCost: number;
  recommendedPrice: number;
  marginPercent: number;
  prepTimeMin: number;
  dietary: DietaryType;
  confidence: number;
  highlightReason: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}
