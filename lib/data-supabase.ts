// Supabase data layer for Warning Tracker
// This replaces the mock data with real Supabase database calls

import { Enseigne, Store, Warning } from '@/types';
import { supabase } from './supabase';

// Re-export CLIENTS_DATA for seeding purposes
export { CLIENTS_DATA, ENSEIGNES, seedDatabase } from '@/scripts/seed';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(prefix: string, id?: string): string {
  return id ? `${prefix}:${id}` : prefix;
}

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function clearCache(): void {
  cache.clear();
}

// ==================== Enseignes ====================

export async function getEnseignes(): Promise<Enseigne[]> {
  const cacheKey = getCacheKey('enseignes');
  const cached = getCached<Enseigne[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('enseignes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching enseignes:', error);
    return [];
  }

  const result = data?.map(e => ({
    id: e.id,
    name: e.name,
  })) || [];

  setCache(cacheKey, result);
  return result;
}

export async function getEnseigneById(id: string): Promise<Enseigne | undefined> {
  const { data, error } = await supabase
    .from('enseignes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  return {
    id: data.id,
    name: data.name,
  };
}

// ==================== Stores ====================

export async function getStores(): Promise<Store[]> {
  const cacheKey = getCacheKey('stores');
  const cached = getCached<Store[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching stores:', error);
    return [];
  }

  const result = data?.map(s => ({
    id: s.id,
    name: s.name,
    enseigneId: s.enseigne_id,
    yellowCount: s.yellow_count,
    redCount: s.red_count,
    isBlocked: s.is_blocked,
  })) || [];

  setCache(cacheKey, result);
  return result;
}

export async function getStoresByEnseigne(enseigneId: string): Promise<Store[]> {
  const cacheKey = getCacheKey('stores', enseigneId);
  const cached = getCached<Store[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('enseigne_id', enseigneId)
    .order('name');

  if (error) {
    console.error('Error fetching stores by enseigne:', error);
    return [];
  }

  const result = data?.map(s => ({
    id: s.id,
    name: s.name,
    enseigneId: s.enseigne_id,
    yellowCount: s.yellow_count,
    redCount: s.red_count,
    isBlocked: s.is_blocked,
  })) || [];

  setCache(cacheKey, result);
  return result;
}

export async function getStoreById(id: string): Promise<Store | undefined> {
  const cacheKey = getCacheKey('store', id);
  const cached = getCached<Store>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  const result = {
    id: data.id,
    name: data.name,
    enseigneId: data.enseigne_id,
    yellowCount: data.yellow_count,
    redCount: data.red_count,
    isBlocked: data.is_blocked,
  };

  setCache(cacheKey, result);
  return result;
}

export async function searchStores(query: string, enseigneId?: string): Promise<Store[]> {
  let dbQuery = supabase
    .from('stores')
    .select('*');

  if (enseigneId) {
    dbQuery = dbQuery.eq('enseigne_id', enseigneId);
  }

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`);
  }

  const { data, error } = await dbQuery.order('name');

  if (error) {
    console.error('Error searching stores:', error);
    return [];
  }

  return data?.map(s => ({
    id: s.id,
    name: s.name,
    enseigneId: s.enseigne_id,
    yellowCount: s.yellow_count,
    redCount: s.red_count,
    isBlocked: s.is_blocked,
  })) || [];
}

// ==================== Warnings ====================

export async function getWarnings(): Promise<Warning[]> {
  const { data, error } = await supabase
    .from('warnings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching warnings:', error);
    return [];
  }

  return data?.map(w => ({
    id: w.id,
    storeId: w.store_id,
    type: w.type as 'yellow' | 'red',
    comment: w.comment,
    imageUrl: w.image_url,
    createdAt: w.created_at,
    createdBy: w.created_by,
  })) || [];
}

export async function getStoreWarnings(storeId: string): Promise<Warning[]> {
  const { data, error } = await supabase
    .from('warnings')
    .select(`
      *,
      warning_images (
        id,
        image_url
      )
    `)
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  console.log('getStoreWarnings raw:', { storeId, data, error, firstWarning: data?.[0], firstWarningImages: data?.[0]?.warning_images });

  if (error) {
    console.error('Error fetching store warnings:', error);
    return [];
  }

  return data?.map(w => ({
    id: w.id,
    storeId: w.store_id,
    type: w.type as 'yellow' | 'red',
    comment: w.comment,
    imageUrl: w.image_url,
    imageUrls: w.warning_images?.map((img: { image_url: string }) => img.image_url) || [],
    createdAt: w.created_at,
    createdBy: w.created_by,
  })) || [];
}

export async function getAllWarningsWithImages(): Promise<Warning[]> {
  const { data, error } = await supabase
    .from('warnings')
    .select(`
      *,
      warning_images (
        id,
        image_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all warnings with images:', error);
    return [];
  }

  return data?.map(w => ({
    id: w.id,
    storeId: w.store_id,
    type: w.type as 'yellow' | 'red',
    comment: w.comment,
    imageUrl: w.image_url,
    imageUrls: w.warning_images?.map((img: { image_url: string }) => img.image_url) || [],
    createdAt: w.created_at,
    createdBy: w.created_by,
  })) || [];
}

export async function addWarning(
  storeId: string,
  type: 'yellow' | 'red',
  comment: string,
  imageUrls: string[] = []
): Promise<Warning | null> {
  const { data, error } = await supabase
    .from('warnings')
    .insert({
      store_id: storeId,
      type,
      comment,
      created_by: 'Admin',
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding warning:', error);
    return null;
  }

  // Insert images into warning_images table
  if (imageUrls.length > 0) {
    const imageRecords = imageUrls.map(url => ({
      warning_id: data.id,
      image_url: url,
    }));
    
    const { error: imageError } = await supabase
      .from('warning_images')
      .insert(imageRecords);
    
    if (imageError) {
      console.error('Error adding warning images:', imageError);
    }
  }

  // Clear cache so store counts refresh
  cache.delete(getCacheKey('stores'));
  cache.delete(getCacheKey('stores', storeId));
  cache.delete(getCacheKey('store', storeId));

  return {
    id: data.id,
    storeId: data.store_id,
    type: data.type as 'yellow' | 'red',
    comment: data.comment,
    imageUrls,
    createdAt: data.created_at,
    createdBy: data.created_by,
  };
}

export async function updateWarning(
  warningId: string,
  updates: { comment?: string; imageUrl?: string }
): Promise<Warning | null> {
  const { data, error } = await supabase
    .from('warnings')
    .update({
      comment: updates.comment,
      image_url: updates.imageUrl,
    })
    .eq('id', warningId)
    .select()
    .single();

  if (error) {
    console.error('Error updating warning:', error);
    return null;
  }

  return {
    id: data.id,
    storeId: data.store_id,
    type: data.type as 'yellow' | 'red',
    comment: data.comment,
    imageUrl: data.image_url,
    createdAt: data.created_at,
    createdBy: data.created_by,
  };
}

export async function removeWarning(warningId: string): Promise<boolean> {
  // First get the warning to know which store to clear cache for
  const { data: warning } = await supabase
    .from('warnings')
    .select('store_id')
    .eq('id', warningId)
    .single();

  // Get all images for this warning
  const { data: images } = await supabase
    .from('warning_images')
    .select('image_url')
    .eq('warning_id', warningId);

  // Delete images from storage
  if (images && images.length > 0) {
    for (const img of images) {
      try {
        const url = new URL(img.image_url);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('warning-images');
        let filePath: string;
        
        if (bucketIndex >= 0 && bucketIndex < pathParts.length - 1) {
          filePath = pathParts.slice(bucketIndex + 1).join('/');
        } else {
          filePath = pathParts.pop() || '';
        }
        
        if (filePath) {
          await supabase.storage
            .from('warning-images')
            .remove([filePath]);
        }
      } catch (e) {
        console.error('Error deleting image:', e);
      }
    }
  }

  // Delete warning (cascade will delete warning_images)
  const { error } = await supabase
    .from('warnings')
    .delete()
    .eq('id', warningId);

  if (error) {
    console.error('Error removing warning:', error);
    return false;
  }

  // Clear cache so store counts refresh
  if (warning) {
    cache.delete(getCacheKey('stores'));
    cache.delete(getCacheKey('stores', warning.store_id));
    cache.delete(getCacheKey('store', warning.store_id));
  }

  return true;
}

// ==================== Statistics ====================

export async function getStats() {
  const { data: stores, error: storesError } = await supabase
    .from('stores')
    .select('*');

  if (storesError || !stores) {
    return {
      totalStores: 0,
      totalYellowCards: 0,
      totalRedCards: 0,
      blockedStores: 0,
    };
  }

  const { data: warnings, error: warningsError } = await supabase
    .from('warnings')
    .select('*')
    .eq('type', 'yellow')
    .neq('created_by', 'System');

  return {
    totalStores: stores.length,
    totalYellowCards: warningsError ? 0 : (warnings?.length || 0),
    totalRedCards: stores.reduce((sum, s) => sum + (s.red_count || 0), 0),
    blockedStores: stores.filter(s => s.is_blocked).length,
  };
}

export async function getCardStats() {
  const { data: yellowWarnings, error: yellowError } = await supabase
    .from('warnings')
    .select('*')
    .eq('type', 'yellow')
    .neq('created_by', 'System');

  const { data: redWarnings, error: redError } = await supabase
    .from('warnings')
    .select('*')
    .eq('type', 'red');

  return {
    yellow: yellowError ? 0 : (yellowWarnings?.length || 0),
    red: redError ? 0 : (redWarnings?.length || 0),
  };
}

export async function getTopStoresWithWarnings(limit: number = 10): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('yellow_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top stores:', error);
    return [];
  }

  return data?.map(s => ({
    id: s.id,
    name: s.name,
    enseigneId: s.enseigne_id,
    yellowCount: s.yellow_count,
    redCount: s.red_count,
    isBlocked: s.is_blocked,
  })) || [];
}

// ==================== Storage ====================

export async function uploadWarningImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `warning-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('warning-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('warning-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// ==================== Real-time Subscriptions ====================

export function subscribeToStores(callback: (stores: Store[]) => void) {
  const subscription = supabase
    .channel('stores-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'stores' },
      async () => {
        // Clear cache and fetch fresh data
        cache.delete(getCacheKey('stores'));
        const stores = await getStores();
        callback(stores);
      }
    )
    .subscribe();

  return subscription;
}

export function subscribeToWarnings(callback: (warnings: Warning[]) => void) {
  const subscription = supabase
    .channel('warnings-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'warnings' },
      async () => {
        const warnings = await getWarnings();
        callback(warnings);
      }
    )
    .subscribe();

  return subscription;
}
