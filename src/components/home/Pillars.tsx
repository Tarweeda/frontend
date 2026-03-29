import { Reveal } from '../ui/Reveal';
import './Pillars.css';

const PILLARS = [
  { icon: '🌿', title: 'Field Staples', desc: "Olive oil, za'atar, sumac, tahina — the essentials that anchor every Palestinian kitchen." },
  { icon: '🫙', title: 'Home Preserves', desc: 'Small-batch mouneh — makdous, pickled lemon, qazha — crafted with care.' },
  { icon: '🍽', title: 'Catering & Gatherings', desc: 'Full table spreads for family gatherings, events, and celebrations.' },
];

export function Pillars() {
  return (
    <div className="pillars">
      <Reveal className="pillars-grid">
        {PILLARS.map((p) => (
          <a key={p.title} href="#shop" className="pillar">
            <div className="pillar-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </a>
        ))}
      </Reveal>
    </div>
  );
}
