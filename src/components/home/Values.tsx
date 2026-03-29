import { Reveal } from '../ui/Reveal';
import './Values.css';

const VALUES = [
  { title: 'Handcrafted', body: "Every jar, blend, and dish made by hand — no shortcuts. The way it's always been done at home." },
  { title: 'Communal', body: 'Palestinian food is meant to be shared. For the table, for gatherings, for the moments that matter.' },
  { title: 'Cultural Memory', body: 'Each recipe carries a story — of villages, families, of a cuisine that holds history and resistance in every ingredient.' },
];

export function Values() {
  return (
    <section className="values-section">
      <div className="values-inner">
        {VALUES.map((v) => (
          <Reveal key={v.title} className="value">
            <h4>{v.title}</h4>
            <p>{v.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
