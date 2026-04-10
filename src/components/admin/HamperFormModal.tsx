import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Modal, ModalHead } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import './AdminForms.css';

interface Hamper {
  id?: string;
  slug: string;
  name: string;
  description: string;
  price_pence: number;
  contents: string;
  image_path: string;
  sort_order: number;
  in_stock: boolean;
}

const EMPTY: Hamper = {
  slug: '', name: '', description: '', price_pence: 0,
  contents: '', image_path: '', sort_order: 0, in_stock: true,
};

interface Props {
  open: boolean;
  onClose: () => void;
  hamper?: Hamper | null;
}

export function HamperFormModal({ open, onClose, hamper }: Props) {
  const isEdit = !!hamper?.id;
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Hamper>(EMPTY);

  useEffect(() => {
    if (open) setForm(hamper?.id ? { ...hamper } : { ...EMPTY });
  }, [open, hamper]);

  const set = (field: keyof Hamper, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const mutation = useMutation({
    mutationFn: async (data: Hamper) => {
      if (isEdit) {
        const { id, ...body } = data;
        await api.patch(`/admin/hampers/${id}`, body);
      } else {
        await api.post('/admin/hampers', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hampers'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="540px">
      <ModalHead title={isEdit ? 'Edit Hamper' : 'New Hamper'} onClose={onClose} />
      <form className="admin-form" onSubmit={handleSubmit}>
        <Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="e.g. classic-hamper" />
        <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} required rows={3} />
        <Textarea label="Contents" value={form.contents} onChange={(e) => set('contents', e.target.value)} required rows={3} placeholder="List what's included..." />
        <div className="admin-form-row">
          <Input label="Price (£)" type="number" step="0.01" value={(form.price_pence / 100).toFixed(2)} onChange={(e) => set('price_pence', Math.round(parseFloat(e.target.value || '0') * 100))} required />
          <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value || '0'))} />
        </div>
        <Input label="Image Path" value={form.image_path || ''} onChange={(e) => set('image_path', e.target.value)} placeholder="/images/hamper.jpg" />
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.in_stock} onChange={(e) => set('in_stock', e.target.checked)} />
          In Stock
        </label>

        {mutation.isError && <div className="admin-form-error">Failed to save hamper. Please try again.</div>}

        <div className="admin-form-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Create Hamper'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
