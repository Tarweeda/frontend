import { useState, useMemo } from 'react';
import { Reveal } from '../ui/Reveal';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { StickyBasketBar } from './StickyBasketBar';
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
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const { data: products, isLoading } = useProducts(filter === 'all' ? undefined : filter);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price_pence - b.price_pence);
    if (sort === 'price-desc') list.sort((a, b) => b.price_pence - a.price_pence);
    return list;
  }, [products, search, sort]);

  return (
    <section className="shop" id="shop">
      <div className="shop-in">
        <Reveal className="shop-header">
          <div className="shop-header-top">
            <div>
              <span className="eyebrow" style={{ color: 'var(--g3)' }}>The Collection</span>
              <h2 className="sec-title">Shop <em>Tarweeda</em></h2>
            </div>
          </div>

          <div className="shop-cats">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                className={`shop-cat ${filter === tab.value ? 'on' : ''}`}
                onClick={() => setFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="shop-filter-row">
            <div className="shop-filter-left">
              <span className="s-count">{filtered.length} products</span>
            </div>
            <div className="shop-filter-right">
              <div className="s-wrap">
                <span className="s-icon">🔍</span>
                <input
                  type="text"
                  className="s-inp"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="s-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </Reveal>

        <Reveal>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Spinner />
            </div>
          ) : filtered.length === 0 ? (
            <div className="shop-empty">
              <div className="shop-empty-icon">🫙</div>
              <p>No products found</p>
            </div>
          ) : (
            <div className="prod-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Reveal>
      </div>

      <StickyBasketBar />
    </section>
  );
}
