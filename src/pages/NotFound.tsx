export function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--nav-h)' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 300, color: 'var(--olive-dark)' }}>404</h1>
        <p style={{ color: 'var(--text3)', marginTop: '0.5rem' }}>Page not found</p>
        <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--olive)', borderBottom: '1px solid var(--kraft)', paddingBottom: '0.2rem' }}>
          Back to home
        </a>
      </div>
    </div>
  );
}
