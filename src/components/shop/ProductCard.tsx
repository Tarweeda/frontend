import type { Product } from '../../types/product';
import { useCartStore } from '../../store/cart';
import { getProductImageUrl } from '../../lib/supabase';
import './ProductCard.css';

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const cartQty = useCartStore(
    (s) => s.items.find((i) => i.id === product.id)?.qty ?? 0
  );
  const imgUrl = getProductImageUrl(product.image_path);

  return (
    <div className="prod-card">
      <div className="p-illus">
        {imgUrl ? (
          <img src={imgUrl} alt={product.name} />
        ) : (
          <div className="p-illus-placeholder" />
        )}
        <div className="p-illus-overlay" />
        <div className="p-badges">
          <span className={`p-badge ${product.category === 'staples' ? 'st' : 'pa'}`}>
            {product.tag}
          </span>
        </div>
      </div>
      <div className="p-info">
        <div className="p-name">{product.name}</div>
        <div className="p-desc">{product.tagline}</div>
        <div className="p-action-row">
          <div className="p-price-group">
            <div className="p-price">{formatPrice(product.price_pence)}</div>
            <div className="p-unit">{product.unit}</div>
          </div>
          <div className="p-add-wrap">
            {cartQty === 0 ? (
              <button
                className="p-add-btn"
                onClick={() => addItem(product)}
                disabled={!product.in_stock}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add</span>
              </button>
            ) : (
              <div className="p-stepper on">
                <button
                  className="st-btn minus"
                  onClick={() => {
                    if (cartQty <= 1) removeItem(product.id);
                    else updateQty(product.id, -1);
                  }}
                >
                  −
                </button>
                <div className="st-sep" />
                <span className="st-n">{cartQty}</span>
                <div className="st-sep" />
                <button
                  className="st-btn"
                  onClick={() => updateQty(product.id, 1)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
