import type { Product } from '../../types/product';
import { useCartStore } from '../../store/cart';
import { getProductImageUrl } from '../../lib/supabase';
import './ProductCard.css';

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const imgUrl = getProductImageUrl(product.image_path);

  return (
    <div className="p-card">
      <div className="p-card-img">
        {imgUrl && <img src={imgUrl} alt={product.name} />}
        <span className="p-card-tag">{product.tag}</span>
      </div>
      <div className="p-card-body">
        <div className="p-card-name">{product.name}</div>
        <div className="p-card-tagline">{product.tagline}</div>
        <div className="p-card-foot">
          <div>
            <div className="p-card-price">{formatPrice(product.price_pence)}</div>
            <div className="p-card-unit">{product.unit}</div>
          </div>
          <button
            className="p-card-add"
            onClick={() => addItem(product)}
            title="Add to basket"
            disabled={!product.in_stock}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
