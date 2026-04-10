import { Reveal } from '../ui/Reveal';
import './Pillars.css';

const PILLARS = [
  {
    title: 'Field Staples',
    sub: 'Olive oil · Za\'atar · Sumac · Tahina',
    href: '#shop',
  },
  {
    title: 'Home Preserves',
    sub: 'Makdous · Pickled Lemon · Qazha',
    href: '#shop',
  },
  {
    title: 'Catering',
    sub: 'Gatherings · Events · Celebrations',
    href: '#catering',
  },
];

export function Pillars() {
  return (
    <div className="pillars">
      <Reveal className="pillars-strip">
        {PILLARS.map((p) => (
          <a key={p.title} href={p.href} className="pillar-card">
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
