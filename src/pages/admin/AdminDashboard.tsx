import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { AdminIcon } from '../../components/admin/AdminIcon';
import './AdminPages.css';

const QUICK_LINKS = [
  { to: '/admin/products', label: 'Products', icon: 'package' },
  { to: '/admin/orders', label: 'Orders', icon: 'shopping-bag' },
  { to: '/admin/events', label: 'Events', icon: 'calendar' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'box' },
];

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [orders, bookings, catering, hire] = await Promise.all([
        api.get('/admin/orders').catch(() => ({ data: [] })),
        api.get('/admin/bookings').catch(() => ({ data: [] })),
        api.get('/admin/catering/enquiries').catch(() => ({ data: [] })),
        api.get('/admin/hire/enquiries').catch(() => ({ data: [] })),
      ]);
      return {
        totalOrders: orders.data.length,
        totalBookings: bookings.data.length,
        pendingCatering: orders.data.filter((o: any) => o.status === 'new').length || catering.data.filter((e: any) => e.status === 'new').length,
        pendingHire: hire.data.filter((e: any) => e.status === 'new').length,
        revenue: orders.data.filter((o: any) => o.payment_status === 'paid').reduce((s: number, o: any) => s + (o.total_pence || 0), 0),
        recentOrders: orders.data.slice(0, 5),
      };
    },
    staleTime: 30000,
  });

  const kpis = [
    { icon: 'shopping-bag', value: `£${((stats?.revenue || 0) / 100).toFixed(0)}`, label: 'Total Revenue' },
    { icon: 'package', value: stats?.totalOrders ?? 0, label: 'Orders' },
    { icon: 'calendar', value: stats?.totalBookings ?? 0, label: 'Bookings' },
    { icon: 'clipboard', value: (stats?.pendingCatering || 0) + (stats?.pendingHire || 0), label: 'Pending Enquiries' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Tarweeda admin.</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : (
        <>
          <div className="stats-grid">
            {kpis.map((k) => (
              <div className="stat-card kpi" key={k.label}>
                <span className="stat-card-icon"><AdminIcon name={k.icon} size={20} /></span>
                <div>
                  <div className="stat-card-value">{k.value}</div>
                  <div className="stat-card-label">{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-quick">
            {QUICK_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="admin-action-btn">
                <AdminIcon name={l.icon} size={16} /> {l.label}
              </Link>
            ))}
          </div>

          <div className="admin-top-bar">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="admin-action-btn">View all</Link>
          </div>

          {!stats?.recentOrders?.length ? (
            <div className="admin-empty">No orders yet.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o: any) => (
                    <tr key={o.id}>
                      <td className="name-cell">{o.order_number}</td>
                      <td>{o.customer_name}</td>
                      <td>&pound;{(o.total_pence / 100).toFixed(2)}</td>
                      <td><span className={`status-badge ${o.payment_status}`}>{o.payment_status}</span></td>
                      <td style={{ fontSize: '0.75rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
