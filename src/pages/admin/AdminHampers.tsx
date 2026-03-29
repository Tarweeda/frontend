import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

export function AdminHampers() {
  const { data: hampers, isLoading } = useQuery({
    queryKey: ['admin-hampers'],
    queryFn: async () => { const { data } = await api.get('/hampers'); return data; },
  });

  return (
    <div>
      <div className="admin-page-header"><h1>Gift Hampers</h1><p>Manage hamper offerings.</p></div>
      {isLoading ? <Spinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Price</th><th>Contents</th><th>Stock</th></tr></thead>
            <tbody>
              {hampers?.map((h: any) => (
                <tr key={h.id}>
                  <td className="name-cell">{h.name}</td>
                  <td>£{(h.price_pence / 100).toFixed(0)}</td>
                  <td style={{ fontSize: '0.78rem' }}>{h.contents}</td>
                  <td><span className={`status-badge ${h.in_stock ? 'confirmed' : 'failed'}`}>{h.in_stock ? 'In Stock' : 'Out'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
