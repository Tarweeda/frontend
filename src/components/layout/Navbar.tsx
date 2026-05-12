import { useScrolledNav } from '../../hooks/useScrolledNav';
import { useCartStore } from '../../store/cart';
import { useUIStore } from '../../store/ui';
import { useSection } from '../../hooks/useSiteContent';
import logo from '../../assets/logo.png';
import './Navbar.css';

export function Navbar() {
  const scrolled = useScrolledNav();
  const itemCount = useCartStore((s) => s.itemCount());
  const { openCart, toggleMobileMenu, mobileMenuOpen } = useUIStore();
  const nav = useSection('nav');

  return (
    <>
      <nav className={`nav ${scrolled ? 'light' : 'dark'}`}>
        <a href="#" className="logo-svg-wrap">
          <img src={nav.logo || logo} alt="Tarweeda" className="logo-img" />
        </a>

        <ul className="nav-links">
          {nav.links.map((link, i) => (
            <li key={i}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="cart-btn" onClick={openCart}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Basket
            <span className={`cart-n ${itemCount > 0 ? 'on' : ''}`}>{itemCount}</span>
          </button>
          <button
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <MobileMenu />
    </>
  );
}

function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu } = useUIStore();
  const nav = useSection('nav');

  return (
    <div className={`mob-menu ${mobileMenuOpen ? 'open' : ''}`}>
      {nav.links.map((link, i) => (
        <a key={i} href={link.href} onClick={closeMobileMenu}>
          {link.label}
        </a>
      ))}
      <a href="#contact" onClick={closeMobileMenu}>{nav.contactLabel}</a>
    </div>
  );
}
