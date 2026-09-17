import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Normaliza cualquier formato de URL de Supabase ingresado por el usuario:
 * - Convierte URLs de Dashboard (ej. https://supabase.com/dashboard/project/xyz) a https://xyz.supabase.co
 * - Convierte IDs directos de proyecto (ej. xyz) a https://xyz.supabase.co
 * - Filtra placeholders de plantilla (ej. your-project.supabase.co)
 * - Remueve barras finales
 */
export const normalizeSupabaseUrl = (inputUrl: string): string => {
  if (!inputUrl) return '';
  let url = inputUrl.trim();

  // Filtrar placeholders genéricos
  if (url.includes('your-project') || url.includes('ejemplo') || url.includes('MY_SUPABASE')) {
    return '';
  }

  // Detectar URL del dashboard de Supabase y extraer el Project Ref
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i) ||
                        url.match(/app\.supabase\.com\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Si el usuario ingresó solo el identificador alfanumérico del proyecto (ej. najjrhdvnhexffzseaah)
  if (/^[a-zA-Z0-9_-]{15,30}$/.test(url)) {
    return `https://${url}.supabase.co`;
  }

  // Asegurar protocolo https si falta
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  return url.replace(/\/+$/, '');
};

// Leer de variables de entorno si están presentes
const rawEnvUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawEnvKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback o anulación en localStorage
const rawStoredUrl = typeof window !== 'undefined' ? localStorage.getItem('controladso_supabase_url') || '' : '';
const rawStoredKey = typeof window !== 'undefined' ? localStorage.getItem('controladso_supabase_key') || '' : '';

export const activeSupabaseUrl = normalizeSupabaseUrl(rawStoredUrl) || normalizeSupabaseUrl(rawEnvUrl);
export const activeSupabaseKey = (rawStoredKey && rawStoredKey !== 'your-supabase-anon-key' ? rawStoredKey : '') || 
                                 (rawEnvKey && rawEnvKey !== 'your-supabase-anon-key' ? rawEnvKey : '');

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
    console.warn('Error al inicializar cliente de Supabase:', err);
  }
}

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseInstance;
};

export const isSupabaseConnected = (): boolean => {
  return !!supabaseInstance;
};

export const updateSupabaseCredentials = (
  url: string, 
  key: string
): { success: boolean; client?: SupabaseClient; error?: string; normalizedUrl?: string } => {
  const normalized = normalizeSupabaseUrl(url);
  const cleanKey = key.trim();

  if (!normalized || !cleanKey) {
    localStorage.removeItem('controladso_supabase_url');
    localStorage.removeItem('controladso_supabase_key');
    supabaseInstance = null;
    return { success: true };
  }

  try {
    const client = createClient(normalized, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    localStorage.setItem('controladso_supabase_url', normalized);
    localStorage.setItem('controladso_supabase_key', cleanKey);
    supabaseInstance = client;
    return { success: true, client, normalizedUrl: normalized };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido al conectar con Supabase';
    return { success: false, error: errorMsg };
  }
};

export interface SupabaseHealthCheckResult {
  connected: boolean;
  message: string;
  counts?: {
    campuses: number;
    environments: number;
    assets: number;
    categories: number;
  };
}

export const checkSupabaseHealth = async (client?: SupabaseClient | null): Promise<SupabaseHealthCheckResult> => {
  const sb = client || supabaseInstance;
  if (!sb) {
    return { connected: false, message: 'Cliente de Supabase no configurado' };
  }

  try {
    const { data: campuses, error: errCampuses } = await sb
      .from('campuses')
      .select('id, name')
      .limit(10);

    if (errCampuses) {
      if (errCampuses.code === '42P01') {
        return { 
          connected: true, 
          message: 'Conexión exitosa, pero las tablas aún no han sido creadas. Ejecuta el script schema.sql en Supabase.' 
        };
      }
      return { connected: false, message: `Error de Supabase: ${errCampuses.message}` };
    }

    // Consulta complementaria para conteos
    const [envRes, assetRes, catRes] = await Promise.allSettled([
      sb.from('environments').select('id', { count: 'exact', head: true }),
      sb.from('assets').select('id', { count: 'exact', head: true }),
      sb.from('product_categories').select('id', { count: 'exact', head: true }),
    ]);

    const envCount = envRes.status === 'fulfilled' && envRes.value.count !== null ? envRes.value.count : 0;
    const assetCount = assetRes.status === 'fulfilled' && assetRes.value.count !== null ? assetRes.value.count : 0;
    const catCount = catRes.status === 'fulfilled' && catRes.value.count !== null ? catRes.value.count : 0;

    return {
      connected: true,
      message: `¡Conexión verificada y activa! Tablas operativas en Supabase Cloud.`,
      counts: {
        campuses: campuses ? campuses.length : 0,
        environments: envCount,
        assets: assetCount,
        categories: catCount,
      }
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error de conexión HTTP';
    return { connected: false, message: `Fallo de conexión con Supabase: ${msg}` };
  }
};
