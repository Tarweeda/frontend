import { useCartStore } from '../../store/cart';
import { useUIStore } from '../../store/ui';
import './StickyBasketBar.css';

export function StickyBasketBar() {
  const itemCount = useCartStore((s) => s.itemCount());
  const subtotal = useCartStore((s) => s.subtotal());
  const openCart = useUIStore((s) => s.openCart);

  if (itemCount === 0) return null;

  return (
    <div className={`sticky-basket ${itemCount > 0 ? 'show' : ''}`}>
      <div className="sb-info">
        <span className="sb-count">{itemCount}</span>
        <span className="sb-label">
          <strong>{itemCount} item{itemCount !== 1 ? 's' : ''}</strong> in your basket
        </span>
      </div>
      <span className="sb-total">£{(subtotal / 100).toFixed(2)}</span>
      <button className="sb-open-btn" onClick={openCart}>
        View Basket
      </button>
    </div>
  );
}
