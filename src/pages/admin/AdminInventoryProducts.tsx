import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Modal, ModalHead } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { useToastStore } from '../../store/toast';
import './AdminPages.css';
import '../../components/admin/AdminForms.css';

type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

interface StockProduct {
  id: string;
  name: string;
  sku?: string;
  category: string;
  quantity: number;
  sold_qty: number;
  low_stock_threshold: number;
  stock_status: StockStatus;
  updated_at: string;
}

const STATUS_LABELS: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
};

const STATUS_BADGE: Record<StockStatus, string> = {
  'in-stock': 'confirmed',
  'low-stock': 'pending',
  'out-of-stock': 'failed',
};

export function AdminInventoryProducts() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [restockTarget, setRestockTarget] = useState<StockProduct | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<StockProduct | null>(null);

  const [restockQty, setRestockQty] = useState(1);
  const [restockNote, setRestockNote] = useState('');
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustDir, setAdjustDir] = useState<'add' | 'subtract'>('add');
  const [adjustReason, setAdjustReason] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-inventory-products', statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/admin/inventory/products', { params });
      return data as StockProduct[];
    },
  });

  const restockMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/inventory/restock', {
        product_id: restockTarget!.id,
        quantity: restockQty,
        note: restockNote || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-summary'] });
      showToast(`Restocked ${restockTarget?.name}`, 'success');
      setRestockTarget(null);
      setRestockQty(1);
      setRestockNote('');
    },
  });

  const adjustMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/inventory/adjust', {
        product_id: adjustTarget!.id,
        quantity: adjustQty,
        direction: adjustDir,
        reason: adjustReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-summary'] });
      showToast(`Adjusted stock for ${adjustTarget?.name}`, 'success');
      setAdjustTarget(null);
      setAdjustQty(1);
      setAdjustDir('add');
      setAdjustReason('');
    },
  });

  const filtered = (products ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Stock List</h1>
          <p>View quantities, restock, and adjust inventory.</p>
        </div>
        <Link to="/admin/inventory" className="admin-action-btn" style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
          ← Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        <input
          className="field-input"
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <select
          className="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="low">Low Stock</option>
          <option value="oos">Out of Stock</option>
        </select>
      </div>

      {isLoading ? <Spinner /> : !filtered.length ? (
        <div className="admin-empty">No products match the current filters.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Available</th>
                <th>Sold</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="name-cell">{p.name}</td>
                  <td>{p.sku ?? '—'}</td>
                  <td><strong>{p.quantity}</strong></td>
                  <td>{p.sold_qty}</td>
                  <td>{p.low_stock_threshold}</td>
                  <td>
                    <span className={`status-badge ${STATUS_BADGE[p.stock_status]}`}>
                      {STATUS_LABELS[p.stock_status]}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-action-btn"
                        onClick={() => { setRestockTarget(p); setRestockQty(1); setRestockNote(''); }}
                      >
                        Restock
                      </button>
                      <button
                        className="admin-action-btn"
                        onClick={() => { setAdjustTarget(p); setAdjustQty(1); setAdjustDir('add'); setAdjustReason(''); }}
                      >
                        Adjust
                      </button>
                      <Link
                        to={`/admin/inventory/movements?product_id=${p.id}`}
                        className="admin-action-btn"
                        style={{ textDecoration: 'none' }}
                      >
                        History
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restock Modal */}
      <Modal open={!!restockTarget} onClose={() => setRestockTarget(null)} maxWidth="420px">
        <ModalHead title={`Restock — ${restockTarget?.name}`} onClose={() => setRestockTarget(null)} />
        <form
          className="admin-form"
          onSubmit={(e) => { e.preventDefault(); restockMutation.mutate(); }}
        >
          <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '1rem' }}>
            Current quantity: <strong>{restockTarget?.quantity}</strong>
          </p>
          <Input
            label="Quantity to add"
            type="number"
            value={restockQty}
            onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
            required
          />
          <Textarea
            label="Note (optional)"
            value={restockNote}
            onChange={(e) => setRestockNote(e.target.value)}
            rows={2}
          />
          {restockMutation.isError && (
            <div className="admin-form-error">Failed to restock. Please try again.</div>
          )}
          <div className="admin-form-actions">
            <Button variant="outline" type="button" onClick={() => setRestockTarget(null)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={restockMutation.isPending}>
              Add Stock
            </Button>
          </div>
        </form>
      </Modal>

      {/* Adjust Modal */}
      <Modal open={!!adjustTarget} onClose={() => setAdjustTarget(null)} maxWidth="420px">
        <ModalHead title={`Adjust Stock — ${adjustTarget?.name}`} onClose={() => setAdjustTarget(null)} />
        <form
          className="admin-form"
          onSubmit={(e) => { e.preventDefault(); adjustMutation.mutate(); }}
        >
          <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '1rem' }}>
            Current quantity: <strong>{adjustTarget?.quantity}</strong>
          </p>
          <div className="admin-form-row">
            <Input
              label="Quantity"
              type="number"
              value={adjustQty}
              onChange={(e) => setAdjustQty(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
            <div className="field">
              <label className="field-label">Direction</label>
              <select
                className="field-input"
                value={adjustDir}
                onChange={(e) => setAdjustDir(e.target.value as 'add' | 'subtract')}
              >
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (−)</option>
              </select>
            </div>
          </div>
          <Textarea
            label="Reason (required)"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            rows={2}
            required
          />
          {adjustMutation.isError && (
            <div className="admin-form-error">Failed to adjust. Please try again.</div>
          )}
          <div className="admin-form-actions">
            <Button variant="outline" type="button" onClick={() => setAdjustTarget(null)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={adjustMutation.isPending}>
              Save Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
