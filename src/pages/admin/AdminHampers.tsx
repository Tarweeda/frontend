import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { HamperFormModal } from '../../components/admin/HamperFormModal';
import { useConfirmStore } from '../../store/confirm';
import './AdminPages.css';

export function AdminHampers() {
  const queryClient = useQueryClient();
  const showConfirm = useConfirmStore((s) => s.showConfirm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: hampers, isLoading } = useQuery({
    queryKey: ['admin-hampers'],
    queryFn: async () => { const { data } = await api.get('/admin/hampers'); return data; },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/admin/hampers/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-hampers'] }),
  });

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (h: any) => { setEditing(h); setModalOpen(true); };
  const handleDelete = (id: string, name: string) => {
    showConfirm({ title: 'Remove Hamper', message: `Remove "${name}" from stock?`, confirmLabel: 'Remove', onConfirm: () => deleteMutation.mutate(id) });
  };

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Gift Hampers</h1>
          <p>Manage hamper offerings.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ Add Hamper</Button>
      </div>

      {isLoading ? <Spinner /> : !hampers?.length ? (
        <div className="admin-empty">No hampers yet. Add your first hamper above.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Contents</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hampers.map((h: any) => (
                <tr key={h.id}>
                  <td className="name-cell">{h.name}</td>
                  <td>&pound;{(h.price_pence / 100).toFixed(0)}</td>
                  <td style={{ fontSize: '0.78rem', maxWidth: '300px' }}>{h.contents}</td>
                  <td>
                    <span className={`status-badge ${h.in_stock ? 'confirmed' : 'failed'}`}>
                      {h.in_stock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => openEdit(h)}>Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(h.id, h.name)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <HamperFormModal open={modalOpen} onClose={() => setModalOpen(false)} hamper={editing} />
    </div>
  );
}
