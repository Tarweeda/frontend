import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { EventFormModal } from '../../components/admin/EventFormModal';
import { useConfirmStore } from '../../store/confirm';
import './AdminPages.css';

export function AdminEvents() {
  const queryClient = useQueryClient();
  const showConfirm = useConfirmStore((s) => s.showConfirm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => { const { data } = await api.get('/admin/events'); return data; },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/admin/events/${id}`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/admin/events/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events'] }),
  });

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (e: any) => { setEditing(e); setModalOpen(true); };
  const handleDelete = (id: string, name: string) => {
    showConfirm({ title: 'Cancel Event', message: `Cancel event "${name}"?`, confirmLabel: 'Cancel Event', onConfirm: () => deleteMutation.mutate(id) });
  };

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Supper Club Events</h1>
          <p>Manage upcoming events and menus.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ New Event</Button>
      </div>

      {isLoading ? <Spinner /> : !events?.length ? (
        <div className="admin-empty">No events yet. Create your first event above.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Theme</th>
                <th>Location</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e: any) => (
                <tr key={e.id}>
                  <td>{new Date(e.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="name-cell">{e.name}</td>
                  <td>{e.theme}</td>
                  <td>{e.location}</td>
                  <td>{e.seats_left}/{e.total_seats}</td>
                  <td>
                    <select
                      className="status-select"
                      value={e.status}
                      onChange={(ev) => statusMutation.mutate({ id: e.id, status: ev.target.value })}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="sold_out">Sold Out</option>
                      <option value="past">Past</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => openEdit(e)}>Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(e.id, e.name)}>Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EventFormModal open={modalOpen} onClose={() => setModalOpen(false)} event={editing} />
    </div>
  );
}
