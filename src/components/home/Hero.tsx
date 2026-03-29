import { useHeroSlider } from '../../hooks/useHeroSlider';
import './Hero.css';

interface HeroSlide {
  tag: string;
  heading: string;
  headingEm: string;
  subtitle: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  watermark: string;
}

const SLIDES: HeroSlide[] = [
  {
    tag: 'Palestinian Pantry',
    heading: 'From the Fields',
    headingEm: 'of Palestine',
    subtitle: 'Authentic ingredients, seasonally sourced. Handcrafted with care, delivered across London.',
    cta1: { label: 'Shop the Pantry', href: '#shop' },
    cta2: { label: 'Supper Club', href: '#supperclub' },
    watermark: 'تزويدة',
  },
  {
    tag: 'Supper Club',
    heading: 'A Table',
    headingEm: 'Worth Gathering For',
    subtitle: 'Intimate Palestinian dining experiences. Five courses, twenty seats, one unforgettable evening.',
    cta1: { label: 'View Events', href: '#supperclub' },
    cta2: { label: 'Book a Table', href: '#supperclub' },
    watermark: 'مائدة',
  },
  {
    tag: 'Catering & Events',
    heading: 'Bring Palestine',
    headingEm: 'to Your Table',
    subtitle: 'Private dining, weddings, corporate events. Bespoke Palestinian menus crafted for your occasion.',
    cta1: { label: 'Enquire Now', href: '#catering' },
    cta2: { label: 'Our Menu', href: '#shop' },
    watermark: 'ضيافة',
  },
];

export function Hero() {
  const { current, next, prev, goTo, pause, resume } = useHeroSlider(SLIDES.length);

  return (
    <section
      className="hero"
      id="home"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div
        className="slides-wrap"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div className="slide" key={i}>
            <div className="slide-bg" />
            <div className="slide-grid" />
            <div className="slide-ar">{slide.watermark}</div>
            <div className="slide-content">
              <div className="slide-tag">
                <span className="slide-tag-dot" />
                {slide.tag}
              </div>
              <h1 className="slide-h">
                {slide.heading}
                <em>{slide.headingEm}</em>
              </h1>
              <p className="slide-sub">{slide.subtitle}</p>
              <div className="slide-acts">
                <a href={slide.cta1.href} className="btn btn-olive">
                  {slide.cta1.label}
                </a>
                <a href={slide.cta2.href} className="btn btn-ghost-light">
                  {slide.cta2.label}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="hero-arrow prev" onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className="hero-arrow next" onClick={next} aria-label="Next slide">
        ›
      </button>

      {/* Counter */}
      <div className="hero-counter">
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'on' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <div className="scroll-line">
          <div className="scroll-line-inner" />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
