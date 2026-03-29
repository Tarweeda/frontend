import { type ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
