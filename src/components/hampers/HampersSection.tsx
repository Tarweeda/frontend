import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useHampers } from '../../hooks/useHampers';
import { getImageUrl } from '../../lib/supabase';
import { Spinner } from '../ui/Spinner';
import './HampersSection.css';

function formatPrice(pence: number) { return `£${(pence / 100).toFixed(0)}`; }

export function HampersSection() {
  const { data: hampers, isLoading } = useHampers();

  return (
    <section className="hampers-section" id="hampers">
      <Container>
        <Reveal className="hampers-head">
          <span className="label">Curated Gifts</span>
          <h2>Gift Hampers</h2>
          <p>Beautifully wrapped collections — perfect for Eid, birthdays, or simply sending warmth.</p>
        </Reveal>

        <Reveal>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
          ) : (
            <div className="hamper-grid">
              {hampers?.map((h) => (
                <div key={h.id} className="hamper">
                  <div className="hamper-img">
                    {h.image_path ? (
                      <img src={getImageUrl('hamper-images', h.image_path)} alt={h.name} />
                    ) : (
                      <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>🎁</span>
                    )}
                  </div>
                  <div className="hamper-body">
                    <div className="hamper-name">{h.name}</div>
                    <p className="hamper-desc">{h.description}</p>
                    <div className="hamper-price">{formatPrice(h.price_pence)}</div>
                    <button
                      className="hamper-btn"
                      onClick={() => window.location.href = `mailto:hello@tarweeda.com?subject=Gift%20Hamper%20—%20${encodeURIComponent(h.name)}`}
                    >
                      Order Hamper
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
