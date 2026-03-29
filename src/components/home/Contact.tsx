import './Contact.css';

export function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <span className="label" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1rem' }}>London · Made to Order</span>
        <h2>From our kitchen<br />to <em>yours</em></h2>
        <p className="contact-p">Stock your pantry, send a gift, or plan a communal feast.</p>
        <div className="contact-cards">
          <a href="mailto:hello@tarweeda.com" className="contact-card">
            <div className="contact-card-icon">✉</div>
            <h4>Email Us</h4>
            <span>hello@tarweeda.com</span>
          </a>
          <a href="https://instagram.com/tarweeda" target="_blank" rel="noopener" className="contact-card">
            <div className="contact-card-icon">◈</div>
            <h4>Instagram</h4>
            <span>@tarweeda</span>
          </a>
        </div>
      </div>
    </section>
  );
}
