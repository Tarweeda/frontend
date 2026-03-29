import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import './Story.css';

export function Story() {
  return (
    <section className="story" id="about">
      <Container>
        <div className="story-grid">
          <Reveal>
            <img src="/story.jpg" alt="The Tarweeda story" className="story-img" />
          </Reveal>
          <Reveal className="story-text">
            <span className="label">Our Story</span>
            <h2>Born from <em>memory,</em><br />shaped by love</h2>
            <p className="story-body">
              For two years, there was cooking — for friends, for guests, for neighbours. What started as something loved became something needed. In a time shaped by distance, war, and uncertainty, cooking became a way to stay close: to home, to family in Gaza, to memory.
            </p>
            <p className="story-body">
              In London, something was missing — the real taste of Palestinian home. Not the commercial version, not imitation — but the food we grew up with, the one that carries stories. At gatherings, at protests, at campings — in shared moments of resistance and care.
            </p>
            <p className="story-body"><strong>From all of this — Tarweeda was born.</strong></p>
            <div className="story-sig">— A bridge between traditional pantry goods and modern hospitality, handcrafted with affection.</div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
