import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'terra' | 'ghost';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx('btn', `btn-${variant}`, loading && 'loading', className)}
      disabled={disabled || loading}
      {...props}
    >
      {children}
      {loading && <span className="btn-spinner" />}
    </button>
  );
}
