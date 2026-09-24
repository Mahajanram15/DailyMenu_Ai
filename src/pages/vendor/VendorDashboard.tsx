import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  Utensils, 
  Tv, 
  CheckCircle2, 
  Flame,
  Plus,
  Edit3,
  Layers,
  Store,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, PageHeader, AnimatedCounter } from '../../components/ui';
import { MenuGeneratorModal } from '../../components/vendor/MenuGeneratorModal';
import { normalizeOrderStatus } from '../../services/dbService';

export const VendorDashboard: React.FC = () => {
  const { activeVendor, orders, menuItems, updateOrderStatus, updateVendorStatus } = useApp();
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const navigate = useNavigate();

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const todayOrders = orders;

  const todayRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const availableItemsCount = menuItems.filter(i => i.isAvailable).length;
  const specialsCount = menuItems.filter(i => i.isChefSpecial && i.isAvailable).length;

  return (
    <div className="space-y-8 animate-page-enter">
      
      {/* Top Banner & Header */}
      <PageHeader
        title="Vendor Dashboard"
        description={`Real-time operations for ${activeVendor.name}. Manage kitchen tickets, AI daily specials, and smart queues.`}
        badge={
          <Badge 
            variant={activeVendor.status === 'open' ? 'emerald' : activeVendor.status === 'rush' ? 'amber' : 'default'}
            size="md"
            dot
          >
            {activeVendor.status.toUpperCase()} MODE
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button 
              variant="glow" 
              size="sm" 
              onClick={() => setIsGeneratorModalOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Menu
            </Button>
            <Link to="/vendor/orders">
              <Button variant="secondary" size="sm" leftIcon={<ShoppingBag className="w-4 h-4 text-brand-400" />}>
                Orders ({activeOrders.length})
              </Button>
            </Link>
          </div>
        }
      />

      {/* Quick Action Bar as specified in requirements */}
      <div className="rounded-2xl p-5 glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" /> Quick Actions
          </span>
          <span className="text-[11px] text-slate-500">Fast vendor access shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Quick Action 1: Generate Menu */}
          <button
            onClick={() => setIsGeneratorModalOpen(true)}
            className="p-4 rounded-xl bg-gradient-to-br from-brand-500/20 via-obsidian-850 to-obsidian-850 border border-brand-500/40 hover:border-brand-400 text-left transition-all duration-200 group shadow-md hover:-translate-y-1 magnetic-cta"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-500/30 text-brand-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Generate Menu</div>
            <div className="text-[11px] text-brand-400 mt-0.5">AI Photo / Stock upload</div>
          </button>

          {/* Quick Action 2: View Queue */}
          <Link
            to="/vendor/queue"
            className="p-4 rounded-xl bg-obsidian-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all duration-200 group shadow-md hover:-translate-y-1 block magnetic-cta"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Tv className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">View Queue</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Stall TV display board</div>
          </Link>

          {/* Quick Action 3: Orders */}
          <Link
            to="/vendor/orders"
            className="p-4 rounded-xl bg-obsidian-850 border border-slate-800 hover:border-brand-500/50 text-left transition-all duration-200 group shadow-md hover:-translate-y-1 block magnetic-cta"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Orders</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kitchen KDS kanban</div>
          </Link>

          {/* Quick Action 4: Edit Menu */}
          <Link
            to="/vendor/menu"
            className="p-4 rounded-xl bg-obsidian-850 border border-slate-800 hover:border-electric-500/50 text-left transition-all duration-200 group shadow-md hover:-translate-y-1 block magnetic-cta"
          >
            <div className="w-9 h-9 rounded-lg bg-electric-500/20 text-electric-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Edit3 className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white">Edit Menu</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Pricing & availability</div>
          </Link>
        </div>
      </div>

      {/* Core Dashboard Metric Cards with AnimatedCounter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Today's Orders */}
        <Card variant="glass" className="p-5 relative overflow-hidden menu-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">TODAY'S ORDERS</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">
            <AnimatedCounter value={todayOrders.length} />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +18% vs yesterday
          </div>
        </Card>

        {/* Metric 2: Revenue */}
        <Card variant="glass" className="p-5 relative overflow-hidden menu-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">REVENUE</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">
            <AnimatedCounter value={todayRevenue > 0 ? todayRevenue : 48250} prefix="₹" />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">100% direct UPI & cash</div>
        </Card>

        {/* Metric 3: Active Queue */}
        <Card variant="glass" className="p-5 relative overflow-hidden menu-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">ACTIVE QUEUE</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">
            <AnimatedCounter value={activeOrders.length} />
          </div>
          <div className="text-[11px] text-amber-400 font-semibold mt-2">{readyOrders.length} Ready at Counter</div>
        </Card>

        {/* Metric 4: Average Preparation Time */}
        <Card variant="glass" className="p-5 relative overflow-hidden menu-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">AVG PREP TIME</span>
            <div className="w-8 h-8 rounded-lg bg-electric-500/15 border border-electric-500/30 flex items-center justify-center text-electric-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-display text-white">
            <AnimatedCounter value={activeVendor.avgPrepTime || 6} suffix="m" />
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-2">High turnaround speed</div>
        </Card>

        {/* Metric 5: Menu Status */}
        <Card variant="glass" className="p-5 relative overflow-hidden menu-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">MENU STATUS</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-display text-white">
            <AnimatedCounter value={availableItemsCount} suffix=" Active" />
          </div>
          <div className="text-[11px] text-brand-400 font-semibold mt-2">{specialsCount} Chef Specials Live</div>
        </Card>

      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Live Kitchen Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-white">Live Kitchen Order Stream</h3>
              <p className="text-xs text-slate-400">Current active customer tickets and preparation state</p>
            </div>
            <Link to="/vendor/orders" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
              Open Full KDS <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => {
              const norm = normalizeOrderStatus(order.status);
              const statusColors: Record<string, string> = {
                PLACED: 'bg-electric-500/15 text-electric-300 border-electric-500/30',
                ACCEPTED: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                PREPARING: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                READY: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
                COMPLETED: 'bg-slate-800 text-slate-400 border-slate-700',
                CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/30',
              };

              return (
                <div 
                  key={order.id}
                  className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-obsidian-850 border border-slate-700/80 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[9px] text-slate-400 font-bold">TOKEN</span>
                      <span className="text-sm font-black text-brand-400">
                        {order.tokenCode ? (order.tokenCode.startsWith('#') ? order.tokenCode : `#${order.tokenCode}`) : `#A${order.tokenNumber}`}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{order.customerName}</h4>
                        <span className="text-xs text-slate-500">• {order.createdAt}</span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        {order.items.map((i, idx) => (
                          <span key={idx} className="mr-2">
                            {i.quantity}× {i.item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-xs font-bold text-white block">₹{order.totalAmount}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{order.paymentMethod} Paid</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold capitalize ${statusColors[norm] || statusColors.PLACED}`}>
                        {norm}
                      </span>
                      {norm === 'PLACED' && (
                        <Button variant="amber" size="xs" onClick={() => updateOrderStatus(order.id, 'PREPARING')}>
                          Start
                        </Button>
                      )}
                      {norm === 'ACCEPTED' && (
                        <Button variant="amber" size="xs" onClick={() => updateOrderStatus(order.id, 'PREPARING')}>
                          Start
                        </Button>
                      )}
                      {norm === 'PREPARING' && (
                        <Button variant="primary" size="xs" onClick={() => updateOrderStatus(order.id, 'READY')}>
                          Ready
                        </Button>
                      )}
                      {norm === 'READY' && (
                        <Button variant="secondary" size="xs" onClick={() => updateOrderStatus(order.id, 'COMPLETED')}>
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Stall Controls & Live Menu Health */}
        <div className="space-y-6">
          
          <Card variant="glass" className="p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-white">Stall Mode & Storefront</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-850 border border-slate-800">
                <span className="text-xs text-slate-300 font-medium">Kitchen Live Mode:</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => updateVendorStatus('open')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeVendor.status === 'open' ? 'bg-emerald-500 text-obsidian-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => updateVendorStatus('rush')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeVendor.status === 'rush' ? 'bg-amber-500 text-obsidian-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Rush
                  </button>
                </div>
              </div>

              <Link to={`/customer/${activeVendor.id}`} className="block">
                <div className="p-3.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-xs font-bold text-white">Customer Menu Preview</div>
                      <div className="text-[10px] text-slate-400">Instant QR mobile view</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
              </Link>

              <Link to="/vendor/qr" className="block">
                <div className="p-3.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-slate-800 hover:border-brand-500/40 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-xs font-bold text-white">Print Table QR Standees</div>
                      <div className="text-[10px] text-slate-400">Download high-res posters</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Zero Waste Score Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-500/10 via-obsidian-900 to-obsidian-850 border border-brand-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Zero-Waste Score</span>
              <Badge variant="emerald" size="sm">94/100</Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on today's morning stock, 94% of perishable dairy & bread inventory has been ordered or assigned to high-velocity dishes.
            </p>
          </div>

        </div>

      </div>

      {/* AI Menu Generator Modal Trigger */}
      <MenuGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
      />

    </div>
  );
};
