import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export function PillButton({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}: PillButtonProps) {
  const baseStyles =
    'rounded-full font-medium inline-flex items-center justify-center transition-all duration-200 active:scale-97 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-4 py-1.5 gap-1.5',
    md: 'text-sm px-6 py-2.5 gap-2',
    lg: 'text-base px-8 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gallery-charcoal text-white hover:bg-slate-900 dark:bg-white dark:text-gallery-obsidian dark:hover:bg-slate-100 shadow-sm',
    secondary:
      'bg-slate-100 text-gallery-charcoal hover:bg-slate-200 dark:bg-gallery-surface-dark dark:text-white dark:hover:bg-slate-800',
    outline:
      'border border-gallery-border text-gallery-charcoal hover:border-gallery-charcoal dark:border-gallery-border-dark dark:text-white dark:hover:border-white bg-transparent',
    gold:
      'bg-gallery-gold text-white hover:bg-gallery-gold-dark shadow-sm tracking-wide',
    ghost:
      'text-gallery-charcoal hover:bg-slate-100/70 dark:text-white dark:hover:bg-white/10 bg-transparent',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
