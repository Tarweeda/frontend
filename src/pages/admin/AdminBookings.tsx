import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

const BOOKING_STATUSES = ['confirmed', 'cancelled', 'attended', 'no_show'];

export function AdminBookings() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => { const { data } = await api.get('/admin/bookings'); return data; },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/admin/bookings/${id}/status`, { booking_status: status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1>Supper Club Bookings</h1>
        <p>View and manage all reservations.</p>
      </div>

      {isLoading ? <Spinner /> : !bookings?.length ? <p className="admin-empty">No bookings yet.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Guest</th>
                <th>Email</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id}>
                  <td className="name-cell">{b.booking_ref}</td>
                  <td>{b.first_name} {b.last_name}</td>
                  <td>{b.email}</td>
                  <td><span className={`status-badge ${b.payment_status}`}>{b.payment_status}</span></td>
                  <td>
                    <select
                      className="status-select"
                      value={b.booking_status}
                      onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value })}
                    >
                      {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
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
