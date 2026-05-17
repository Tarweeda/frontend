import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { DatePicker } from '../../components/ui/DatePicker';
import './AdminPages.css';

type ReportType = 'stock-in' | 'stock-out' | 'snapshot' | 'low-stock';

const TABS: { id: ReportType; label: string }[] = [
  { id: 'stock-in', label: 'Stock In' },
  { id: 'stock-out', label: 'Stock Out' },
  { id: 'snapshot', label: 'Current Snapshot' },
  { id: 'low-stock', label: 'Low Stock' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatPence(pence?: number) {
  if (pence == null) return '—';
  return `£${(pence / 100).toFixed(2)}`;
}

export function AdminInventoryReports() {
  const [tab, setTab] = useState<ReportType>('snapshot');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [exporting, setExporting] = useState(false);

  const isMovement = tab === 'stock-in' || tab === 'stock-out';

  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory-reports', tab, from, to],
    queryFn: async () => {
      const params: Record<string, string> = { type: tab };
      if (from) params.from = from;
      if (to) params.to = to;
      const { data } = await api.get('/admin/inventory/reports', { params });
      return data as any[];
    },
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: Record<string, string> = { type: tab };
      if (from) params.from = from;
      if (to) params.to = to;

      const response = await api.get('/admin/inventory/reports/export', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const rows = data ?? [];

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Reports</h1>
          <p>View and export inventory reports by date range.</p>
        </div>
        <Link to="/admin/inventory" className="admin-action-btn" style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
          ← Dashboard
        </Link>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.4rem', borderBottom: '1.5px solid var(--kraft, #e0d8c8)', paddingBottom: '0' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--olive-dark, #2d5a1b)' : 'var(--text3)',
              borderBottom: tab === t.id ? '2px solid var(--olive-dark, #2d5a1b)' : '2px solid transparent',
              marginBottom: '-1.5px',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters + Export */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {isMovement && (
          <>
            <div className="field">
              <label className="field-label">From</label>
              <DatePicker className="field-input dp-light-popup" value={from} onChange={setFrom} placeholder="From date" />
            </div>
            <div className="field">
              <label className="field-label">To</label>
              <DatePicker className="field-input dp-light-popup" value={to} onChange={setTo} placeholder="To date" />
            </div>
          </>
        )}
        <Button
          variant="outline"
          onClick={handleExport}
          loading={exporting}
          disabled={rows.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Results */}
      {isLoading ? <Spinner /> : rows.length === 0 ? (
        <div className="admin-empty">No data for the selected report and date range.</div>
      ) : isMovement ? (
        <MovementTable rows={rows} />
      ) : tab === 'snapshot' ? (
        <SnapshotTable rows={rows} />
      ) : (
        <LowStockTable rows={rows} />
      )}
    </div>
  );
}

function MovementTable({ rows }: { rows: any[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Reference</th>
            <th>Notes</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id}>
              <td style={{ whiteSpace: 'nowrap' }}>{formatDate(r.created_at)}</td>
              <td className="name-cell">{r.products?.name ?? r.product_id}</td>
              <td><strong>{r.quantity}</strong></td>
              <td style={{ fontSize: '0.75rem' }}>{r.reference_id ? r.reference_id.slice(0, 8) + '…' : '—'}</td>
              <td>{r.reason ?? '—'}</td>
              <td>{r.created_by ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SnapshotTable({ rows }: { rows: any[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Available</th>
            <th>Threshold</th>
            <th>Cost Price</th>
            <th>Sell Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id}>
              <td className="name-cell">{r.name}</td>
              <td>{r.sku ?? '—'}</td>
              <td>{r.category}</td>
              <td><strong>{r.quantity}</strong></td>
              <td>{r.low_stock_threshold}</td>
              <td>{formatPence(r.cost_price_pence)}</td>
              <td>{formatPence(r.price_pence)}</td>
              <td>
                <span className={`status-badge ${r.quantity === 0 ? 'failed' : r.quantity <= r.low_stock_threshold ? 'pending' : 'confirmed'}`}>
                  {r.quantity === 0 ? 'Out of Stock' : r.quantity <= r.low_stock_threshold ? 'Low' : 'In Stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LowStockTable({ rows }: { rows: any[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Available</th>
            <th>Threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id}>
              <td className="name-cell">{r.name}</td>
              <td>{r.sku ?? '—'}</td>
              <td><strong>{r.quantity}</strong></td>
              <td>{r.low_stock_threshold}</td>
              <td>
                <span className={`status-badge ${r.quantity === 0 ? 'failed' : 'pending'}`}>
                  {r.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
