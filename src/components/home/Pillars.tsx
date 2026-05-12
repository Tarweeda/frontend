import { Reveal } from '../ui/Reveal';
import { useSection } from '../../hooks/useSiteContent';
import './Pillars.css';

export function Pillars() {
  const { items } = useSection('pillars');

  return (
    <div className="pillars">
      <Reveal className="pillars-strip">
        {items.map((p, i) => (
          <a key={i} href={p.href} className="pillar-card">
            <div className="pillar-card-overlay" />
            <div className="pillar-card-content">
              <h3>{p.title}</h3>
              <span className="pillar-card-sub">{p.sub}</span>
            </div>
          </a>
        ))}
      </Reveal>
    </div>
  );
}
