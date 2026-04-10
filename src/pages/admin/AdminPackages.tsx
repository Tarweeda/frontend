import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { PackageFormModal } from '../../components/admin/PackageFormModal';
import { useConfirmStore } from '../../store/confirm';
import './AdminPages.css';

export function AdminPackages() {
  const queryClient = useQueryClient();
  const showConfirm = useConfirmStore((s) => s.showConfirm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterEvent, setFilterEvent] = useState('');

  const { data: events } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => { const { data } = await api.get('/admin/events'); return data; },
  });

  const { data: packages, isLoading } = useQuery({
    queryKey: ['admin-packages', filterEvent],
    queryFn: async () => {
      const url = filterEvent ? `/admin/packages?event_id=${filterEvent}` : '/admin/packages';
      const { data } = await api.get(url);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/admin/packages/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-packages'] }),
  });

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setModalOpen(true); };
  const handleDelete = (id: string, name: string) => {
    showConfirm({ title: 'Delete Package', message: `Delete package "${name}"?`, confirmLabel: 'Delete', onConfirm: () => deleteMutation.mutate(id) });
  };

  const getEventName = (eventId: string) => {
    const ev = events?.find((e: any) => e.id === eventId);
    return ev ? ev.name : 'Unknown event';
  };

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Supper Club Packages</h1>
          <p>Manage booking packages per event.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ Add Package</Button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select className="status-select" style={{ minWidth: '220px' }} value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
          <option value="">All Events</option>
          {events?.map((ev: any) => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? <Spinner /> : !packages?.length ? (
        <div className="admin-empty">{filterEvent ? 'No packages for this event yet.' : 'No packages yet.'} Add one above.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Event</th>
                <th>Price</th>
                <th>Guests</th>
                <th>Inclusions</th>
                <th>Featured</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p: any) => (
                <tr key={p.id}>
                  <td style={{ fontSize: '1.2rem' }}>{p.icon}</td>
                  <td className="name-cell">{p.name}</td>
                  <td style={{ fontSize: '0.78rem' }}>{getEventName(p.event_id)}</td>
                  <td>{p.is_enquiry ? 'Enquiry' : `\u00A3${(p.price_pence / 100).toFixed(0)}`}</td>
                  <td>{p.guests}</td>
                  <td style={{ fontSize: '0.78rem', maxWidth: '180px' }}>{p.inclusions}</td>
                  <td>{p.is_featured ? <span className="status-badge confirmed">Yes</span> : '-'}</td>
                  <td>{p.is_enquiry ? <span className="status-badge pending">Enquiry</span> : <span className="status-badge paid">Paid</span>}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => openEdit(p)}>Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PackageFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        pkg={editing}
        defaultEventId={filterEvent}
        events={events ?? []}
      />
    </div>
  );
}
