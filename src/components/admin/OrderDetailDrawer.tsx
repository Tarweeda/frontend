import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Drawer } from '../ui/Drawer';
import { Spinner } from '../ui/Spinner';
import './OrderDetailDrawer.css';

interface Props {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailDrawer({ orderId, onClose }: Props) {
  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: async () => { const { data } = await api.get(`/admin/orders/${orderId}`); return data; },
    enabled: !!orderId,
  });

  return (
    <Drawer open={!!orderId} onClose={onClose}>
      <div className="order-detail">
        <div className="order-detail-head">
          <h2>Order Details</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {isLoading || !order ? <Spinner /> : (
          <>
            <div className="order-detail-section">
              <div className="order-detail-row">
                <span className="order-detail-label">Order #</span>
                <span className="order-detail-value">{order.order_number}</span>
              </div>
              <div className="order-detail-row">
                <span className="order-detail-label">Date</span>
                <span className="order-detail-value">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="order-detail-row">
                <span className="order-detail-label">Customer</span>
                <span className="order-detail-value">{order.customer_name}<br /><span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{order.customer_email}</span></span>
              </div>
              <div className="order-detail-row">
                <span className="order-detail-label">Fulfilment</span>
                <span className="order-detail-value" style={{ textTransform: 'capitalize' }}>{order.fulfilment_type}</span>
              </div>
              {order.delivery_address && (
                <div className="order-detail-row">
                  <span className="order-detail-label">Address</span>
                  <span className="order-detail-value">{order.delivery_address}</span>
                </div>
              )}
              {order.notes && (
                <div className="order-detail-row">
                  <span className="order-detail-label">Notes</span>
                  <span className="order-detail-value">{order.notes}</span>
                </div>
              )}
              <div className="order-detail-row">
                <span className="order-detail-label">Payment</span>
                <span className={`status-badge ${order.payment_status}`}>{order.payment_status}</span>
              </div>
              <div className="order-detail-row">
                <span className="order-detail-label">Status</span>
                <span className={`status-badge ${order.order_status}`}>{order.order_status}</span>
              </div>
            </div>

            <div className="order-detail-section">
              <h3>Items</h3>
              <table className="order-items-table">
                <thead>
                  <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item: any) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>&pound;{(item.unit_price_pence / 100).toFixed(2)}</td>
                      <td>&pound;{(item.line_total_pence / 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-detail-totals">
              <div className="order-detail-row">
                <span>Subtotal</span>
                <span>&pound;{(order.subtotal_pence / 100).toFixed(2)}</span>
              </div>
              {order.delivery_fee_pence > 0 && (
                <div className="order-detail-row">
                  <span>Delivery</span>
                  <span>&pound;{(order.delivery_fee_pence / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="order-detail-row order-detail-total">
                <span>Total</span>
                <span>&pound;{(order.total_pence / 100).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
