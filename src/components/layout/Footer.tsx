import { useSection } from '../../hooks/useSiteContent';
import './Footer.css';

export function Footer() {
  const f = useSection('footer');

  return (
    <footer className="footer">
      <span className="f-brand">{f.brand}</span>
      <p className="f-tag">{f.tagline}</p>
      <ul className="f-links">
        {f.links.map((link, i) => (
          <li key={i}><a href={link.href}>{link.label}</a></li>
        ))}
      </ul>
    </footer>
  );
}
