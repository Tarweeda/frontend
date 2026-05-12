import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!isTokenValid(token)) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
