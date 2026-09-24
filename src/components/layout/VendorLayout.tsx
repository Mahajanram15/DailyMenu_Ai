import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Tv, 
  BarChart3, 
  Store, 
  ExternalLink, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  CheckCircle,
  Clock,
  Menu,
  X,
  Layers,
  ArrowUpRight,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const VendorLayout: React.FC = () => {
  const { activeVendor, vendors, setActiveVendorId, updateVendorStatus, orders } = useApp();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const readyOrdersCount = orders.filter(o => o.status === 'ready').length;

  const navItems = [
    { label: 'Overview', path: '/vendor', icon: LayoutDashboard, exact: true },
    { label: 'AI Menu Studio', path: '/vendor/menu', icon: Utensils, badge: 'AI' },
    { 
      label: 'Live Kitchen Orders', 
      path: '/vendor/orders', 
      icon: ShoppingBag, 
      count: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      countColor: 'bg-brand-500'
    },
    { 
      label: 'Smart Token Queue', 
      path: '/vendor/queue', 
      icon: Tv, 
      count: readyOrdersCount > 0 ? `${readyOrdersCount} Ready` : undefined,
      countColor: 'bg-amber-500'
    },
    { label: 'Intelligence & Waste', path: '/vendor/analytics', icon: BarChart3 },
    { label: 'QR Standees & Links', path: '/vendor/qr', icon: QrCode },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const statusOptions = [
    { key: 'open', label: 'Open for Orders', color: 'bg-emerald-400' },
    { key: 'rush', label: 'Rush Hour Mode', color: 'bg-amber-400' },
    { key: 'closed', label: 'Stall Closed', color: 'bg-slate-500' },
  ] as const;

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-obsidian-900 border-r border-slate-800/80 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-bold text-base text-white">
                DailyMenu <span className="text-brand-400">AI</span>
              </div>
              <p className="text-[11px] text-slate-400">Vendor Management Console</p>
            </div>
          </Link>
        </div>

        {/* Vendor Selector Switcher */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-obsidian-850 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>ACTIVE STALL</span>
            <span className="text-[10px] text-brand-400">Switch Stall</span>
          </div>
          <select 
            value={activeVendor.id}
            onChange={(e) => setActiveVendorId(e.target.value)}
            className="w-full bg-obsidian-950 border border-slate-700/80 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.slug})</option>
            ))}
          </select>
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Live Rating:</span>
            <span className="text-amber-400 font-semibold">★ {activeVendor.rating} ({activeVendor.totalReviews})</span>
          </div>
        </div>

        {/* Main Navigation links */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Management
          </div>
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-obsidian-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${active ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="brand" size="sm" className="scale-90 font-mono">{item.badge}</Badge>
                )}
                {item.count && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-obsidian-950 ${item.countColor || 'bg-brand-500'}`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Customer View
          </div>
          <Link
            to={`/customer/${activeVendor.id}`}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-obsidian-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Customer Storefront</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </nav>

        {/* Bottom Vendor Status Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-obsidian-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                activeVendor.status === 'open' ? 'bg-emerald-400 animate-pulse' :
                activeVendor.status === 'rush' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
              }`} />
              <span className="text-xs font-semibold capitalize text-slate-300">
                {activeVendor.status} Mode
              </span>
            </div>

            <div className="flex gap-1">
              <button 
                onClick={() => updateVendorStatus('open')}
                title="Set Open"
                className={`p-1 rounded text-xs ${activeVendor.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Open
              </button>
              <button 
                onClick={() => updateVendorStatus('rush')}
                title="Set Rush"
                className={`p-1 rounded text-xs ${activeVendor.status === 'rush' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Rush
              </button>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header for Mobile & Desktop */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-slate-800/80 bg-obsidian-950/85 backdrop-blur-xl">
          
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-850"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-xl">{activeVendor.logo}</span>
              <div>
                <h2 className="text-sm md:text-base font-bold text-white tracking-tight leading-tight">{activeVendor.name}</h2>
                <p className="text-[11px] text-slate-400 hidden sm:block">{activeVendor.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to Customer Storefront */}
            <Link 
              to={`/customer/${activeVendor.id}`}
              className="hidden sm:inline-flex"
            >
              <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Preview Customer Menu
              </Button>
            </Link>

            {/* Quick Link to TV Display */}
            <Link to="/vendor/queue">
              <Button variant="secondary" size="sm" leftIcon={<Tv className="w-3.5 h-3.5 text-amber-400" />}>
                Token Display
              </Button>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-obsidian-900 border-r border-slate-800 p-5 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 font-display font-bold text-lg text-white">
                  <Sparkles className="w-5 h-5 text-brand-400" /> DailyMenu AI
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1.5">
                {navItems.map((item) => {
                  const active = isActive(item.path, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium ${
                        active
                          ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-obsidian-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500 text-obsidian-950 font-bold">
                          {item.count}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <Link
                    to={`/customer/${activeVendor.id}`}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <Store className="w-4 h-4" />
                    <span>Open Customer Storefront</span>
                  </Link>
                </div>
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link to="/" onClick={() => setMobileSidebarOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Return to Landing Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
