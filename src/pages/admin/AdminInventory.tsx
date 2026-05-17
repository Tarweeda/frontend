import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './AdminPages.css';

function formatPence(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export function AdminInventory() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory-summary'],
    queryFn: async () => {
      const { data } = await api.get('/admin/inventory/summary');
      return data;
    },
    refetchInterval: 60_000,
  });

  if (isLoading) return <Spinner />;

  const alerts: any[] = data?.alerts ?? [];
  const topSold: any[] = data?.topSold ?? [];
  const chart: any[] = data?.chart ?? [];

  return (
    <div>
      <div className="admin-top-bar">
        <div className="admin-page-header">
          <h1>Inventory</h1>
          <p>Real-time stock overview and movement tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Link to="/admin/inventory/products" className="admin-action-btn" style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
            Stock List
          </Link>
          <Link to="/admin/inventory/movements" className="admin-action-btn" style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
            Movements
          </Link>
          <Link to="/admin/inventory/reports" className="admin-action-btn" style={{ textDecoration: 'none', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}>
            Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-value">{data?.total ?? 0}</div>
          <div className="stat-card-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{formatPence(data?.totalStockValue ?? 0)}</div>
          <div className="stat-card-label">Stock Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: '#c9a84c' }}>{data?.lowStock ?? 0}</div>
          <div className="stat-card-label">Low Stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value" style={{ color: '#C0392B' }}>{data?.outOfStock ?? 0}</div>
          <div className="stat-card-label">Out of Stock</div>
        </div>
      </div>

      {/* Chart */}
      <div className="admin-table-wrap" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '1.2rem' }}>
          Stock Movements — Last 30 Days
        </h2>
        {chart.length === 0 ? (
          <div className="admin-empty" style={{ padding: '2rem' }}>No movement data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chart} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--kraft, #e0d8c8)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Line type="monotone" dataKey="in" stroke="#2d5a1b" strokeWidth={2} dot={false} name="Stock In" />
              <Line type="monotone" dataKey="out" stroke="#C0392B" strokeWidth={2} dot={false} name="Stock Out" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Alert panel */}
        <div className="admin-table-wrap" style={{ padding: '1.2rem' }}>
          <h2 style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '1rem' }}>
            Low / Out of Stock Alerts
          </h2>
          {alerts.length === 0 ? (
            <div className="admin-empty" style={{ padding: '1.2rem' }}>All products are well stocked.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Threshold</th></tr>
              </thead>
              <tbody>
                {alerts.map((a: any) => (
                  <tr key={a.id}>
                    <td className="name-cell">{a.name}</td>
                    <td>
                      <span className={`status-badge ${a.quantity === 0 ? 'failed' : 'pending'}`}>
                        {a.quantity}
                      </span>
                    </td>
                    <td>{a.low_stock_threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top sold */}
        <div className="admin-table-wrap" style={{ padding: '1.2rem' }}>
          <h2 style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '1rem' }}>
            Top Sold — Last 30 Days
          </h2>
          {topSold.length === 0 ? (
            <div className="admin-empty" style={{ padding: '1.2rem' }}>No sales data yet.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Units Sold</th></tr>
              </thead>
              <tbody>
                {topSold.map((p: any, i: number) => (
                  <tr key={i}>
                    <td className="name-cell">{p.name}</td>
                    <td>{p.sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
