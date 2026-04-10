import { useState, useMemo } from 'react';
import { Reveal } from '../ui/Reveal';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { StickyBasketBar } from './StickyBasketBar';
import { Spinner } from '../ui/Spinner';
import './ShopSection.css';

type Filter = 'all' | 'staples' | 'pantry';
export type ViewMode = 'grid' | 'list' | 'compact';

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'staples', label: 'Field Staples' },
  { value: 'pantry', label: 'Home Preserves' },
];

export function ShopSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState<ViewMode>('grid');
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
              <div className="view-toggles">
                <button
                  className={`view-btn ${view === 'grid' ? 'on' : ''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  title="Grid"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="5" height="5" rx="1" />
                    <rect x="8" y="1" width="5" height="5" rx="1" />
                    <rect x="1" y="8" width="5" height="5" rx="1" />
                    <rect x="8" y="8" width="5" height="5" rx="1" />
                  </svg>
                </button>
                <button
                  className={`view-btn ${view === 'compact' ? 'on' : ''}`}
                  onClick={() => setView('compact')}
                  aria-label="Compact view"
                  title="Compact"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="3" height="3" rx="0.5" />
                    <rect x="5.5" y="1" width="3" height="3" rx="0.5" />
                    <rect x="10" y="1" width="3" height="3" rx="0.5" />
                    <rect x="1" y="5.5" width="3" height="3" rx="0.5" />
                    <rect x="5.5" y="5.5" width="3" height="3" rx="0.5" />
                    <rect x="10" y="5.5" width="3" height="3" rx="0.5" />
                    <rect x="1" y="10" width="3" height="3" rx="0.5" />
                    <rect x="5.5" y="10" width="3" height="3" rx="0.5" />
                    <rect x="10" y="10" width="3" height="3" rx="0.5" />
                  </svg>
                </button>
                <button
                  className={`view-btn ${view === 'list' ? 'on' : ''}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                  title="List"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="1" y1="3" x2="13" y2="3" />
                    <line x1="1" y1="7" x2="13" y2="7" />
                    <line x1="1" y1="11" x2="13" y2="11" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="shop-filter-right">
              <div className="s-wrap">
                <span className="s-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
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
            <div className={`prod-grid view-${view}`}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} view={view} />
              ))}
            </div>
          )}
        </Reveal>
      </div>

      <StickyBasketBar />
    </section>
  );
}
