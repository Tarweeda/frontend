import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Modal, ModalHead } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { ImageUpload } from './ImageUpload';
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
  initial_quantity?: number;
  low_stock_threshold?: number;
  sku?: string;
  cost_price_pence?: number;
}

const EMPTY: Product = {
  slug: '', category: 'staples', name: '', description: '', tagline: '',
  price_pence: 0, unit: '', tag: '', image_path: '', in_stock: true, sort_order: 0,
  initial_quantity: 0, low_stock_threshold: 5, sku: '', cost_price_pence: 0,
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
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

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
    if (open) {
      setForm(product?.id ? { ...product } : { ...EMPTY });
      setErrors({});
    }
  }, [open, product]);

  const validate = useCallback((data: Product) => {
    const e: Partial<Record<keyof Product, string>> = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.slug.trim()) e.slug = 'Slug is required';
    if (!data.category.trim()) e.category = 'Category is required';
    if (!data.description.trim()) e.description = 'Description is required';
    if (!data.tagline.trim()) e.tagline = 'Tagline is required';
    if (!data.price_pence) e.price_pence = 'Price is required';
    if (!data.unit.trim()) e.unit = 'Unit is required';
    if (!data.tag.trim()) e.tag = 'Tag is required';
    return e;
  }, []);

  const set = (field: keyof Product, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const mutation = useMutation({
    mutationFn: async (data: Product) => {
      if (isEdit) {
        const { id, ...body } = data;
        const { created_at, updated_at, ...cleanBody } = body as any;
        await api.patch(`/admin/products/${id}`, cleanBody);
      } else {
        const { created_at, updated_at, ...cleanData } = data as any;
        await api.post('/admin/products', cleanData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    mutation.mutate(form);
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="580px">
      <ModalHead title={isEdit ? 'Edit Product' : 'New Product'} onClose={onClose} />
      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} required />
        <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} error={errors.slug} required placeholder="e.g. olive-oil-500ml" />
        <div className="admin-form-row">
          <div className="field admin-combo" ref={catRef}>
              <label className="field-label">Category</label>
              <input
                className={`field-input${errors.category ? ' field-invalid' : ''}`}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                onFocus={() => setCatOpen(true)}
                required
                placeholder="Type or select..."
                autoComplete="off"
              />
              {errors.category && <span className="field-error">{errors.category}</span>}
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
          <Input label="Tag" value={form.tag} onChange={(e) => set('tag', e.target.value)} error={errors.tag} required placeholder="e.g. Best Seller" />
        </div>
        <Textarea label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} required rows={3} />
        <Input label="Tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} error={errors.tagline} required />
        <div className="admin-form-row">
          <Input label="Price (£)" type="number" step="0.01" value={(form.price_pence / 100).toFixed(2)} onChange={(e) => set('price_pence', Math.round(parseFloat(e.target.value || '0') * 100))} error={errors.price_pence} required />
          <Input label="Unit" value={form.unit} onChange={(e) => set('unit', e.target.value)} error={errors.unit} required placeholder="e.g. 500ml" />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value || '0'))} />
        <ImageUpload label="Image" value={form.image_path || ''} onChange={(url) => set('image_path', url)} />

        <div style={{ borderTop: '1px solid var(--kraft, #e0d8c8)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.8rem' }}>
            Stock Settings
          </div>
          <div className="admin-form-row">
            {!isEdit && (
              <Input
                label="Initial Stock Quantity"
                type="number"
                value={form.initial_quantity ?? 0}
                onChange={(e) => set('initial_quantity', parseInt(e.target.value || '0'))}
              />
            )}
            <Input
              label="Low Stock Threshold"
              type="number"
              value={form.low_stock_threshold ?? 5}
              onChange={(e) => set('low_stock_threshold', parseInt(e.target.value || '5'))}
            />
          </div>
          <div className="admin-form-row">
            <Input
              label="SKU (optional)"
              value={form.sku ?? ''}
              onChange={(e) => set('sku', e.target.value)}
              placeholder="e.g. TRW-001"
            />
            <Input
              label="Cost Price (£)"
              type="number"
              step="0.01"
              value={form.cost_price_pence ? (form.cost_price_pence / 100).toFixed(2) : ''}
              onChange={(e) => set('cost_price_pence', Math.round(parseFloat(e.target.value || '0') * 100))}
              placeholder="0.00"
            />
          </div>
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
