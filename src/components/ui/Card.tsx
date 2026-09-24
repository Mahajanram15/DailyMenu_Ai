import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow' | 'interactive';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-obsidian-900 border border-slate-800/80 shadow-lg",
      glass: "glass-panel shadow-xl",
      glow: "glass-panel-glow",
      interactive: "glass-panel hover:border-slate-600/60 hover:shadow-2xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer",
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            "rounded-2xl p-5 md:p-6 transition-all text-slate-100 overflow-hidden relative",
            variantStyles[variant],
            className
          )
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={twMerge(clsx("flex flex-col space-y-1.5 pb-4", className))} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={twMerge(clsx("text-lg md:text-xl font-bold font-display tracking-tight text-white", className))} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={twMerge(clsx("text-sm text-slate-400", className))} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={twMerge(clsx("", className))} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={twMerge(clsx("flex items-center pt-4 border-t border-slate-800/60 mt-4", className))} {...props} />
);
