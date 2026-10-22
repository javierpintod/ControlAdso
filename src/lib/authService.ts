import { User, JwtSessionData } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { 
  createJwtToken, 
  getStoredJwtSession, 
  saveJwtSessionToStorage, 
  clearStoredJwtSession,
  verifyJwtToken
} from './jwt';
import { getSupabaseClient } from './supabase';

export interface LoginResult {
  success: boolean;
  message: string;
  session?: JwtSessionData;
  user?: User;
  token?: string;
  role?: string;
}

export interface DemoAccount {
  email: string;
  passwordHint: string;
  defaultPassword: string;
  role: 'admin' | 'consulta' | 'tecnico';
  roleTitle: string;
  name: string;
  description: string;
}

/**
 * Cuentas predefinidas de demostración para evaluación y pruebas de acceso JWT.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'carlos.mendoza@edustock.edu',
    passwordHint: 'Admin123* o admin123',
    defaultPassword: 'Admin123*',
    role: 'admin',
    roleTitle: 'Administrador General (Admin RW)',
    name: 'Carlos Mendoza',
    description: 'Acceso total: gestión de inventario, transferencias, usuarios y base de datos.',
  },
  {
    email: 'lucia.vargas@edustock.edu',
    passwordHint: 'consulta123',
    defaultPassword: 'consulta123',
    role: 'consulta',
    roleTitle: 'Auditor / Consulta (Solo Lectura - RO)',
    name: 'Ing. Lucía Vargas',
    description: 'Acceso de consulta pública: vista de métricas, fichas de activos y reportes.',
  },
  {
    email: 'marcos.pena@edustock.edu',
    passwordHint: 'tecnico123',
    defaultPassword: 'tecnico123',
    role: 'tecnico',
    roleTitle: 'Técnico de Soporte Mesa de Ayuda',
    name: 'Tec. Marcos Peña',
    description: 'Acceso a mesa de servicio, diagnósticos y gestión de equipos averiados.',
  }
];

/**
 * Inicia sesión con credenciales, generando o validando un Token JWT.
 * Admite autenticación tanto contra Supabase Auth como validación criptográfica institucional.
 */
export async function authenticateWithJwt(
  email: string,
  password: string,
  usersList: User[] = INITIAL_USERS
): Promise<LoginResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return {
      success: false,
      message: 'Debe ingresar el correo institucional y la contraseña.',
    };
  }

  // 1. Intentar autenticación contra Supabase Auth si está configurado
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (!error && data?.session && data?.user) {
        // Mapear usuario de Supabase
        const matchedLocal = usersList.find(u => u.email.toLowerCase() === cleanEmail);
        const userObj: User = matchedLocal || {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: (data.user.app_metadata?.role as any) || (cleanEmail.includes('admin') ? 'admin' : 'consulta'),
          roleTitle: cleanEmail.includes('admin') ? 'Administrador General (Admin RW)' : 'Usuario Consulta',
          authorizedEnvironments: ['Todos'],
          lastLogin: 'En línea (Supabase Auth)',
          ipAddress: '127.0.0.1 • Supabase Cloud',
          activeSession: true,
          status: 'active',
        };

        const { session } = await createJwtToken(userObj, 8 * 3600, 'supabase');
        // También podemos preservar el access_token nativo de Supabase si se requiere
        if (data.session.access_token) {
          session.token = data.session.access_token;
        }
        saveJwtSessionToStorage(session);

        return {
          success: true,
          message: `¡Sesión iniciada con éxito mediante Supabase Auth! Token JWT verificado.`,
          session,
          user: userObj,
          token: session.token,
          role: userObj.role,
        };
      }
    } catch (err) {
      console.warn('Supabase Auth error o no disponible, continuando con autenticación local JWT:', err);
    }
  }

  // 2. Autenticación Criptográfica Institucional (Local / Offline)
  // Verificar si coincide con alguna de las cuentas o lista de usuarios
  const matchedUser = usersList.find(u => u.email.toLowerCase() === cleanEmail) ||
                      INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);

  // Validaciones de contraseñas de demostración y comunes
  const isValidAdminPass = cleanPass === 'Admin123*' || 
                          cleanPass === 'admin123' || 
                          cleanPass === 'admin' ||
                          cleanPass === '123456';
                          
  const isValidConsultaPass = cleanPass === 'consulta123' || 
                             cleanPass === 'consulta' || 
                             cleanPass === '123456';

  const isValidTecnicoPass = cleanPass === 'tecnico123' || 
                            cleanPass === 'tecnico' || 
                            cleanPass === '123456';

  let authenticatedUser: User | null = null;

  if (matchedUser) {
    if (matchedUser.role === 'admin') {
      if (isValidAdminPass) {
        authenticatedUser = matchedUser;
      }
    } else if (matchedUser.role === 'consulta') {
      if (isValidConsultaPass) {
        authenticatedUser = matchedUser;
      }
    } else if (matchedUser.role === 'tecnico') {
      if (isValidTecnicoPass) {
        authenticatedUser = matchedUser;
      }
    }
  } else if ((cleanEmail === 'admin@edustock.edu' || cleanEmail === 'admin@sena.edu.co') && isValidAdminPass) {
    // Cuenta genérica de emergencia
    authenticatedUser = INITIAL_USERS[0];
  }

  if (!authenticatedUser) {
    return {
      success: false,
      message: 'Credenciales inválidas. Compruebe el correo y contraseña ingresados.',
    };
  }

  // Actualizar estado de último inicio de sesión
  const updatedUser: User = {
    ...authenticatedUser,
    lastLogin: `Hoy ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • JWT Activo`,
    activeSession: true,
  };

  // 3. Generar Token JWT firmado con HMAC-SHA256 y claims oficiales
  const { token, payload, session } = await createJwtToken(updatedUser, 8 * 3600, 'institutional_jwt');
  saveJwtSessionToStorage(session);

  return {
    success: true,
    message: `¡Bienvenido ${updatedUser.name}! Has iniciado sesión con un Token JWT válido.`,
    session,
    user: updatedUser,
    token,
    role: updatedUser.role,
  };
}

/**
 * Cierra la sesión activa revocando el JWT almacenado.
 */
export async function logoutJwtSession(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error al cerrar sesión en Supabase:', e);
    }
  }
  clearStoredJwtSession();
}

/**
 * Restaura y valida la sesión JWT almacenada al cargar la aplicación.
 */
export async function restoreStoredJwtSession(): Promise<{
  activeSession: JwtSessionData | null;
  isValid: boolean;
  role: 'admin' | 'consulta' | 'tecnico';
  user: User | null;
}> {
  const stored = getStoredJwtSession();
  if (!stored || !stored.token) {
    return { activeSession: null, isValid: false, role: 'consulta', user: null };
  }

  const verification = await verifyJwtToken(stored.token);
  if (!verification.valid) {
    clearStoredJwtSession();
    return { activeSession: null, isValid: false, role: 'consulta', user: null };
  }

  return {
    activeSession: stored,
    isValid: true,
    role: stored.user.role,
    user: stored.user,
  };
}
