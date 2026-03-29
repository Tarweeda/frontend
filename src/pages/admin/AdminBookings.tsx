import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

export function AdminBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => { const { data } = await api.get('/admin/bookings'); return data; },
  });

  return (
    <div>
      <div className="admin-page-header"><h1>Supper Club Bookings</h1><p>View all reservations.</p></div>
      {isLoading ? <Spinner /> : !bookings?.length ? <p className="admin-empty">No bookings yet.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Ref</th><th>Guest</th><th>Email</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id}>
                  <td className="name-cell">{b.booking_ref}</td>
                  <td>{b.first_name} {b.last_name}</td>
                  <td>{b.email}</td>
                  <td><span className={`status-badge ${b.payment_status}`}>{b.payment_status}</span></td>
                  <td><span className={`status-badge ${b.booking_status}`}>{b.booking_status}</span></td>
                  <td style={{ fontSize: '0.75rem' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
