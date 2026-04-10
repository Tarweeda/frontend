import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Modal, ModalHead } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import './AdminForms.css';

interface Package {
  id?: string;
  event_id: string;
  slug: string;
  icon: string;
  name: string;
  price_pence: number;
  guests: number;
  inclusions: string;
  is_featured: boolean;
  is_enquiry: boolean;
  sort_order: number;
}

const EMPTY: Package = {
  event_id: '', slug: '', icon: '', name: '', price_pence: 0, guests: 1,
  inclusions: '', is_featured: false, is_enquiry: false, sort_order: 0,
};

interface Props {
  open: boolean;
  onClose: () => void;
  pkg?: Package | null;
  defaultEventId?: string;
  events: any[];
}

export function PackageFormModal({ open, onClose, pkg, defaultEventId, events }: Props) {
  const isEdit = !!pkg?.id;
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Package>(EMPTY);

  useEffect(() => {
    if (open) {
      setForm(pkg?.id
        ? { ...pkg }
        : { ...EMPTY, event_id: defaultEventId || '' }
      );
    }
  }, [open, pkg, defaultEventId]);

  const set = (field: keyof Package, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const mutation = useMutation({
    mutationFn: async (data: Package) => {
      if (isEdit) {
        const { id, ...body } = data;
        await api.patch(`/admin/packages/${id}`, body);
      } else {
        await api.post('/admin/packages', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const eventOptions = events.map((ev: any) => ({ value: ev.id, label: ev.name }));

  return (
    <Modal open={open} onClose={onClose} maxWidth="540px">
      <ModalHead title={isEdit ? 'Edit Package' : 'New Package'} onClose={onClose} />
      <form className="admin-form" onSubmit={handleSubmit}>
        <Select label="Event" value={form.event_id} onChange={(e) => set('event_id', e.target.value)} options={[{ value: '', label: 'Select an event...' }, ...eventOptions]} required />
        <Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="e.g. Individual Seat" />
        <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="e.g. individual-seat" />
        <div className="admin-form-row">
          <Input label="Icon (emoji)" value={form.icon} onChange={(e) => set('icon', e.target.value)} required placeholder="e.g. 🪑" />
          <Input label="Guests" type="number" min={1} value={form.guests} onChange={(e) => set('guests', parseInt(e.target.value || '1'))} required />
        </div>
        <Input label="Price (£)" type="number" step="0.01" value={(form.price_pence / 100).toFixed(2)} onChange={(e) => set('price_pence', Math.round(parseFloat(e.target.value || '0') * 100))} required />
        <Textarea label="Inclusions" value={form.inclusions} onChange={(e) => set('inclusions', e.target.value)} required rows={2} placeholder="e.g. 5-course menu · Welcome drink · Community table" />
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value || '0'))} />
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
            Featured (Popular badge)
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.is_enquiry} onChange={(e) => set('is_enquiry', e.target.checked)} />
            Enquiry only (no payment)
          </label>
        </div>

        {mutation.isError && <div className="admin-form-error">Failed to save package. Please try again.</div>}

        <div className="admin-form-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Create Package'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
