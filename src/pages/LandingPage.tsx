import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  Tv, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ChevronDown, 
  Layers, 
  Users, 
  QrCode, 
  Store,
  DollarSign,
  Flame,
  Award,
  Smartphone,
  Check,
  Star,
  ShoppingBag,
  BellRing
} from 'lucide-react';
import { Button, Card, Badge, AnimatedCounter } from '../components/ui';
import { InteractiveAiDemo } from '../components/landing/InteractiveAiDemo';
import { Navbar } from '../components/layout/Navbar';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { activeVendor } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the AI Photo to Menu feature work?",
      a: "Simply snap a photo of your fresh vegetable crates, dairy stock, or morning prep. DailyMenu AI recognizes raw ingredients, calculates yield costs, auto-generates appetizing multilingual descriptions in Marathi, Hindi & English, and optimizes daily selling prices to ensure zero leftover inventory."
    },
    {
      q: "Do my customers need to download any mobile app?",
      a: "No! Diners simply scan the QR code placed on your stall counter or tables using their regular phone camera. It opens an instant lightweight digital menu with direct UPI payment and live animated token tracking."
    },
    {
      q: "Can I connect this to a TV or tablet in my food stall?",
      a: "Yes. DailyMenu AI includes a dedicated Big-Screen Token Board URL (/vendor/queue) designed specifically for smart TVs and Android tablets, showing now-serving and preparing tokens with voice/chime announcements."
    },
    {
      q: "Which languages are supported for Indian street food stalls?",
      a: "We offer native culinary translations for English, Marathi (मराठी), and Hindi (हिन्दी), with phonetic transliteration for regional street food dishes."
    },
    {
      q: "What hardware do I need to get started?",
      a: "Just your smartphone! Any basic Android or iPhone with an internet connection is all you need to snap ingredients, manage live kitchen orders, and view intelligence analytics."
    }
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-brand-500/30 selection:text-brand-300">
      <Navbar />

      {/* Hero Section with Ambient Radiant Glow */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        
        {/* Subtle grid & radiant glowing drifting meshes */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-brand-500/15 to-emerald-400/10 blur-[140px] rounded-full pointer-events-none -z-10 animate-mesh-slow" />
        <div className="absolute top-1/3 right-10 w-[550px] h-[400px] bg-electric-500/12 blur-[160px] rounded-full pointer-events-none -z-10 animate-mesh" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-page-enter">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-500/40 shadow-lg shadow-brand-500/10 hover:border-brand-400 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200">The Next-Gen Food Stall Operating System</span>
            <span className="text-slate-500">|</span>
            <span className="text-xs font-bold text-brand-400 flex items-center gap-1">
              Zero-Waste AI Engine <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Turn Today's Ingredients Into <span className="gradient-text-emerald text-glow">Tomorrow's Orders.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            AI-powered dynamic menus and smart token queues built for India's fastest-moving food vendors, cloud kitchens, and street-food icons.
          </p>

          {/* Primary CTAs with magnetic hover effect */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button 
                variant="glow" 
                size="lg" 
                className="w-full text-base sm:px-8 py-4 font-bold shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.65)]" 
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start Free Today
              </Button>
            </Link>
            <a href="#interactive-demo" className="w-full sm:w-auto">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full text-base sm:px-8 py-4 font-semibold" 
                leftIcon={<Sparkles className="w-4 h-4 text-brand-400" />}
              >
                See Live Pipeline
              </Button>
            </a>
          </div>

          {/* Floating Dual Mockup Showcase (Mobile Customer Ordering + Vendor KDS Dashboard) */}
          <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto text-left">
            
            {/* Left: Floating Phone Mockup (Customer Mobile Ordering Experience) */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              <div className="w-72 sm:w-80 rounded-[44px] p-3 bg-obsidian-900 border-4 border-slate-700/90 shadow-2xl relative shadow-brand-500/15 animate-float hover:scale-[1.02] transition-transform duration-500">
                {/* Speaker Notch */}
                <div className="w-24 h-4 bg-obsidian-950 rounded-full mx-auto mb-2 border border-slate-800" />
                
                {/* Phone Screen Container */}
                <div className="rounded-[32px] bg-obsidian-950 p-4 border border-slate-800 space-y-3.5 text-xs text-slate-100 overflow-hidden">
                  
                  {/* Top Phone Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">☕</span>
                      <span className="font-bold text-white text-xs">Chai & Chaat Junction</span>
                    </div>
                    <Badge variant="emerald" size="sm" dot>Open</Badge>
                  </div>

                  {/* Sample Dish Card with Hover Zoom */}
                  <div className="rounded-2xl p-2.5 bg-obsidian-900 border border-slate-800 flex gap-2.5 group/phone-card hover:border-brand-500/50 transition-colors">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80" 
                        alt="Paneer Pav" 
                        className="w-full h-full object-cover group-hover/phone-card:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate text-xs">Paneer Masala Pav</h4>
                      <p className="text-[10px] text-slate-400 truncate">पनीर मसाला पाव</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-brand-400 font-mono">₹80</span>
                        <span className="text-[9px] bg-brand-500 text-obsidian-950 px-2 py-0.5 rounded-md font-black shadow-sm">+ ADD</span>
                      </div>
                    </div>
                  </div>

                  {/* Token Callout Floating Pill with pulsating glow */}
                  <div className="rounded-2xl p-3.5 bg-gradient-to-r from-brand-500/20 via-obsidian-900 to-obsidian-900 border border-brand-500/50 text-center space-y-1 shadow-lg animate-token-glow">
                    <span className="text-[9px] font-bold text-brand-400 uppercase font-mono tracking-wider">YOUR LIVE TOKEN</span>
                    <div className="text-3xl font-black font-mono text-white tracking-tight">#A24</div>
                    <span className="text-[10px] text-emerald-400 font-semibold block">Estimated Wait: ~6 mins</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Right: Vendor Live KDS Dashboard Preview Mockup */}
            <div className="lg:col-span-7 rounded-3xl p-6 glass-panel-glow border-2 border-brand-500/50 shadow-2xl space-y-5 animate-float-reverse hover:border-brand-400 transition-colors duration-500">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Kitchen Display System (KDS)</h3>
                    <p className="text-[11px] text-slate-400">Real-time zero-congestion ticket stream</p>
                  </div>
                </div>
                <Badge variant="emerald" size="sm" dot>Active Telemetry</Badge>
              </div>

              {/* Sample Ticket Row in Mockup */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                
                <div className="p-3 rounded-2xl bg-obsidian-850 border border-electric-500/30 space-y-1.5 hover:border-electric-400 transition-colors">
                  <div className="flex justify-between font-mono font-bold text-electric-300">
                    <span>#A25</span>
                    <span>₹140</span>
                  </div>
                  <div className="text-[11px] text-white font-semibold truncate">2× Kulhad Chai</div>
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-electric-500/20 text-electric-300 font-semibold">New Ticket</span>
                </div>

                <div className="p-3 rounded-2xl bg-obsidian-850 border border-amber-500/30 space-y-1.5 hover:border-amber-400 transition-colors">
                  <div className="flex justify-between font-mono font-bold text-amber-300">
                    <span>#A24</span>
                    <span>₹210</span>
                  </div>
                  <div className="text-[11px] text-white font-semibold truncate">1× Misal Pav</div>
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">In Kitchen</span>
                </div>

                <div className="p-3 rounded-2xl bg-obsidian-850 border border-brand-500/40 space-y-1.5 hover:border-brand-400 transition-colors">
                  <div className="flex justify-between font-mono font-bold text-brand-300">
                    <span>#A23</span>
                    <span>₹80</span>
                  </div>
                  <div className="text-[11px] text-white font-semibold truncate">1× Vada Pav</div>
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold">Ready</span>
                </div>

              </div>

              {/* Live Metric Stats Bar in Mockup */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">TODAY'S TURNOVER</span>
                  <span className="text-base font-extrabold text-white font-mono">₹48,250</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">AVG PREP TIME</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">5.8 mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">WASTE PREVENTED</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">₹9,420</span>
                </div>
              </div>

            </div>

          </div>

          {/* Animated Statistics Banner with AnimatedCounter */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t border-white/5 text-center">
            
            <div className="p-5 rounded-3xl glass-panel space-y-1.5 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                <AnimatedCounter value={1200} suffix="+" />
              </div>
              <span className="text-xs text-slate-400 font-medium block">Active Food Stalls</span>
            </div>

            <div className="p-5 rounded-3xl glass-panel space-y-1.5 hover:border-brand-500/40 transition-all hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-brand-400 tracking-tight">
                ₹<AnimatedCounter value={4.8} decimals={1} suffix=" Cr+" />
              </div>
              <span className="text-xs text-slate-400 font-medium block">Direct UPI Processed</span>
            </div>

            <div className="p-5 rounded-3xl glass-panel space-y-1.5 hover:border-amber-500/40 transition-all hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tracking-tight">
                <AnimatedCounter value={84} suffix="%" />
              </div>
              <span className="text-xs text-slate-400 font-medium block">Line Congestion Cut</span>
            </div>

            <div className="p-5 rounded-3xl glass-panel space-y-1.5 hover:border-emerald-500/40 transition-all hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                <AnimatedCounter value={32} suffix="%" />
              </div>
              <span className="text-xs text-slate-400 font-medium block">Food Waste Eliminated</span>
            </div>

          </div>

          {/* Interactive AI Demo Widget Section */}
          <div id="interactive-demo" className="mt-16 sm:mt-24 scroll-mt-24">
            <InteractiveAiDemo />
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="brand" size="md">Simplicity First</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              How DailyMenu AI Powers Fast Stalls
            </h2>
            <p className="text-base text-slate-400">
              Transform chaotic lines into a calm, high-turnover profit machine in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group hover:border-brand-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2 font-mono">STEP 01</div>
              <h3 className="text-xl font-bold font-display text-white mb-3">Snap Morning Stock</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Take one quick photo of your vegetable crates, dairy cartons, or meat prep. Our computer vision auto-detects stock and suggests daily high-profit specials.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 font-mono">STEP 02</div>
              <h3 className="text-xl font-bold font-display text-white mb-3">Instant QR & Dynamic Menu</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your digital menu updates instantly across all counter QR stands with accurate pricing, multilingual translations (मराठी/हिन्दी), and live Veg/Non-Veg tags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group hover:border-electric-500/40 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-electric-500/10 border border-electric-500/30 flex items-center justify-center text-electric-400 mb-6 group-hover:scale-110 transition-transform">
                <Tv className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-electric-400 uppercase tracking-widest mb-2 font-mono">STEP 03</div>
              <h3 className="text-xl font-bold font-display text-white mb-3">Smart Token & Zero Congestion</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Customers pay via UPI, receive an animated digital token on their phone, and watch the TV queue board without crowding your serving counter.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Multilingual Support Section */}
      <section id="multilingual" className="py-20 md:py-32 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <Badge variant="indigo" size="md" className="mb-3">Bharat-First Localization</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
            Speak Every Customer's Regional Tongue
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-12">
            No language barriers. Your menu effortlessly renders in English, Marathi, and Hindi with a single tap.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { lang: "English", sample: "Crispy Dahi Puri", code: "EN", desc: "Crisp puris filled with spiced potato & yogurt" },
              { lang: "मराठी (Marathi)", sample: "कोल्हापुरी स्पेशल मिसळ पाव", code: "MR", desc: "झणझणीत मटकी उसळ, फरसाण आणि बटर पाव" },
              { lang: "हिन्दी (Hindi)", sample: "अमृतसरी पनीर टिक्का स्लाइडर", code: "HI", desc: "मखमली पनीर टिक्का और पुदीना चटनी पाव" },
            ].map((l, idx) => (
              <div key={idx} className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-brand-500/40 hover:-translate-y-1.5 transition-all duration-300 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-400 px-2.5 py-1 rounded-lg bg-brand-500/10">
                    {l.code}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white">{l.lang}</h4>
                <div className="p-3.5 rounded-xl bg-obsidian-850 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-brand-300 font-sans">{l.sample}</div>
                  <p className="text-[11px] text-slate-400 font-sans">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-obsidian-900/60 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="amber" size="md">Transparent Pricing</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              Built for Single Stalls & Fast Franchises
            </h2>
            <p className="text-base text-slate-400">
              Start completely free, scale as your daily token volumes grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            
            {/* Free Tier */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Street Stall Starter</h3>
                <p className="text-xs text-slate-400 mb-6">Perfect for tea stalls, chaat corners, and food trucks.</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-xs text-slate-400"> / forever free</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Up to 50 daily orders
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> AI photo menu generator (5 / day)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Digital QR standee download
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Basic token counter
                  </li>
                </ul>
              </div>
              <Link to="/signup">
                <Button variant="outline" size="md" className="w-full">Get Started Free</Button>
              </Link>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="glass-panel-glow rounded-3xl p-8 border-2 border-brand-500/70 relative flex flex-col justify-between transform md:-translate-y-2 shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">High-Volume Pro</h3>
                <p className="text-xs text-slate-400 mb-6">For busy cafes, biryani centers, and fast food hubs.</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">₹799</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Unlimited daily orders & tokens
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Unlimited AI Vision & Costing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Dedicated TV Token Queue Board
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Multilingual Menu Auto-Translate
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Waste intelligence & analytics
                  </li>
                </ul>
              </div>
              <Link to="/signup">
                <Button variant="glow" size="md" className="w-full">Start 14-Day Pro Trial</Button>
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Franchise & Food Court</h3>
                <p className="text-xs text-slate-400 mb-6">For multi-outlet chains and campus canteens.</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">₹2,499</span>
                  <span className="text-xs text-slate-400"> / outlet</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Multi-counter KDS management
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Custom branding & domain
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Central inventory synchronization
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> 24/7 Priority WhatsApp support
                  </li>
                </ul>
              </div>
              <Link to="/signup">
                <Button variant="outline" size="md" className="w-full">Contact Sales</Button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-3">
            <Badge variant="brand" size="md">Got Questions?</Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${activeFaq === index ? 'rotate-180 text-brand-400' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <Badge variant="brand" size="lg" className="scale-105">Join 1,200+ Smart Food Vendors</Badge>
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Ready to Supercharge Your Food Stall?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Launch your AI smart menu in under 2 minutes. No expensive POS hardware, zero transaction delays.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="glow" size="lg" className="w-full sm:w-auto px-8 py-4 font-bold" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create Free Vendor Stall
              </Button>
            </Link>
            <Link to={`/customer/${activeVendor.id}`}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4" leftIcon={<Store className="w-4 h-4 text-emerald-400" />}>
                Experience Customer Storefront
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-obsidian-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <span className="font-bold text-white font-display text-sm">DailyMenu AI</span>
              <p className="text-[11px] text-slate-500">© 2026 DailyMenu AI Inc. Built for Bharat's fastest food hubs.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#interactive-demo" className="hover:text-white transition-colors">AI Pipeline</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/vendor" className="text-brand-400 hover:text-brand-300 transition-colors">Vendor Console</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
