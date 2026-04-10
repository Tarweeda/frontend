import { useState } from 'react';
import { Modal, ModalHead, ModalSteps } from '../ui/Modal';
import { PaymentForm } from '../cart/PaymentForm';
import { useUIStore } from '../../store/ui';
import { useEvents, usePackages } from '../../hooks/useEvents';
import { api } from '../../lib/api';
import { useToastStore } from '../../store/toast';
import type { SupperPackage } from '../../types/package';
import type { SupperEvent } from '../../types/event';
import './BookingModal.css';


const STEPS = ['Package', 'Menu', 'Details', 'Payment'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Halal'];

export function BookingModal() {
  const { bookingEventId, closeBooking, bookingStep, setBookingStep, selectedPackageId, selectPackage, bookingDietary, toggleDietary } = useUIStore();
  const { data: events } = useEvents();
  const { data: packages } = usePackages(bookingEventId);

  const showToast = useToastStore((s) => s.showToast);
  const [details, setDetails] = useState({ first_name: '', last_name: '', email: '', phone: '', special_requests: '' });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalPence, setTotalPence] = useState(0);
  const [isEnquiry, setIsEnquiry] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const event = events?.find((e: SupperEvent) => e.id === bookingEventId);
  const selectedPkg = packages?.find((p: SupperPackage) => p.id === selectedPackageId);

  if (!bookingEventId || !event) return null;

  const date = new Date(event.event_date);
  const subtitle = `${date.getDate()} ${date.toLocaleDateString('en-GB', { month: 'short' })} ${date.getFullYear()} · ${event.event_time} · ${event.location}`;

  const handleClose = () => {
    closeBooking();
    setDetails({ first_name: '', last_name: '', email: '', phone: '', special_requests: '' });
    setClientSecret(null);
    setSuccess(false);
  };

  const nextFromDetails = async () => {
    if (!details.first_name || !details.last_name || !details.email.includes('@')) {
      showToast('Please fill in your details.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        event_id: bookingEventId,
        package_id: selectedPackageId,
        ...details,
        dietary: bookingDietary,
      });
      setClientSecret(data.client_secret);
      setTotalPence(data.total_pence);
      setIsEnquiry(data.is_enquiry);
      if (data.is_enquiry) {
        setSuccess(true);
      }
      setBookingStep(3);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={!!bookingEventId} onClose={handleClose}>
      <ModalHead title={event.name} subtitle={subtitle} onClose={handleClose} />
      <ModalSteps steps={STEPS} current={bookingStep} onChange={(i) => { if (i <= bookingStep) setBookingStep(i as 0 | 1 | 2 | 3); }} />

      <div style={{ padding: '2rem 2.2rem' }}>
        {/* Step 0: Package */}
        {bookingStep === 0 && (
          <div>
            <div className="pkg-grid">
              {packages?.map((pkg: SupperPackage) => (
                <div key={pkg.id} className={`pkg ${selectedPackageId === pkg.id ? 'on' : ''} ${pkg.is_featured ? 'feat' : ''}`} onClick={() => selectPackage(pkg.id)}>
                  {pkg.is_featured && <div className="pkg-badge">Popular</div>}
                  <div className="pkg-icon">{pkg.icon}</div>
                  <div className="pkg-name">{pkg.name}</div>
                  <div className="pkg-price">{pkg.is_enquiry ? 'Enquiry' : `£${pkg.price_pence / 100}`}{!pkg.is_enquiry && (pkg.guests > 1 ? ' total' : ' / person')}</div>
                  <div className="pkg-inc">{pkg.inclusions}</div>
                  {selectedPackageId === pkg.id && <span className="pkg-ck">✓</span>}
                </div>
              ))}
            </div>
            <button className="bk-next" onClick={() => { if (!selectedPackageId) { showToast('Please select a package.', 'warning'); return; } setBookingStep(1); }}>View Set Menu</button>
          </div>
        )}

        {/* Step 1: Menu */}
        {bookingStep === 1 && (
          <div>
            <div className="sm-wrap">
              <div className="sm-title">Set Menu</div>
              <div className="sm-courses">
                {event.menu.map((c, i) => (
                  <div key={i} className="sm-course">
                    <div className="sm-num">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <div className="sm-type">{c.course}</div>
                      <div className="sm-dish">{c.dish}</div>
                      <div className="sm-note">{c.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="bk-next" onClick={() => setBookingStep(2)}>Continue to Details</button>
          </div>
        )}

        {/* Step 2: Details */}
        {bookingStep === 2 && (
          <div>
            <div className="bk-row">
              <div><label className="bk-lbl">First name</label><input className="bk-inp" value={details.first_name} onChange={(e) => setDetails((d) => ({ ...d, first_name: e.target.value }))} placeholder="First name" /></div>
              <div><label className="bk-lbl">Last name</label><input className="bk-inp" value={details.last_name} onChange={(e) => setDetails((d) => ({ ...d, last_name: e.target.value }))} placeholder="Last name" /></div>
            </div>
            <label className="bk-lbl">Email</label><input className="bk-inp" type="email" value={details.email} onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))} placeholder="your@email.com" />
            <label className="bk-lbl">Phone</label><input className="bk-inp" type="tel" value={details.phone} onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} placeholder="+44…" />
            <label className="bk-lbl">Dietary requirements</label>
            <div className="bk-diet-row">
              {DIETARY_OPTIONS.map((d) => (
                <button key={d} className={`bk-diet ${bookingDietary.includes(d) ? 'on' : ''}`} onClick={() => toggleDietary(d)}>{d}</button>
              ))}
            </div>
            <textarea className="bk-textarea" value={details.special_requests} onChange={(e) => setDetails((d) => ({ ...d, special_requests: e.target.value }))} placeholder="Any other notes…" />
            <button className="bk-next" onClick={nextFromDetails} disabled={submitting}>{submitting ? 'Creating booking…' : 'Continue to Payment'}</button>
          </div>
        )}

        {/* Step 3: Payment */}
        {bookingStep === 3 && (
          <div>
            {success || isEnquiry ? (
              <div className="bk-success">
                <div className="ok-icon">✦</div>
                <h3 className="ok-title">{isEnquiry ? 'Enquiry Sent' : "You're on the table!"}</h3>
                <p className="ok-body">{isEnquiry ? "We'll get back to you about a private buyout." : 'Reservation confirmed. Check your email for details.'}</p>
              </div>
            ) : clientSecret ? (
              <>
                <div className="bk-summary">
                  <div className="bk-sum-row"><span>Event</span><span>{event.name}</span></div>
                  <div className="bk-sum-row"><span>Package</span><span>{selectedPkg?.name}</span></div>
                  {bookingDietary.length > 0 && <div className="bk-sum-row"><span>Dietary</span><span>{bookingDietary.join(', ')}</span></div>}
                  <div className="bk-sum-total"><span>Total</span><span>£{totalPence / 100}</span></div>
                </div>
                <PaymentForm clientSecret={clientSecret} totalPence={totalPence} onSuccess={() => setSuccess(true)} />
              </>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text3)' }}>Preparing payment…</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
