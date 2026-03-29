import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

const ORDER_STATUSES = ['received', 'preparing', 'ready', 'delivered', 'collected', 'cancelled'];

export function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => { const { data } = await api.get('/admin/orders'); return data; },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/admin/orders/${id}/status`, { order_status: status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  return (
    <div>
      <div className="admin-page-header"><h1>Orders</h1><p>View and manage customer orders.</p></div>
      {isLoading ? <Spinner /> : !orders?.length ? <p className="admin-empty">No orders yet.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td className="name-cell">{o.order_number}</td>
                  <td>{o.customer_name}<br /><span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{o.customer_email}</span></td>
                  <td>£{(o.total_pence / 100).toFixed(2)}</td>
                  <td><span className={`status-badge ${o.payment_status}`}>{o.payment_status}</span></td>
                  <td>
                    <select className="status-select" value={o.order_status} onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value })}>
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
