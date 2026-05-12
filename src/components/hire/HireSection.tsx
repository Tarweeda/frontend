import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useHireRoles } from '../../hooks/useHampers';
import { useSection } from '../../hooks/useSiteContent';
import { useUIStore } from '../../store/ui';
import { Spinner } from '../ui/Spinner';
import './HireSection.css';

export function HireSection() {
  const { data: roles, isLoading } = useHireRoles();
  const openHireModal = useUIStore((s) => s.openHireModal);
  const h = useSection('hire');

  return (
    <section className="hire-section" id="hire">
      <Container>
        <Reveal className="hire-head">
          <span className="eyebrow" style={{ color: 'var(--g3)' }}>{h.eyebrow}</span>
          <h2 className="sec-title">{h.headingPre}<em>{h.headingEm}</em></h2>
          <p>{h.description}</p>
        </Reveal>

        <Reveal>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
          ) : (
            <div className="hire-grid">
              {roles?.map((role) => (
                <div key={role.id} className={`hire-card ${role.is_featured ? 'featured' : ''}`}>
                  <div className="hire-num">{role.display_num}</div>
                  <div className="hire-role">{role.role_name}</div>
                  <p className="hire-desc">{role.description}</p>
                  <div className="hire-rate">{role.rate}</div>
                </div>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal>
          <div className="hire-cta-bar">
            <div>
              <h3>{h.ctaHeading}</h3>
              <p>{h.ctaSub}</p>
            </div>
            <button className="btn btn-ghost-light" onClick={openHireModal}>
              {h.ctaButton}
            </button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
