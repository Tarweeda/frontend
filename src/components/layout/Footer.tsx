import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <span className="f-brand">Tarweeda</span>
      <p className="f-tag">From the fields of Palestine — handcrafted with affection.</p>
      <ul className="f-links">
        <li><a href="#shop">Shop</a></li>
        <li><a href="#catering">Catering</a></li>
        <li><a href="#supperclub">Supper Club</a></li>
        <li><a href="#hampers">Hampers</a></li>
      </ul>
    </footer>
  );
}
