import { useScrolledNav } from '../../hooks/useScrolledNav';
import { useCartStore } from '../../store/cart';
import { useUIStore } from '../../store/ui';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#shop', label: 'Shop' },
  { href: '#catering', label: 'Catering' },
  { href: '#supperclub', label: 'Supper Club' },
  { href: '#hire', label: 'Hire Staff' },
  { href: '#hampers', label: 'Hampers' },
];

export function Navbar() {
  const scrolled = useScrolledNav();
  const itemCount = useCartStore((s) => s.itemCount());
  const { openCart, toggleMobileMenu, mobileMenuOpen } = useUIStore();

  return (
    <>
      <nav className={`nav ${scrolled ? 'light' : 'dark'}`}>
        <a href="#" className="logo-svg-wrap">
          <span className="logo-text">Tarweeda</span>
        </a>

        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
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

  return (
    <div className={`mob-menu ${mobileMenuOpen ? 'open' : ''}`}>
      {NAV_LINKS.map((link) => (
        <a key={link.href} href={link.href} onClick={closeMobileMenu}>
          {link.label}
        </a>
      ))}
      <a href="#contact" onClick={closeMobileMenu}>Contact</a>
    </div>
  );
}
