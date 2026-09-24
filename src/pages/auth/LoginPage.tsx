import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, Store, ShieldCheck, Check } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/ui';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('rajesh@chaichaat.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'vendor' | 'customer'>('vendor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
      if (role === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/customer/chai-chaat-koramangala/menu');
      }
    }, 800);
  };

  const setDemoCredentials = (demoRole: 'vendor' | 'customer') => {
    setRole(demoRole);
    if (demoRole === 'vendor') {
      setEmail('rajesh@chaichaat.in');
      setPassword('vendor2026');
    } else {
      setEmail('foodie.priya@gmail.com');
      setPassword('diner2026');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex items-center gap-1.5 font-display font-extrabold text-2xl text-white">
          DailyMenu <span className="text-brand-400">AI</span>
        </div>
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-md glass-dropdown rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative z-10">
        
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage your stall menu and smart queue</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-obsidian-850 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDemoCredentials('vendor')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              role === 'vendor'
                ? 'bg-brand-500 text-obsidian-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Food Vendor
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials('customer')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-brand-500 text-obsidian-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer / Diner
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="chef@kitchen.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-obsidian-850 border-slate-700 text-brand-500 focus:ring-brand-500" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setError('');
                setEmail('rajesh@chaichaat.in');
                setPassword('password123');
              }}
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              Reset Demo Password
            </button>
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {role === 'vendor' ? 'Access Vendor Console' : 'Enter Customer Store'}
          </Button>
        </form>

        {/* Quick Demo Pre-fill helper */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 font-semibold hover:underline">
              Create free account
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};
