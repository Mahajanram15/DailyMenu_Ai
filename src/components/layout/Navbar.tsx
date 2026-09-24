import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, UtensilsCrossed, ArrowRight, Menu, X, Globe, Layers, User, Store } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, activeVendor } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-obsidian-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 via-brand-500/10 to-transparent border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/10 group-hover:border-brand-400/60 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-xl font-bold font-display tracking-tight text-white">DailyMenu</span>
                <span className="text-lg md:text-xl font-bold font-display bg-gradient-to-r from-brand-400 to-emerald-300 bg-clip-text text-transparent">AI</span>
                <Badge variant="brand" size="sm" className="hidden sm:inline-flex ml-1 scale-90">v2.4 Live</Badge>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider -mt-1 hidden sm:block">SMART MENUS & REAL-TIME QUEUES</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="/#interactive-demo" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
              AI Vision Engine
            </a>
            <a href="/#multilingual" className="hover:text-white transition-colors">Multilingual</a>
            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link 
              to={`/customer/${activeVendor.id}/menu`}
              className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              Live Demo Stall
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/vendor">
                  <Button variant="outline" size="sm" leftIcon={<Layers className="w-4 h-4 text-brand-400" />}>
                    Vendor Hub
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-obsidian-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {user.name.charAt(0)}
                  </div>
                  <Button variant="ghost" size="xs" onClick={logout} className="text-slate-400 hover:text-red-400">
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="glow" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/signup">
              <Button variant="primary" size="xs">Start Free</Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-850 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-obsidian-900/95 backdrop-blur-2xl px-5 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium">
            <a 
              href="/#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white py-1"
            >
              How It Works
            </a>
            <a 
              href="/#interactive-demo" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white py-1"
            >
              AI Vision Engine
            </a>
            <a 
              href="/#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white py-1"
            >
              Pricing
            </a>
            <Link 
              to={`/customer/${activeVendor.id}/menu`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-400 py-1 font-semibold flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Live Customer Demo Store
            </Link>
            <Link 
              to="/vendor" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white py-1 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-brand-400" />
              Vendor Dashboard
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="text-xs text-slate-400">Signed in as <span className="text-white font-semibold">{user.name}</span></div>
                <Button variant="danger" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="glow" size="sm" className="w-full">Create Free Vendor Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
