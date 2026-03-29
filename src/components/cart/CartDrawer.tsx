import { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { useUIStore } from '../../store/ui';
import { useCartStore } from '../../store/cart';
import { PaymentForm } from './PaymentForm';
import { api } from '../../lib/api';
import './CartDrawer.css';

function formatPrice(pence: number) { return `£${(pence / 100).toFixed(2)}`; }

export function CartDrawer() {
  const { cartOpen, closeCart, cartStep, setCartStep } = useUIStore();
  const { items, removeItem, updateQty, subtotal, total, fulfilment, setFulfilment, clearCart } = useCartStore();

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '', notes: '' });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalPence, setTotalPence] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: string, value: string) => setCustomerInfo((prev) => ({ ...prev, [field]: value }));

  const goToPayment = async () => {
    if (!customerInfo.name || !customerInfo.email.includes('@') || !customerInfo.address) {
      alert('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        fulfilment_type: fulfilment,
        delivery_address: fulfilment === 'delivery' ? customerInfo.address : undefined,
        notes: customerInfo.notes || undefined,
      });
      setClientSecret(data.client_secret);
      setTotalPence(data.total_pence);
      setCartStep(2);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  const onPaymentSuccess = () => {
    setOrderSuccess(true);
    clearCart();
  };

  const handleClose = () => {
    closeCart();
    if (orderSuccess) {
      setOrderSuccess(false);
      setClientSecret(null);
      setCartStep(0);
      setCustomerInfo({ name: '', email: '', address: '', notes: '' });
    }
  };

  const steps = ['Items', 'Delivery', 'Payment'];

  return (
    <Drawer open={cartOpen} onClose={handleClose}>
      <div className="dr-head">
        <span className="dr-title">Your Basket</span>
        <button className="dr-close" onClick={handleClose}>✕</button>
      </div>

      <div className="dr-steps">
        {steps.map((s, i) => (
          <button key={s} className={`dr-step ${cartStep === i ? 'on' : ''}`} onClick={() => { if (i === 0 || items.length) setCartStep(i as 0 | 1 | 2); }}>
            {s}
          </button>
        ))}
      </div>

      <div className="dr-body">
        {cartStep === 0 && (
          <div>
            {items.length === 0 ? (
              <p className="cart-empty">Your basket is empty.</p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="ci-info">
                      <div className="ci-name">{item.name}</div>
                      <div className="ci-meta">{item.unit}</div>
                      <div className="ci-price">{formatPrice(item.price_pence * item.qty)}</div>
                    </div>
                    <div className="ci-ctrl">
                      <button className="ci-q-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="ci-qty">{item.qty}</span>
                      <button className="ci-q-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      <button className="ci-del" onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
                <button className="d-next" onClick={() => setCartStep(1)}>Continue to Delivery</button>
              </>
            )}
          </div>
        )}

        {cartStep === 1 && (
          <div>
            <div className="d-radio-row">
              <button className={`d-radio ${fulfilment === 'delivery' ? 'on' : ''}`} onClick={() => setFulfilment('delivery')}>Delivery +£5</button>
              <button className={`d-radio ${fulfilment === 'collection' ? 'on' : ''}`} onClick={() => setFulfilment('collection')}>Collection</button>
            </div>
            <p className="d-hint">{fulfilment === 'delivery' ? 'London delivery. Fee: £5.' : 'Collection arranged directly.'}</p>
            <label className="d-lbl">Full name</label>
            <input className="d-inp" value={customerInfo.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your name" />
            <label className="d-lbl">Email</label>
            <input className="d-inp" type="email" value={customerInfo.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" />
            <label className="d-lbl">{fulfilment === 'delivery' ? 'Delivery address' : 'WhatsApp / note'}</label>
            <input className="d-inp" value={customerInfo.address} onChange={(e) => updateField('address', e.target.value)} placeholder={fulfilment === 'delivery' ? 'Street, London, postcode' : 'Your WhatsApp number'} />
            <label className="d-lbl">Notes</label>
            <input className="d-inp" value={customerInfo.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Allergies, requests…" />
            <button className="d-next" onClick={goToPayment} disabled={submitting}>
              {submitting ? 'Creating order…' : 'Continue to Payment'}
            </button>
          </div>
        )}

        {cartStep === 2 && (
          <div>
            {orderSuccess ? (
              <div className="order-success">
                <div className="ok-icon">✦</div>
                <h3 className="ok-title">Order Received</h3>
                <p className="ok-body">Thank you. We'll be in touch to confirm your order.</p>
              </div>
            ) : clientSecret ? (
              <PaymentForm clientSecret={clientSecret} totalPence={totalPence} onSuccess={onPaymentSuccess} />
            ) : (
              <p className="cart-empty">Preparing payment…</p>
            )}
          </div>
        )}
      </div>

      <div className="dr-foot">
        <div className="dr-sub-row"><span>Subtotal</span><span>{formatPrice(subtotal())}</span></div>
        {fulfilment === 'delivery' && <div className="dr-del-row"><span>Delivery</span><span>£5.00</span></div>}
        <div className="dr-total"><span>Total</span><span>{formatPrice(total())}</span></div>
      </div>
    </Drawer>
  );
}
