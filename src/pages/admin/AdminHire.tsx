import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

const STATUSES = ['new', 'contacted', 'quoted', 'confirmed', 'declined'];

export function AdminHire() {
  const queryClient = useQueryClient();
  const { data: enquiries, isLoading } = useQuery({
    queryKey: ['admin-hire'],
    queryFn: async () => { const { data } = await api.get('/admin/hire/enquiries'); return data; },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/admin/hire/enquiries/${id}`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hire'] }),
  });

  return (
    <div>
      <div className="admin-page-header"><h1>Hire Enquiries</h1><p>Manage staffing requests.</p></div>
      {isLoading ? <Spinner /> : !enquiries?.length ? <p className="admin-empty">No enquiries yet.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Ref</th><th>Name</th><th>Email</th><th>Staff</th><th>Guests</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {enquiries.map((e: any) => (
                <tr key={e.id}>
                  <td className="name-cell">{e.ref_code}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.staff_needed?.join(', ') || '—'}</td>
                  <td>{e.guest_count || '—'}</td>
                  <td>
                    <select className="status-select" value={e.status} onChange={(ev) => updateStatus.mutate({ id: e.id, status: ev.target.value })}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
