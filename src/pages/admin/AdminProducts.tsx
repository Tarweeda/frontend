import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

export function AdminProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => { const { data } = await api.get('/products'); return data; },
  });

  return (
    <div>
      <div className="admin-page-header">
        <h1>Products</h1>
        <p>Manage your product catalog.</p>
      </div>
      {isLoading ? <Spinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Unit</th><th>Stock</th></tr></thead>
            <tbody>
              {products?.map((p: any) => (
                <tr key={p.id}>
                  <td className="name-cell">{p.name}</td>
                  <td>{p.category}</td>
                  <td>£{(p.price_pence / 100).toFixed(2)}</td>
                  <td>{p.unit}</td>
                  <td><span className={`status-badge ${p.in_stock ? 'confirmed' : 'failed'}`}>{p.in_stock ? 'In Stock' : 'Out'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
