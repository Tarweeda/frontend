import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

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
      };
    },
    staleTime: 30000,
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Tarweeda admin.</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">£{((stats?.revenue || 0) / 100).toFixed(0)}</div>
            <div className="stat-card-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{stats?.totalOrders || 0}</div>
            <div className="stat-card-label">Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{stats?.totalBookings || 0}</div>
            <div className="stat-card-label">Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">{(stats?.pendingCatering || 0) + (stats?.pendingHire || 0)}</div>
            <div className="stat-card-label">Pending Enquiries</div>
          </div>
        </div>
      )}
    </div>
  );
}
