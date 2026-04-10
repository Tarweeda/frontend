import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Modal, ModalHead } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import './AdminForms.css';

interface SupperEvent {
  id?: string;
  slug: string;
  name: string;
  theme: string;
  event_date: string;
  event_time: string;
  location: string;
  total_seats: number;
  seats_left: number;
  price_pence: number;
  is_featured: boolean;
  menu: { course: string; dish: string; note?: string }[];
  status: string;
}

const EMPTY: SupperEvent = {
  slug: '', name: '', theme: '', event_date: '', event_time: '19:00',
  location: '', total_seats: 20, seats_left: 20, price_pence: 0,
  is_featured: false, menu: [], status: 'upcoming',
};

interface Props {
  open: boolean;
  onClose: () => void;
  event?: SupperEvent | null;
}

export function EventFormModal({ open, onClose, event }: Props) {
  const isEdit = !!event?.id;
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SupperEvent>(EMPTY);

  useEffect(() => {
    if (open) setForm(event?.id ? { ...event, menu: event.menu || [] } : { ...EMPTY, menu: [] });
  }, [open, event]);

  const set = (field: keyof SupperEvent, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setMenuItem = (idx: number, field: string, value: string) => {
    const menu = [...form.menu];
    menu[idx] = { ...menu[idx], [field]: value };
    set('menu', menu);
  };
  const addMenuItem = () => set('menu', [...form.menu, { course: '', dish: '', note: '' }]);
  const removeMenuItem = (idx: number) => set('menu', form.menu.filter((_, i) => i !== idx));

  const mutation = useMutation({
    mutationFn: async (data: SupperEvent) => {
      if (isEdit) {
        const { id, ...body } = data;
        await api.patch(`/admin/events/${id}`, body);
      } else {
        await api.post('/admin/events', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="620px">
      <ModalHead title={isEdit ? 'Edit Event' : 'New Event'} onClose={onClose} />
      <form className="admin-form" onSubmit={handleSubmit}>
        <Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="e.g. spring-supper-2025" />
        <Input label="Theme" value={form.theme} onChange={(e) => set('theme', e.target.value)} required />
        <div className="admin-form-row">
          <Input label="Date" type="date" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} required />
          <Input label="Time" type="time" value={form.event_time} onChange={(e) => set('event_time', e.target.value)} required />
        </div>
        <Input label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} required />
        <div className="admin-form-row">
          <Input label="Total Seats" type="number" value={form.total_seats} onChange={(e) => set('total_seats', parseInt(e.target.value || '0'))} required />
          <Input label="Seats Left" type="number" value={form.seats_left} onChange={(e) => set('seats_left', parseInt(e.target.value || '0'))} />
        </div>
        <div className="admin-form-row">
          <Input label="Price (£)" type="number" step="0.01" value={(form.price_pence / 100).toFixed(2)} onChange={(e) => set('price_pence', Math.round(parseFloat(e.target.value || '0') * 100))} required />
          <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)} options={[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'sold_out', label: 'Sold Out' },
            { value: 'past', label: 'Past' },
            { value: 'cancelled', label: 'Cancelled' },
          ]} />
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
          Featured Event
        </label>

        {/* Menu items */}
        <div className="admin-menu-section">
          <div className="admin-menu-header">
            <span className="field-label">Menu</span>
            <button type="button" className="admin-action-btn" onClick={addMenuItem}>+ Add Course</button>
          </div>
          {form.menu.map((item, idx) => (
            <div key={idx} className="admin-menu-item">
              <Input placeholder="Course (e.g. Starter)" value={item.course} onChange={(e) => setMenuItem(idx, 'course', e.target.value)} />
              <Input placeholder="Dish" value={item.dish} onChange={(e) => setMenuItem(idx, 'dish', e.target.value)} />
              <Input placeholder="Note (optional)" value={item.note || ''} onChange={(e) => setMenuItem(idx, 'note', e.target.value)} />
              <button type="button" className="admin-action-btn danger" onClick={() => removeMenuItem(idx)}>Remove</button>
            </div>
          ))}
        </div>

        {mutation.isError && <div className="admin-form-error">Failed to save event. Please try again.</div>}

        <div className="admin-form-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
