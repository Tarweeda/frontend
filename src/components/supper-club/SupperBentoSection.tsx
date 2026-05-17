import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useEvents } from '../../hooks/useEvents';
import { useUIStore } from '../../store/ui';
import { Spinner } from '../ui/Spinner';
import type { SupperEvent } from '../../types/event';
import './SupperBentoSection.css';

function formatPrice(pence: number) { return `£${(pence / 100).toFixed(0)}`; }

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('en-GB', { month: 'long' }),
    year: d.getFullYear().toString(),
    short: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
}

export function SupperBentoSection() {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return (
      <section className="bento-section" id="supperclub">
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Spinner />
          </div>
        </Container>
      </section>
    );
  }

  const upcoming = events?.find((e) => e.status === 'upcoming');
  const soldOutEvent = events?.find((e) => e.status === 'sold_out');
  const past = events?.find((e) => e.status === 'past');
  const event = upcoming ?? soldOutEvent ?? past;

  if (!event) return null;

  return (
    <section className="bento-section" id="supperclub">
      <Container>
        <Reveal>
          <BentoGrid event={event} isPast={!upcoming && !soldOutEvent} />
        </Reveal>
      </Container>
    </section>
  );
}

function BentoGrid({ event: ev, isPast }: { event: SupperEvent; isPast: boolean }) {
  const openBooking = useUIStore((s) => s.openBooking);
  const date = formatDate(ev.event_date);
  const seatPercent = ev.total_seats > 0 ? ((ev.total_seats - ev.seats_left) / ev.total_seats) * 100 : 100;
  const soldOut = ev.seats_left === 0 || ev.status === 'sold_out';

  const handleReserve = () => { openBooking(ev.id); };

  return (
    <div className="bento-grid">
      {/* Invite tile */}
      <div className="bento-tile bento-invite">
        <div className="bento-eyebrow">
          {isPast ? 'Our Last Gathering' : 'Next Supper Club'}
        </div>
        <div className="bento-theme-badge">{ev.theme}</div>
        <h2 className="bento-event-name">{ev.name}</h2>
        <div className="bento-meta">
          <span className="bento-meta-item">
            <span className="bento-meta-label">Date</span>
            <span className="bento-meta-val">{date.short}</span>
          </span>
          <span className="bento-meta-item">
            <span className="bento-meta-label">Time</span>
            <span className="bento-meta-val">{ev.event_time}</span>
          </span>
          <span className="bento-meta-item">
            <span className="bento-meta-label">Venue</span>
            <span className="bento-meta-val">{ev.location}</span>
          </span>
        </div>
      </div>

      {/* Seats tile */}
      <div className="bento-tile bento-seats">
        {isPast ? (
          <div className="bento-past-label">Event passed</div>
        ) : (
          <>
            <div className="bento-seats-count">{soldOut ? '0' : ev.seats_left}</div>
            <div className="bento-seats-label">
              {soldOut ? 'sold out' : 'seats remaining'}
            </div>
            <div className="bento-progress-track">
              <div className="bento-progress-fill" style={{ width: `${seatPercent}%` }} />
            </div>
          </>
        )}
      </div>

      {/* Book tile */}
      <div className="bento-tile bento-book">
        {isPast ? (
          <div className="bento-past-label">Tickets closed</div>
        ) : (
          <>
            <div className="bento-price">from {formatPrice(ev.price_pence)}</div>
            <button
              className={`bento-reserve-btn ${soldOut ? 'sold' : ''}`}
              onClick={handleReserve}
              disabled={soldOut}
            >
              {soldOut ? 'Sold Out' : 'Reserve →'}
            </button>
          </>
        )}
      </div>

      {/* Menu tile */}
      <div className="bento-tile bento-menu">
        <div className="bento-menu-label">Set Menu</div>
        <div className="bento-courses">
          {ev.menu.map((c, i) => (
            <div key={i} className="bento-course">
              <div className="bento-course-num">0{i + 1}</div>
              <div className="bento-course-body">
                <div className="bento-course-name">{c.course}</div>
                <div className="bento-course-dish">{c.dish}</div>
                {c.note && <div className="bento-course-note">{c.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
