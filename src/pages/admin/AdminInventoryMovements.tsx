import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { DatePicker } from '../../components/ui/DatePicker';
import './AdminPages.css';

type MovType = 'IN' | 'OUT' | 'ADJUSTMENT' | '';

const TYPE_BADGE: Record<string, string> = {
  IN: 'confirmed',
  OUT: 'failed',
  ADJUSTMENT: 'pending',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function AdminInventoryMovements() {
  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState(searchParams.get('product_id') ?? '');
  const [type, setType] = useState<MovType>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [productId, type, from, to]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory-movements', productId, type, from, to, page],
    queryFn: async () => {
      const params: Record<string, string> = { page: String(page), limit: '50' };
      if (productId) params.product_id = productId;
      if (type) params.type = type;
      if (from) params.from = from;
      if (to) params.to = to;
      const { data } = await api.get('/admin/inventory/movements', { params });
      return data as { data: any[]; total: number; page: number; limit: number };
    },
  });

  const movements = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Movement History</h1>
          <p>Full audit log of all stock changes.</p>
        </div>
        <Link to="/admin/inventory" className="admin-action-btn" style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
          ← Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="field" style={{ minWidth: 200 }}>
          <label className="field-label">Product ID (paste)</label>
          <input
            className="field-input"
            placeholder="Filter by product ID…"
            value={productId}
            onChange={(e) => setProductId(e.target.value.trim())}
          />
        </div>
        <div className="field">
          <label className="field-label">Type</label>
          <select className="field-input" value={type} onChange={(e) => setType(e.target.value as MovType)}>
            <option value="">All</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">From</label>
          <DatePicker className="field-input dp-light-popup" value={from} onChange={setFrom} placeholder="From date" />
        </div>
        <div className="field">
          <label className="field-label">To</label>
          <DatePicker className="field-input dp-light-popup" value={to} onChange={setTo} placeholder="To date" />
        </div>
        {(productId || type || from || to) && (
          <button
            className="admin-action-btn"
            onClick={() => { setProductId(''); setType(''); setFrom(''); setTo(''); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {isLoading ? <Spinner /> : movements.length === 0 ? (
        <div className="admin-empty">No movements found for the selected filters.</div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Reference</th>
                  <th>User</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m: any) => (
                  <tr key={m.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(m.created_at)}</td>
                    <td className="name-cell">{m.products?.name ?? m.product_id}</td>
                    <td>
                      <span className={`status-badge ${TYPE_BADGE[m.type] ?? ''}`}>{m.type}</span>
                    </td>
                    <td>
                      <strong style={{ color: m.type === 'OUT' ? '#C0392B' : '#27AE60' }}>
                        {m.type === 'OUT' ? '−' : '+'}{m.quantity}
                      </strong>
                    </td>
                    <td style={{ fontSize: '0.75rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.reference_id ? m.reference_id.slice(0, 8) + '…' : '—'}
                    </td>
                    <td>{m.created_by ?? '—'}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.reason ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
                Page {page} of {totalPages} ({total} records)
              </span>
              <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
