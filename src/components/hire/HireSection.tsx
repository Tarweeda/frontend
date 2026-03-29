import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useHireRoles } from '../../hooks/useHampers';
import { useUIStore } from '../../store/ui';
import { Spinner } from '../ui/Spinner';
import './HireSection.css';

export function HireSection() {
  const { data: roles, isLoading } = useHireRoles();
  const openHireModal = useUIStore((s) => s.openHireModal);

  return (
    <section className="hire-section" id="hire">
      <Container>
        <Reveal className="hire-head">
          <span className="label">Professional Kitchen Team</span>
          <h2>Hire Tarweeda Staff</h2>
          <p>Experienced Palestinian chefs and professional serving staff, available anywhere in London.</p>
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
              <h3>Ready to bring the Tarweeda team?</h3>
              <p>Tell us your date and we'll quote within 48 hours.</p>
            </div>
            <button className="btn btn-ghost" style={{ borderColor: 'rgba(245,240,232,0.2)', color: 'var(--cream)' }} onClick={openHireModal}>
              Enquire About Staffing
            </button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
