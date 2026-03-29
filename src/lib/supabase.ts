import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

export function getImageUrl(bucket: string, path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function getProductImageUrl(path: string | null): string {
  if (!path) return '';
  return getImageUrl('product-images', path);
}

export function getSiteAssetUrl(path: string): string {
  return getImageUrl('site-assets', path);
}
