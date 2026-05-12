import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useSection } from '../../hooks/useSiteContent';
import './Story.css';

export function Story() {
  const s = useSection('story');

  return (
    <section className="story" id="about">
      <Container>
        <div className="story-grid">
          <Reveal>
            <img src={s.image || '/story.jpg'} alt="The Tarweeda story" className="story-img" />
          </Reveal>
          <Reveal className="story-text">
            <span className="label">{s.label}</span>
            <h2>{s.headingPre}<em>{s.headingEm}</em><br />{s.headingPost}</h2>
            {s.paragraphs.map((p, i) => (
              <p className="story-body" key={i}>{p}</p>
            ))}
            {s.emphasisLine && (
              <p className="story-body"><strong>{s.emphasisLine}</strong></p>
            )}
            <div className="story-sig">{s.signature}</div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
