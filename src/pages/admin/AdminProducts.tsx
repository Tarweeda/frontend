import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { getProductImageUrl } from '../../lib/supabase';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { AdminIcon } from '../../components/admin/AdminIcon';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { useConfirmStore } from '../../store/confirm';
import './AdminPages.css';

export function AdminProducts() {
  const queryClient = useQueryClient();
  const showConfirm = useConfirmStore((s) => s.showConfirm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => { const { data } = await api.get('/admin/products'); return data; },
  });

  const categories = useMemo(
    () => Array.from(new Set((products ?? []).map((p: any) => p.category).filter(Boolean))) as string[],
    [products],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? []).filter((p: any) => {
      const matchesSearch = !q || p.name?.toLowerCase().includes(q);
      const matchesCat = !cat || p.category === cat;
      return matchesSearch && matchesCat;
    });
  }, [products, search, cat]);

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
        <>
          <div className="admin-filters">
            <input
              className="field-input"
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="field-input field-select" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {!filtered.length ? (
            <div className="admin-empty">No products match your filters.</div>
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
                  {filtered.map((p: any) => {
                    const img = getProductImageUrl(p.image_path);
                    return (
                      <tr key={p.id}>
                        <td className="name-cell">
                          <div className="prod-name-cell">
                            {img ? (
                              <img className="prod-thumb" src={img} alt={p.name} loading="lazy" />
                            ) : (
                              <span className="prod-thumb placeholder"><AdminIcon name="package" size={18} /></span>
                            )}
                            <span>{p.name}</span>
                          </div>
                        </td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} product={editing} />
    </div>
  );
}
