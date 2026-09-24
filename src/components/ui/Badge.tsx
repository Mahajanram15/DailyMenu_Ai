import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'amber' | 'emerald' | 'indigo' | 'danger' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors select-none";

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-md gap-1.5",
    md: "text-xs px-2.5 py-1 rounded-lg gap-1.5",
    lg: "text-sm px-3 py-1.5 rounded-xl gap-2 font-semibold",
  };

  const variantStyles = {
    default: "bg-obsidian-800 text-slate-300 border border-slate-700/60",
    brand: "bg-brand-500/15 text-brand-400 border border-brand-500/30",
    amber: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    indigo: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
    danger: "bg-red-500/15 text-red-400 border border-red-500/30",
    outline: "bg-transparent text-slate-300 border border-slate-700",
    glass: "bg-white/5 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm",
  };

  const dotColors = {
    default: "bg-slate-400",
    brand: "bg-brand-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
    indigo: "bg-indigo-400",
    danger: "bg-red-400",
    outline: "bg-slate-400",
    glass: "bg-emerald-400",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {dot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
