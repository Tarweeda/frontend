import { Container } from '../layout/Container';
import { Reveal } from '../ui/Reveal';
import { useEvents } from '../../hooks/useEvents';
import { useUIStore } from '../../store/ui';
import { Spinner } from '../ui/Spinner';
import { useState } from 'react';
import type { SupperEvent } from '../../types/event';
import './SupperSection.css';

function formatPrice(pence: number) { return `£${(pence / 100).toFixed(0)}`; }

export function SupperSection() {
  const { data: events, isLoading } = useEvents();

  return (
    <section className="supper-section" id="supperclub">
      <Container>
        <Reveal className="supper-head">
          <span className="label">Tarweeda Presents</span>
          <h2>The Supper Club</h2>
          <p>On-demand intimate dining — 20 seats, one long table, one theme, one menu.</p>
          <div className="supper-stats">
            <div className="supper-stat"><div className="supper-stat-n">20</div><div className="supper-stat-l">Seats</div></div>
            <div className="supper-stat"><div className="supper-stat-n">5+</div><div className="supper-stat-l">Courses</div></div>
            <div className="supper-stat"><div className="supper-stat-n">£60</div><div className="supper-stat-l">From</div></div>
          </div>
        </Reveal>

        <Reveal>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
          ) : (
            <div className="events-list">
              {events?.map((ev) => <EventCard key={ev.id} event={ev} />)}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function EventCard({ event: ev }: { event: SupperEvent }) {
  const [expanded, setExpanded] = useState(false);
  const openBooking = useUIStore((s) => s.openBooking);
  const date = new Date(ev.event_date);
  const day = date.getDate().toString();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear().toString();

  return (
    <div className={`event ${ev.is_featured ? 'featured' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="event-date">
        <div className="event-day">{day}</div>
        <div className="event-month">{month} {year}</div>
      </div>
      <div className="event-body">
        <div className="event-badge">{ev.theme}</div>
        <div className="event-name">{ev.name}</div>
        <div className="event-sub">A Tarweeda Supper Club</div>
        <div className="event-meta">
          <span>Time: <strong>{ev.event_time}</strong></span>
          <span>Location: <strong>{ev.location}</strong></span>
          <span>Courses: <strong>{ev.menu.length}</strong></span>
        </div>
        <button className="view-menu-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide menu ↑' : 'View menu ↓'}
        </button>
      </div>
      <div className="event-right">
        <div>
          <div className="event-price">from {formatPrice(ev.price_pence)}</div>
          <div className="event-seats">{ev.seats_left > 0 ? `${ev.seats_left} seats left` : 'Sold out'}</div>
        </div>
        <button
          className={`event-book ${ev.seats_left === 0 ? 'sold' : ''}`}
          onClick={() => ev.seats_left > 0 && openBooking(ev.id)}
          disabled={ev.seats_left === 0}
        >
          {ev.seats_left > 0 ? 'Reserve' : 'Sold Out'}
        </button>
      </div>
      {expanded && (
        <div className="event-menu">
          {ev.menu.map((c, i) => (
            <div key={i} className="course">
              <div className="course-label">{c.course}</div>
              <div className="course-dish">{c.dish}</div>
              <div className="course-note">{c.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
