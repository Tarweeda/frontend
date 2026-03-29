import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '../../lib/stripe';
import { Button } from '../ui/Button';
import './PaymentForm.css';

function formatPrice(pence: number) { return `£${(pence / 100).toFixed(2)}`; }

interface PaymentFormInnerProps {
  clientSecret: string;
  totalPence: number;
  onSuccess: () => void;
}

function PaymentFormInner({ clientSecret, totalPence, onSuccess }: PaymentFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div>
      <label className="d-lbl">Card details</label>
      <div className="card-element-wrapper">
        <CardElement
          options={{
            style: {
              base: {
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                color: '#2C3A1E',
                '::placeholder': { color: '#8A8D7A' },
              },
            },
          }}
        />
      </div>
      {error && <div className="card-error">{error}</div>}
      <Button variant="primary" loading={loading} onClick={handleSubmit} style={{ width: '100%', marginTop: '0.5rem' }}>
        Pay {formatPrice(totalPence)}
      </Button>
      <p className="pay-secure">Secured by Stripe</p>
    </div>
  );
}

interface PaymentFormProps {
  clientSecret: string;
  totalPence: number;
  onSuccess: () => void;
}

export function PaymentForm({ clientSecret, totalPence, onSuccess }: PaymentFormProps) {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormInner clientSecret={clientSecret} totalPence={totalPence} onSuccess={onSuccess} />
    </Elements>
  );
}
