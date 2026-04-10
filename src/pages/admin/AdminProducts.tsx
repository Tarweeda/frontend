import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { useConfirmStore } from '../../store/confirm';
import './AdminPages.css';

export function AdminProducts() {
  const queryClient = useQueryClient();
  const showConfirm = useConfirmStore((s) => s.showConfirm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => { const { data } = await api.get('/admin/products'); return data; },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/admin/products/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setModalOpen(true); };
  const handleDelete = (id: string, name: string) => {
    showConfirm({ title: 'Remove Product', message: `Remove "${name}" from stock?`, confirmLabel: 'Remove', onConfirm: () => deleteMutation.mutate(id) });
  };

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Products</h1>
          <p>Manage your product catalog.</p>
        </div>
        <Button variant="primary" onClick={openCreate}>+ Add Product</Button>
      </div>

      {isLoading ? <Spinner /> : !products?.length ? (
        <div className="admin-empty">No products yet. Add your first product above.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id}>
                  <td className="name-cell">{p.name}</td>
                  <td>{p.category}</td>
                  <td>&pound;{(p.price_pence / 100).toFixed(2)}</td>
                  <td>{p.unit}</td>
                  <td>
                    <span className={`status-badge ${p.in_stock ? 'confirmed' : 'failed'}`}>
                      {p.in_stock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn" onClick={() => openEdit(p)}>Edit</button>
                      <button className="admin-action-btn danger" onClick={() => handleDelete(p.id, p.name)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} product={editing} />
    </div>
  );
}
