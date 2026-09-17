import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from environment variables if present
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Stored in localStorage as fallback or override
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('controladso_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('controladso_supabase_key') || '' : '';

export const activeSupabaseUrl = envUrl || storedUrl;
export const activeSupabaseKey = envKey || storedKey;

let supabaseInstance: SupabaseClient | null = null;

if (activeSupabaseUrl && activeSupabaseKey) {
  try {
    supabaseInstance = createClient(activeSupabaseUrl, activeSupabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('Error initializing Supabase client:', err);
  }
}

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseInstance;
};

export const isSupabaseConnected = (): boolean => {
  return !!supabaseInstance;
};

export const updateSupabaseCredentials = (url: string, key: string): { success: boolean; client?: SupabaseClient; error?: string } => {
  if (!url || !key) {
    localStorage.removeItem('controladso_supabase_url');
    localStorage.removeItem('controladso_supabase_key');
    supabaseInstance = null;
    return { success: true };
  }

  try {
    const client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    localStorage.setItem('controladso_supabase_url', url);
    localStorage.setItem('controladso_supabase_key', key);
    supabaseInstance = client;
    return { success: true, client };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido al conectar con Supabase';
    return { success: false, error: errorMsg };
  }
};
