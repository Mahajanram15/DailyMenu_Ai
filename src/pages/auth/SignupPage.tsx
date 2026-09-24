import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, Store, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/ui';
import { useApp } from '../../context/AppContext';

export const SignupPage: React.FC = () => {
  const [stallName, setStallName] = useState('Bangalore Chaat & Chai Hub');
  const [email, setEmail] = useState('owner@chaathub.in');
  const [phone, setPhone] = useState('+91 98450 77123');
  const [city, setCity] = useState('Bengaluru, Karnataka');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, 'vendor');
      setIsLoading(false);
      navigate('/vendor');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center items-center p-4 relative overflow-hidden py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-brand-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex items-center gap-1.5 font-display font-extrabold text-2xl text-white">
          DailyMenu <span className="text-brand-400">AI</span>
        </div>
      </Link>

      {/* Signup Card */}
      <div className="w-full max-w-lg glass-dropdown rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative z-10">
        
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Create Free Vendor Stall</h2>
            <Badge variant="emerald" size="sm">14-Day Pro Free</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Start accepting QR orders and live smart tokens in under 2 minutes</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Food Stall / Restaurant Name"
            placeholder="e.g. Punjabi Tadka Corner"
            value={stallName}
            onChange={(e) => setStallName(e.target.value)}
            leftIcon={<Store className="w-4 h-4 text-slate-400" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              placeholder="owner@stall.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              label="WhatsApp Phone"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stall Location / City"
              placeholder="Koramangala, Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              label="Create Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>

          <div className="p-3.5 rounded-xl bg-obsidian-850/80 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-brand-400" /> Free QR stand printable PDF included
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-brand-400" /> Instant direct UPI payouts to your existing QR
            </div>
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Launch My AI Smart Menu
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign in to stall console
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};
