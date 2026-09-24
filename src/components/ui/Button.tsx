import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow' | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none active:scale-[0.97] magnetic-cta";

    const sizeStyles = {
      xs: "text-xs px-2.5 py-1.5 gap-1.5 rounded-lg",
      sm: "text-xs px-3 py-2 gap-2 rounded-lg font-medium",
      md: "text-sm px-4 py-2.5 gap-2.5",
      lg: "text-base px-6 py-3.5 gap-3 font-semibold",
      icon: "p-2.5 rounded-xl aspect-square justify-center",
    };

    const variantStyles = {
      primary: "bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 focus:ring-brand-400 border border-brand-400/40",
      glow: "bg-gradient-to-r from-brand-500 via-emerald-400 to-brand-500 hover:from-brand-400 hover:to-emerald-300 text-obsidian-950 font-extrabold shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] border border-emerald-200/50",
      amber: "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-obsidian-950 font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 focus:ring-amber-400 border border-amber-300/40",
      secondary: "bg-obsidian-800 hover:bg-obsidian-750 text-slate-100 hover:text-white border border-slate-700/80 shadow-md focus:ring-slate-400 hover:border-slate-500",
      outline: "bg-transparent hover:bg-obsidian-800/80 text-slate-200 hover:text-white border border-slate-700 hover:border-brand-500/60 focus:ring-brand-400 shadow-sm",
      ghost: "bg-transparent hover:bg-obsidian-800/80 text-slate-300 hover:text-white focus:ring-slate-500",
      danger: "bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 focus:ring-red-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
