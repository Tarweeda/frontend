import { useState } from 'react';
import { Modal, ModalHead } from '../ui/Modal';
import { useUIStore } from '../../store/ui';
import { api } from '../../lib/api';
import './HireModal.css';

const STAFF_OPTIONS = ['Head Chef', 'Sous Chef', 'Serving Staff', 'Full Team'];

export function HireModal() {
  const { hireModalOpen, closeHireModal } = useUIStore();
  const [form, setForm] = useState({ name: '', email: '', event_date: '', location: '', guest_count: '', notes: '' });
  const [staffNeeded, setStaffNeeded] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const toggleStaff = (s: string) => setStaffNeeded((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const submit = async () => {
    if (!form.name || !form.email.includes('@')) { alert('Please enter your name and email.'); return; }
    setSubmitting(true);
    try {
      await api.post('/hire/enquiries', {
        ...form,
        guest_count: form.guest_count ? parseInt(form.guest_count) : undefined,
        event_date: form.event_date || undefined,
        staff_needed: staffNeeded,
      });
      setSuccess(true);
    } catch { alert('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  const handleClose = () => {
    closeHireModal();
    if (success) {
      setSuccess(false);
      setForm({ name: '', email: '', event_date: '', location: '', guest_count: '', notes: '' });
      setStaffNeeded([]);
    }
  };

  return (
    <Modal open={hireModalOpen} onClose={handleClose} maxWidth="520px">
      <ModalHead title="Hire Tarweeda Staff" subtitle="Tell us about your event." onClose={handleClose} />
      <div style={{ padding: '2rem 2.2rem' }}>
        {success ? (
          <div className="bk-success">
            <div className="ok-icon">✦</div>
            <h3 className="ok-title">Enquiry Received</h3>
            <p className="ok-body">We'll get back to you within 48 hours.</p>
          </div>
        ) : (
          <>
            <div className="bk-row">
              <div><label className="bk-lbl">Your name</label><input className="bk-inp" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full name" /></div>
              <div><label className="bk-lbl">Email</label><input className="bk-inp" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" /></div>
            </div>
            <label className="bk-lbl">Event date</label><input className="bk-inp" type="date" value={form.event_date} onChange={(e) => updateField('event_date', e.target.value)} />
            <label className="bk-lbl">Location</label><input className="bk-inp" value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Venue / area in London" />
            <label className="bk-lbl">Guests</label><input className="bk-inp" type="number" value={form.guest_count} onChange={(e) => updateField('guest_count', e.target.value)} placeholder="e.g. 50" />
            <label className="bk-lbl">Staff needed</label>
            <div className="bk-diet-row">
              {STAFF_OPTIONS.map((s) => (
                <button key={s} className={`bk-diet ${staffNeeded.includes(s) ? 'on' : ''}`} onClick={() => toggleStaff(s)}>{s}</button>
              ))}
            </div>
            <label className="bk-lbl">Tell us more</label>
            <textarea className="bk-textarea" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Menu, dietary, special requests…" />
            <button className="bk-next" onClick={submit} disabled={submitting}>{submitting ? 'Sending…' : 'Send Enquiry'}</button>
          </>
        )}
      </div>
    </Modal>
  );
}
