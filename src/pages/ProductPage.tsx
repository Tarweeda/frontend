import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cart';
import { getProductImageUrl } from '../lib/supabase';
import { Container } from '../components/layout/Container';
import { Reveal } from '../components/ui/Reveal';
import { ProductCard } from '../components/shop/ProductCard';
import './ProductPage.css';

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(slug ?? '');
  const { data: allProducts } = useProducts(product?.category);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const cartQty = useCartStore(
    (s) => s.items.find((i) => i.id === product?.id)?.qty ?? 0
  );

  const related = allProducts?.filter((p) => p.slug !== slug).slice(0, 4) ?? [];

  if (isLoading) {
    return (
      <div className="pp-loading">
        <Container>
          <div className="pp-skeleton-hero">
            <div className="pp-skeleton pp-skeleton-img" />
            <div className="pp-skeleton-info">
              <div className="pp-skeleton pp-skeleton-tag" />
              <div className="pp-skeleton pp-skeleton-title" />
              <div className="pp-skeleton pp-skeleton-sub" />
              <div className="pp-skeleton pp-skeleton-price" />
              <div className="pp-skeleton pp-skeleton-btn" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pp-error">
        <Container>
          <p>Product not found.</p>
          <button className="btn-olive" onClick={() => navigate('/#shop')}>
            Back to Shop
          </button>
        </Container>
      </div>
    );
  }

  const imgUrl = getProductImageUrl(product.image_path);
  const isSt = product.category === 'staples';

  return (
    <div className="pp-page">
      <Container>
        {/* Breadcrumb */}
        <nav className="pp-breadcrumb" aria-label="breadcrumb">
          <Link to="/#shop" className="pp-bc-link">Shop</Link>
          <span className="pp-bc-sep" aria-hidden="true">›</span>
          <span className="pp-bc-current">{product.name}</span>
        </nav>

        {/* Hero: image + detail panel */}
        <div className="pp-hero">
          {/* Image panel */}
          <div className="pp-img-panel">
            {imgUrl ? (
              <img src={imgUrl} alt={product.name} className="pp-img" />
            ) : (
              <div className="pp-img-placeholder" />
            )}
            <div className="pp-img-overlay" />
            <span className={`pp-badge p-badge ${isSt ? 'st' : 'pa'}`}>
              {product.tag}
            </span>
          </div>

          {/* Detail panel */}
          <div className="pp-detail">
            <div className="pp-category label">{product.category}</div>
            <h1 className="pp-name">{product.name}</h1>
            <p className="pp-tagline">{product.tagline}</p>

            <div className="pp-price-row">
              <span className="pp-price">{formatPrice(product.price_pence)}</span>
              <span className="pp-unit">{product.unit}</span>
            </div>

            {!product.in_stock && (
              <p className="pp-oos">Currently out of stock</p>
            )}

            <div className="pp-cta-row">
              {cartQty === 0 ? (
                <button
                  className="pp-add-btn btn-olive"
                  onClick={() => addItem(product)}
                  disabled={!product.in_stock}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add to Basket
                </button>
              ) : (
                <div className="pp-stepper">
                  <button
                    className="pp-st-btn"
                    onClick={() => {
                      if (cartQty <= 1) removeItem(product.id);
                      else updateQty(product.id, -1);
                    }}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="pp-st-n" aria-live="polite">{cartQty}</span>
                  <button
                    className="pp-st-btn"
                    onClick={() => updateQty(product.id, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product story */}
        {product.description && (
          <Reveal>
            <section className="pp-story">
              <div className="pp-story-inner">
                <span className="eyebrow">The Story</span>
                <p className="pp-story-text">{product.description}</p>
              </div>
            </section>
          </Reveal>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <Reveal>
            <section className="pp-related">
              <span className="eyebrow">More from the collection</span>
              <div className="pp-related-grid">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} view="grid" />
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </Container>
    </div>
  );
}
