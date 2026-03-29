import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './AdminLayout.css';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/products', label: 'Products', icon: '🫙' },
  { path: '/admin/orders', label: 'Orders', icon: '📦' },
  { path: '/admin/events', label: 'Events', icon: '🕯' },
  { path: '/admin/bookings', label: 'Bookings', icon: '🪑' },
  { path: '/admin/catering', label: 'Catering', icon: '🍽' },
  { path: '/admin/hire', label: 'Hire', icon: '👨‍🍳' },
  { path: '/admin/hampers', label: 'Hampers', icon: '🎁' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Tarweeda" />
          <span>Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>Logout</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
