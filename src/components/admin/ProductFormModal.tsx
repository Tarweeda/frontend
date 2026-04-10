import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Modal, ModalHead } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import './AdminForms.css';

interface Product {
  id?: string;
  slug: string;
  category: string;
  name: string;
  description: string;
  tagline: string;
  price_pence: number;
  unit: string;
  tag: string;
  image_path: string;
  in_stock: boolean;
  sort_order: number;
}

const EMPTY: Product = {
  slug: '', category: 'staples', name: '', description: '', tagline: '',
  price_pence: 0, unit: '', tag: '', image_path: '', in_stock: true, sort_order: 0,
};

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductFormModal({ open, onClose, product }: Props) {
  const isEdit = !!product?.id;
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Product>(EMPTY);

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => { const { data } = await api.get('/admin/products'); return data; },
  });
  const categories = Array.from(new Set<string>((products ?? []).map((p: any) => String(p.category))));
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (open) setForm(product?.id ? { ...product } : { ...EMPTY });
  }, [open, product]);

  const set = (field: keyof Product, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const mutation = useMutation({
    mutationFn: async (data: Product) => {
      if (isEdit) {
        const { id, ...body } = data;
        await api.patch(`/admin/products/${id}`, body);
      } else {
        await api.post('/admin/products', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="580px">
      <ModalHead title={isEdit ? 'Edit Product' : 'New Product'} onClose={onClose} />
      <form className="admin-form" onSubmit={handleSubmit}>
        <Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} required placeholder="e.g. olive-oil-500ml" />
        <div className="admin-form-row">
          <div className="field admin-combo" ref={catRef}>
              <label className="field-label">Category</label>
              <input
                className="field-input"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                onFocus={() => setCatOpen(true)}
                required
                placeholder="Type or select..."
                autoComplete="off"
              />
              {catOpen && categories.length > 0 && (
                <ul className="admin-combo-list">
                  {categories
                    .filter((c) => c.toLowerCase().includes(form.category.toLowerCase()) || !form.category)
                    .map((c) => (
                      <li key={c} onMouseDown={() => { set('category', c); setCatOpen(false); }}>{c}</li>
                    ))}
                </ul>
              )}
            </div>
          <Input label="Tag" value={form.tag} onChange={(e) => set('tag', e.target.value)} required placeholder="e.g. Best Seller" />
        </div>
        <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} required rows={3} />
        <Input label="Tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} required />
        <div className="admin-form-row">
          <Input label="Price (£)" type="number" step="0.01" value={(form.price_pence / 100).toFixed(2)} onChange={(e) => set('price_pence', Math.round(parseFloat(e.target.value || '0') * 100))} required />
          <Input label="Unit" value={form.unit} onChange={(e) => set('unit', e.target.value)} required placeholder="e.g. 500ml" />
        </div>
        <div className="admin-form-row">
          <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value || '0'))} />
          <Input label="Image Path" value={form.image_path || ''} onChange={(e) => set('image_path', e.target.value)} placeholder="/images/product.jpg" />
        </div>
        <label className="admin-checkbox">
          <input type="checkbox" checked={form.in_stock} onChange={(e) => set('in_stock', e.target.checked)} />
          In Stock
        </label>

        {mutation.isError && <div className="admin-form-error">Failed to save product. Please try again.</div>}

        <div className="admin-form-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" loading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
