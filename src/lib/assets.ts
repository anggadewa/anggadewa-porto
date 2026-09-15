import { supabase } from './supabase';

export function getAssetUrl(path: string | null): string {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  
  const bucketName = import.meta.env.VITE_STORAGE_BUCKET_NAME || 'portfolio-assets';
  
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
    
  return data.publicUrl;
}
