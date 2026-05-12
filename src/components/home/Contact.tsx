import { useSection } from '../../hooks/useSiteContent';
import './Contact.css';

export function Contact() {
  const c = useSection('contact');

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <span className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1rem' }}>{c.label}</span>
        <h2>{c.headingLine1}<br />{c.headingLine2Pre}<em>{c.headingLine2Em}</em></h2>
        <p className="contact-p">{c.body}</p>
        <div className="contact-cards">
          <a href={`mailto:${c.email}`} className="contact-card">
            <div className="contact-card-icon">✉</div>
            <h4>Email Us</h4>
            <span>{c.email}</span>
          </a>
          <a href={c.instagramUrl} target="_blank" rel="noopener" className="contact-card">
            <div className="contact-card-icon">◈</div>
            <h4>Instagram</h4>
            <span>{c.instagramHandle}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
