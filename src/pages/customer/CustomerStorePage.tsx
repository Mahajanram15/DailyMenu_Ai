import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Languages, 
  Clock, 
  Plus, 
  Minus, 
  X, 
  Check, 
  ArrowRight, 
  QrCode, 
  ShieldCheck,
  Store,
  Sparkles,
  Flame,
  Star,
  MapPin,
  ChevronRight,
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, Input, Modal, EmptyState } from '../../components/ui';
import { MenuItem, DietaryType } from '../../types';

export const CustomerStorePage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { 
    vendors, 
    activeVendor, 
    menuItems, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart,
    clearCart,
    cartTotal, 
    cartCount,
    createOrder,
    selectedLanguage,
    setSelectedLanguage
  } = useApp();

  const navigate = useNavigate();
  const currentVendor = vendors.find(v => v.id === vendorId || v.slug === vendorId) || activeVendor;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Customer Checkout Details
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 12345');
  const [tableOrCounter, setTableOrCounter] = useState('Table 4 / Dine-in');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash'>('UPI');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Standardized categories: Popular, Breakfast, Main Course, Snacks, Drinks + dynamic
  const standardCategories = ['All', 'Popular', 'Breakfast', 'Main Course', 'Snacks', 'Drinks'];
  const dynamicCategories = Array.from(new Set(menuItems.map(i => i.category))).filter(c => !standardCategories.includes(c));
  const allCategories = [...standardCategories, ...dynamicCategories];

  const filteredDishes = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nativeNames?.mr && item.nativeNames.mr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nativeNames?.hi && item.nativeNames.hi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory === 'Popular') {
      matchesCategory = item.isChefSpecial || item.tags?.includes('Popular') || item.tags?.includes('Bestseller') || false;
    } else if (selectedCategory !== 'All') {
      matchesCategory = item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }

    const matchesDietary = selectedDietary === 'All' || item.dietary === selectedDietary;

    return matchesSearch && matchesCategory && matchesDietary;
  });

  const getLocalizedName = (item: MenuItem) => {
    if (selectedLanguage === 'mr' && item.nativeNames?.mr) return item.nativeNames.mr;
    if (selectedLanguage === 'hi' && item.nativeNames?.hi) return item.nativeNames.hi;
    return item.name;
  };

  // Estimated preparation time based on items in cart
  const estimatedCartPrepTime = cart.length > 0 
    ? Math.max(...cart.map(ci => ci.item.prepTimeMin)) + Math.min(6, (cartCount - 1) * 2)
    : currentVendor.avgPrepTime;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmittingOrder(true);
    try {
      const order = createOrder(
        customerName.trim() || 'Rahul Verma',
        customerPhone.trim() || '+91 98450 12345',
        paymentMethod,
        tableOrCounter,
        currentVendor.id
      );
      setIsSubmittingOrder(false);
      setIsCartDrawerOpen(false);
      navigate(`/customer/${currentVendor.id}/order/${order.id}`);
    } catch (err) {
      console.error('Order creation error:', err);
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col pb-32 selection:bg-brand-500/30 selection:text-brand-300 animate-page-enter">
      
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-obsidian-950/85 backdrop-blur-2xl px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-obsidian-900 border border-slate-700/80 flex items-center justify-center text-xl shrink-0 shadow-lg">
              {currentVendor.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold font-display text-white truncate leading-tight">
                  {currentVendor.name}
                </h1>
                <span className={`w-2 h-2 rounded-full shrink-0 ${currentVendor.status === 'open' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentVendor.status === 'open' ? '🟢 Open for Dine-in & Takeaway' : '🟡 Rush Hour (Orders active)'}
              </p>
            </div>
          </div>

          {/* Top Actions: Cart Tray + Language Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {cartCount > 0 && (
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="View Tray"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-brand-400" />
                <span className="font-mono">₹{cartTotal}</span>
                <span className="w-4 h-4 rounded-full bg-brand-500 text-obsidian-950 text-[10px] flex items-center justify-center font-black">
                  {cartCount}
                </span>
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-brand-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-obsidian-850 border border-slate-700 text-xs font-semibold text-white rounded-xl px-2 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="hi">हिन्दी (HI)</option>
              </select>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-lg mx-auto w-full px-4 pt-4 space-y-5">
        
        {/* Vendor Banner & Stall Info Card */}
        <div className="rounded-3xl overflow-hidden bg-obsidian-900 border border-slate-800 shadow-xl relative hover:border-slate-700 transition-colors">
          <div className="h-36 relative">
            <img 
              src={currentVendor.banner} 
              alt={currentVendor.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/50 to-transparent" />
            
            <div className="absolute top-3 right-3">
              <Badge variant="glass" size="sm" className="font-semibold shadow-md">
                ★ {currentVendor.rating} ({currentVendor.totalReviews}+ reviews)
              </Badge>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-200 bg-obsidian-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Estimated Wait: <strong>~{currentVendor.avgPrepTime} min</strong></span>
              </div>
              <span className="text-brand-400 font-bold bg-obsidian-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-brand-500/30">
                Express Token #
              </span>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {currentVendor.tagline}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
              <span className="truncate">{currentVendor.address}</span>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Input
            placeholder="Search Chai, Samosa, Pav Bhaji, Chaat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Category Filter Pills (Popular, Breakfast, Main Course, Snacks, Drinks) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-obsidian-950 shadow-md shadow-brand-500/20 scale-105'
                  : 'bg-obsidian-850 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'Popular' ? '🔥 Popular' : cat}
            </button>
          ))}
        </div>

        {/* Dietary Filter (All, Pure Veg, Non-Veg) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDietary('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${selectedDietary === 'All' ? 'bg-slate-700 text-white border-slate-600' : 'bg-obsidian-900 text-slate-400 border-slate-800'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedDietary('veg')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${selectedDietary === 'veg' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-obsidian-900 text-slate-400 border-slate-800'}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Pure Veg
          </button>
          <button
            onClick={() => setSelectedDietary('non-veg')}
            className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${selectedDietary === 'non-veg' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-obsidian-900 text-slate-400 border-slate-800'}`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" /> Non-Veg
          </button>
        </div>

        {/* Menu Cards List with menu-card-hover */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>TODAY'S DISHES ({filteredDishes.length})</span>
            <span>Contactless Express Ordering</span>
          </div>

          {filteredDishes.length === 0 ? (
            <EmptyState
              icon={<Search className="w-8 h-8" />}
              title="No dishes found"
              description="Try searching for another dish or clear your active category filter."
              action={
                <Button variant="glow" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDietary('All'); }}>
                  Reset Filters
                </Button>
              }
            />
          ) : (
            filteredDishes.map((dish) => {
              const inCart = cart.find(ci => ci.item.id === dish.id);
              const displayName = getLocalizedName(dish);

              return (
                <div
                  key={dish.id}
                  className={`rounded-2xl p-4 bg-obsidian-900 border flex gap-3.5 relative overflow-hidden group shadow-lg menu-card-hover ${
                    !dish.isAvailable ? 'opacity-55 border-slate-800' : 'border-slate-800/80'
                  }`}
                >
                  {/* Left: Dish Information */}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dish.dietary === 'veg' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{dish.category}</span>
                        {dish.isChefSpecial && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> Special
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {displayName}
                      </h3>

                      {selectedLanguage !== 'en' && (
                        <span className="text-[11px] text-slate-400 block font-normal">{dish.name}</span>
                      )}

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-base font-extrabold text-brand-400 font-mono">₹{dish.price}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> ~{dish.prepTimeMin}m
                      </span>
                    </div>
                  </div>

                  {/* Right: Dish Photo & Quantity Control Button */}
                  <div className="w-28 flex flex-col items-center justify-between shrink-0 space-y-2">
                    <div className="w-28 h-24 rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
                      <img
                        src={dish.image || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80'}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {!dish.isAvailable && (
                        <div className="absolute inset-0 bg-obsidian-950/85 backdrop-blur-xs flex items-center justify-center text-[10px] font-bold text-red-400 uppercase tracking-wider">
                          Sold Out
                        </div>
                      )}
                    </div>

                    {dish.isAvailable && (
                      <div className="w-full">
                        {inCart ? (
                          <div className="flex items-center justify-between bg-brand-500 text-obsidian-950 rounded-xl px-2 py-1.5 font-bold text-xs shadow-lg animate-in zoom-in-95">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(dish.id, inCart.quantity - 1)}
                              className="p-1 hover:scale-125 transition-transform active:scale-95"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <span className="font-mono text-sm font-black">{inCart.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(dish.id, inCart.quantity + 1)}
                              className="p-1 hover:scale-125 transition-transform active:scale-95"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant="glow"
                            size="sm"
                            className="w-full py-1.5 text-xs font-bold shadow-md"
                            onClick={() => addToCart(dish)}
                          >
                            + ADD
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-4">
          <button 
            type="button"
            id="review-cart-and-pay-btn"
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full max-w-lg rounded-2xl p-4 bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-500 text-obsidian-950 font-bold shadow-2xl shadow-brand-500/50 flex items-center justify-between cursor-pointer border-2 border-emerald-200 hover:scale-[1.01] active:scale-[0.98] transition-all pointer-events-auto select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-obsidian-950/25 flex items-center justify-center text-obsidian-950 font-black text-sm font-mono">
                {cartCount}
              </div>
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider block opacity-90 leading-tight">View Order Tray</span>
                <span className="text-base font-black font-mono leading-tight">₹{cartTotal} Total</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider bg-obsidian-950/15 px-3 py-1.5 rounded-xl">
              <span>Review Cart & Pay</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile-First Cart Drawer / Checkout Modal */}
      <Modal
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        title="Your Food Tray & Token"
        description="Verify your selected dishes, table details, and generate your live digital token."
        size="md"
      >
        <form onSubmit={handlePlaceOrder} className="space-y-5">
          
          {/* Estimated Preparation Time Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/15 border border-brand-500/30 text-xs">
            <span className="flex items-center gap-1.5 text-brand-300 font-semibold">
              <Clock className="w-4 h-4 text-brand-400" /> Estimated Prep Time:
            </span>
            <span className="font-mono font-bold text-white">~{estimatedCartPrepTime} minutes</span>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {cart.map((ci) => (
              <div key={ci.item.id} className="flex items-center justify-between p-3 rounded-xl bg-obsidian-850 border border-slate-800 text-xs">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="font-bold text-white truncate">{getLocalizedName(ci.item)}</div>
                  <div className="text-slate-400 font-mono">₹{ci.item.price} each</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-obsidian-950 border border-slate-700 px-2 py-1 rounded-lg">
                    <button 
                      type="button" 
                      onClick={() => updateCartQuantity(ci.item.id, ci.quantity - 1)} 
                      className="text-slate-400 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white font-mono">{ci.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => updateCartQuantity(ci.item.id, ci.quantity + 1)} 
                      className="text-slate-400 hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-brand-400 font-mono w-12 text-right">
                    ₹{ci.item.price * ci.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Diner Info Fields */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Your Name"
                placeholder="e.g. Rahul Verma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <Input
                label="WhatsApp Phone (For Token SMS)"
                placeholder="+91 98450 12345"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Seating / Pickup Mode
              </label>
              <select
                value={tableOrCounter}
                onChange={(e) => setTableOrCounter(e.target.value)}
                className="w-full bg-obsidian-850 text-slate-100 rounded-xl px-3 py-2 text-xs border border-slate-700"
              >
                <option value="Table 4 / Dine-in">Table 4 / Dine-in</option>
                <option value="Table 2 / Dine-in">Table 2 / Dine-in</option>
                <option value="Counter Express Pickup">Counter Express Pickup (Takeaway)</option>
                <option value="Standing Table / Quick Bite">Standing Table / Quick Bite</option>
              </select>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-brand-500/15 text-brand-400 border-brand-500/40 shadow-sm'
                      : 'bg-obsidian-850 text-slate-400 border-slate-800'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> Instant UPI (GPay/PhonePe)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'Cash'
                      ? 'bg-brand-500/15 text-brand-400 border-brand-500/40 shadow-sm'
                      : 'bg-obsidian-850 text-slate-400 border-slate-800'
                  }`}
                >
                  Pay Cash at Stall
                </button>
              </div>
            </div>
          </div>

          {/* Subtotal & Total Bill Summary */}
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({cartCount} items)</span>
              <span className="font-mono">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Stall Packaging & Taxes</span>
              <span className="text-emerald-400 font-semibold font-mono">₹0 (Free)</span>
            </div>
            <div className="flex justify-between font-bold text-white text-sm pt-1.5 border-t border-slate-800">
              <span>Total Payable</span>
              <span className="text-brand-400 font-mono text-base">₹{cartTotal}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="w-full py-4 text-base font-bold shadow-lg"
            isLoading={isSubmittingOrder}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Place Order • ₹{cartTotal}
          </Button>

        </form>
      </Modal>

    </div>
  );
};
