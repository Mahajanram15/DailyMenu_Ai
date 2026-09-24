import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "skeleton-shimmer rounded-xl",
          className
        )
      )}
      {...props}
    />
  );
};

export interface StatusIndicatorProps {
  status: 'open' | 'rush' | 'closed' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, showText = true, size = 'md' }) => {
  const configs = {
    open: { label: 'Open for Orders', color: 'bg-emerald-400', ring: 'bg-emerald-400/30' },
    rush: { label: 'Rush Hour (High Demand)', color: 'bg-amber-400', ring: 'bg-amber-400/30' },
    closed: { label: 'Closed', color: 'bg-slate-500', ring: 'bg-slate-500/30' },
    pending: { label: 'Order Received', color: 'bg-electric-400', ring: 'bg-electric-400/30' },
    preparing: { label: 'In the Kitchen', color: 'bg-amber-400', ring: 'bg-amber-400/30' },
    ready: { label: 'Ready for Pickup', color: 'bg-brand-400', ring: 'bg-brand-400/30' },
    completed: { label: 'Completed', color: 'bg-slate-400', ring: 'bg-slate-400/30' },
    cancelled: { label: 'Cancelled', color: 'bg-red-400', ring: 'bg-red-400/30' },
  };

  const config = configs[status] || configs.open;

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.ring)} />
        <span className={clsx("relative inline-flex rounded-full", dotSizes[size], config.color)} />
      </span>
      {showText && (
        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">{config.label}</span>
      )}
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={twMerge(clsx("flex flex-col items-center justify-center text-center p-8 md:p-12 glass-panel rounded-2xl border border-slate-800/80 my-4", className))}>
      {icon && (
        <div className="p-4 rounded-2xl bg-obsidian-850/80 border border-slate-700/50 text-brand-400 mb-4 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold font-display text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1.5 mb-6 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
      <div className="space-y-1">
        {breadcrumbs && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-white transition-colors">{b.label}</a>
                ) : (
                  <span className="text-slate-300 font-medium">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-sm text-slate-400 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
