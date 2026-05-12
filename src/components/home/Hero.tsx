import { useHeroSlider } from '../../hooks/useHeroSlider';
import { useSection } from '../../hooks/useSiteContent';
import './Hero.css';

export function Hero() {
  const { slides } = useSection('hero');
  const { current, next, prev, goTo, pause, resume } = useHeroSlider(slides.length);

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
        {slides.map((slide, i) => (
          <div className="slide" key={i}>
            <div
              className="slide-bg"
              style={
                slide.bgImage
                  ? {
                      backgroundImage: `url(${slide.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            />
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
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'on' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
