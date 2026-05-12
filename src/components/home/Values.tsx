import { Reveal } from '../ui/Reveal';
import { useSection } from '../../hooks/useSiteContent';
import './Values.css';

export function Values() {
  const { items } = useSection('values');

  return (
    <section className="values-section">
      <div className="values-inner">
        {items.map((v, i) => (
          <Reveal key={i} className="value">
            <h4>{v.title}</h4>
            <p>{v.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
