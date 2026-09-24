import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Maximize2, 
  Volume2, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  BellRing,
  ArrowRight,
  Store
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, PageHeader } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { normalizeOrderStatus } from '../../services/dbService';

export const VendorQueuePage: React.FC = () => {
  const { orders, activeVendor, updateOrderStatus } = useApp();
  const { showToast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const readyTokens = orders.filter(o => normalizeOrderStatus(o.status) === 'READY');
  const preparingTokens = orders.filter(o => normalizeOrderStatus(o.status) === 'PREPARING');
  const pendingTokens = orders.filter(o => {
    const s = normalizeOrderStatus(o.status);
    return s === 'PLACED' || s === 'ACCEPTED';
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleAnnounceToken = (tokenNumber: number, customerName: string) => {
    showToast({
      type: 'success',
      title: `🔔 Token #${tokenNumber} Announced!`,
      message: `Audio chime sent to stall speakers & WhatsApp pinged to ${customerName}.`,
      duration: 3500
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="Smart Token Queue & Public TV Board"
        description="Stream this view onto any Smart TV, iPad, or Android box mounted above your counter to eliminate line crowding."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              leftIcon={<Maximize2 className="w-4 h-4" />}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'TV Fullscreen Mode'}
            </Button>
          </div>
        }
      />

      {/* Main Big-Screen TV Display Board Container */}
      <div className="rounded-3xl bg-obsidian-900 border-2 border-slate-700/80 shadow-2xl p-6 md:p-10 relative overflow-hidden space-y-8">
        
        {/* Top Header of Display Board */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-2xl">
              {activeVendor.logo}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-display text-white tracking-tight">{activeVendor.name}</h2>
              <p className="text-xs text-brand-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE ORDER TRACKER • COUNTER EXPRESS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-mono">AVG ESTIMATED WAIT</span>
              <span className="text-lg font-extrabold text-amber-400 font-mono">~{activeVendor.avgPrepTime} MINS</span>
            </div>
            <div className="text-right pl-6 border-l border-slate-800">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block font-mono">STALL CLOCK</span>
              <span className="text-lg font-extrabold text-white font-mono">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Big Split Section: READY FOR PICKUP vs PREPARING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: READY FOR PICKUP (Glow Green) */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-brand-500/15 via-obsidian-950 to-obsidian-950 border-2 border-brand-500/50 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-500/30">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-brand-400 animate-ping" />
                <h3 className="text-lg md:text-xl font-black font-display uppercase tracking-wider text-brand-300">
                  Ready For Pickup
                </h3>
              </div>
              <Badge variant="emerald" size="lg" className="font-mono font-bold">
                {readyTokens.length} Orders Ready
              </Badge>
            </div>

            {readyTokens.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <div className="text-4xl text-slate-600">🔔</div>
                <h4 className="text-base font-bold text-slate-400">All ready orders collected!</h4>
                <p className="text-xs text-slate-500">Next batch finishing in the kitchen shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {readyTokens.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl p-5 bg-obsidian-850/90 border border-brand-500/40 flex flex-col justify-between space-y-3 group hover:border-brand-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">TOKEN</span>
                      <button
                        onClick={() => handleAnnounceToken(order.tokenNumber, order.customerName)}
                        className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500 hover:text-obsidian-950 transition-colors"
                        title="Play Voice/Audio Chime"
                      >
                        <BellRing className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white group-hover:text-brand-300 transition-colors">
                      {order.tokenCode ? (order.tokenCode.startsWith('#') ? order.tokenCode : `#${order.tokenCode}`) : `#A${order.tokenNumber}`}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-xs font-bold text-slate-200 block truncate">{order.customerName}</span>
                      <span className="text-[11px] text-slate-400">{order.tableOrCounter || 'Counter Pickup'}</span>
                    </div>

                    <Button
                      variant="primary"
                      size="xs"
                      className="w-full mt-1"
                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                    >
                      Hand Over
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right: PREPARING IN KITCHEN (Amber) */}
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-amber-500/10 via-obsidian-950 to-obsidian-950 border-2 border-amber-500/40 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-lg md:text-xl font-black font-display uppercase tracking-wider text-amber-300">
                  Preparing In Kitchen
                </h3>
              </div>
              <Badge variant="amber" size="lg" className="font-mono font-bold">
                {preparingTokens.length + pendingTokens.length} In Line
              </Badge>
            </div>

            {preparingTokens.length === 0 && pendingTokens.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <div className="text-4xl text-slate-600">☕</div>
                <h4 className="text-base font-bold text-slate-400">Kitchen is calm</h4>
                <p className="text-xs text-slate-500">Scan QR on your table to place a fresh order.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[...preparingTokens, ...pendingTokens].map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl p-4 bg-obsidian-850/80 border border-slate-800 text-center space-y-1.5"
                  >
                    <span className="text-[10px] text-slate-400 uppercase font-mono">TOKEN</span>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                      {order.tokenCode ? (order.tokenCode.startsWith('#') ? order.tokenCode : `#${order.tokenCode}`) : `#A${order.tokenNumber}`}
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">{order.customerName}</span>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold">
                      ~{order.estimatedMinutes || 5}m left
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Bottom Ticker for Public Display */}
        <div className="p-4 rounded-2xl bg-obsidian-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Scan the QR code at your table or counter for instant contactless mobile ordering.</span>
          </div>
          <div className="font-mono text-slate-300 shrink-0">
            Powered by DailyMenu AI OS
          </div>
        </div>

      </div>

    </div>
  );
};
