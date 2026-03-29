import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Spinner } from '../../components/ui/Spinner';
import './AdminPages.css';

export function AdminEvents() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => { const { data } = await api.get('/events'); return data; },
  });

  return (
    <div>
      <div className="admin-page-header"><h1>Supper Club Events</h1><p>Manage upcoming events and menus.</p></div>
      {isLoading ? <Spinner /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Name</th><th>Theme</th><th>Location</th><th>Seats</th><th>Status</th></tr></thead>
            <tbody>
              {events?.map((e: any) => (
                <tr key={e.id}>
                  <td>{new Date(e.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="name-cell">{e.name}</td>
                  <td>{e.theme}</td>
                  <td>{e.location}</td>
                  <td>{e.seats_left}/{e.total_seats}</td>
                  <td><span className={`status-badge ${e.status}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
