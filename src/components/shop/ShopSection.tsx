import { useState } from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Spinner } from '../ui/Spinner';
import './ShopSection.css';

type Filter = 'all' | 'staples' | 'pantry';

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'staples', label: 'Field Staples' },
  { value: 'pantry', label: 'Home Preserves' },
];

export function ShopSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const { data: products, isLoading } = useProducts(filter === 'all' ? undefined : filter);

  return (
    <section className="shop-section" id="shop">
      <Container>
        <Reveal className="shop-head">
          <span className="label">The Collection</span>
          <h2>Shop Tarweeda</h2>
          <p>From our kitchen to yours.</p>
        </Reveal>

        <Reveal>
          <div className="shop-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`shop-tab ${filter === tab.value ? 'active' : ''}`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Spinner />
            </div>
          ) : (
            <div className="product-grid">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
