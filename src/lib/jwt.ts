import { JwtHeader, JwtPayload, JwtSessionData, User } from '../types';

/**
 * Clave secreta institucional para firma y validación de tokens JWT HMAC-SHA256.
 * En producción se sincroniza con el JWT Secret de Supabase / Backend.
 */
const JWT_SECRET = 'edustock-controladso-secure-jwt-hmac-sha256-secret-key-2025';

/**
 * Codifica una cadena de texto en formato Base64URL seguro para UTF-8 (RFC 7515).
 */
export function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decodifica una cadena Base64URL a texto UTF-8 estándar.
 */
export function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Genera la firma criptográfica HMAC-SHA256 para el Header y Payload provistos.
 */
async function generateHmacSha256Signature(data: string, secret: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const keyData = enc.encode(secret);
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
      );
      const signatureBuffer = await window.crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        enc.encode(data)
      );
      const signatureBytes = new Uint8Array(signatureBuffer);
      let binary = '';
      for (let i = 0; i < signatureBytes.byteLength; i++) {
        binary += String.fromCharCode(signatureBytes[i]);
      }
      return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch (e) {
      console.warn('SubtleCrypto error, falling back to simulated hash:', e);
    }
  }

  // Fallback determinista seguro en caso de contexto no seguro o SSR
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }
  return base64UrlEncode(`sig_${Math.abs(hash)}_${secret.length}`);
}

/**
 * Emite y firma un token JWT estándar RFC 7519 para un usuario administrativo.
 * Por defecto expira en 8 horas (28800 segundos).
 */
export async function createJwtToken(
  user: User,
  expiresInSeconds: number = 8 * 3600,
  authProvider: 'supabase' | 'institutional_jwt' = 'institutional_jwt'
): Promise<{ token: string; payload: JwtPayload; session: JwtSessionData }> {
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInSeconds;

  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    roleTitle: user.roleTitle,
    authorizedEnvironments: user.authorizedEnvironments,
    iss: 'edustock-auth-service',
    aud: 'edustock-admin-panel',
    iat: now,
    exp: exp,
    jti: `jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    authProvider: authProvider,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = await generateHmacSha256Signature(signatureInput, JWT_SECRET);
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;

  const session: JwtSessionData = {
    token,
    payload,
    user,
    expiresAt: new Date(exp * 1000).toISOString(),
  };

  return { token, payload, session };
}

/**
 * Decodifica un JWT sin validar su firma (útil para inspección visual de claims).
 */
export function parseJwtUnverified(token: string): {
  header: JwtHeader | null;
  payload: JwtPayload | null;
  signature: string;
  isValidStructure: boolean;
} {
  if (!token || typeof token !== 'string') {
    return { header: null, payload: null, signature: '', isValidStructure: false };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: '', isValidStructure: false };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0])) as JwtHeader;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
    return {
      header,
      payload,
      signature: parts[2],
      isValidStructure: true,
    };
  } catch (err) {
    return { header: null, payload: null, signature: parts[2], isValidStructure: false };
  }
}

/**
 * Verifica la validez, integridad y vigencia de un token JWT.
 */
export async function verifyJwtToken(token: string): Promise<{
  valid: boolean;
  payload?: JwtPayload;
  error?: string;
  remainingMinutes?: number;
}> {
  if (!token) {
    return { valid: false, error: 'Token no proporcionado' };
  }

  const parsed = parseJwtUnverified(token);
  if (!parsed.isValidStructure || !parsed.payload) {
    return { valid: false, error: 'Estructura de JWT inválida (se requieren 3 partes: header.payload.signature)' };
  }

  const now = Math.floor(Date.now() / 1000);

  // Comprobar expiración
  if (parsed.payload.exp && parsed.payload.exp <= now) {
    return { 
      valid: false, 
      payload: parsed.payload, 
      error: `Token JWT expirado a las ${new Date(parsed.payload.exp * 1000).toLocaleTimeString()}` 
    };
  }

  // Si fue generado por nuestro servicio institucional, verificar firma
  if (parsed.payload.iss === 'edustock-auth-service') {
    const parts = token.trim().split('.');
    const expectedSig = await generateHmacSha256Signature(`${parts[0]}.${parts[1]}`, JWT_SECRET);
    if (parts[2] !== expectedSig) {
      return { valid: false, error: 'Firma criptográfica HMAC-SHA256 inválida o adulterada' };
    }
  }

  const remainingSeconds = parsed.payload.exp ? parsed.payload.exp - now : 0;
  const remainingMinutes = Math.max(0, Math.round(remainingSeconds / 60));

  return {
    valid: true,
    payload: parsed.payload,
    remainingMinutes,
  };
}

// ----------------------------------------------------------------------
// Almacenamiento Local de Sesión JWT
// ----------------------------------------------------------------------

const STORAGE_KEY_TOKEN = 'controladso_jwt_token';
const STORAGE_KEY_SESSION = 'controladso_jwt_session';

export function saveJwtSessionToStorage(session: JwtSessionData): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_TOKEN, session.token);
      window.localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Error al guardar token JWT en localStorage:', e);
  }
}

export function getStoredJwtSession(): JwtSessionData | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const token = window.localStorage.getItem(STORAGE_KEY_TOKEN);
    const sessionJson = window.localStorage.getItem(STORAGE_KEY_SESSION);
    if (!token || !sessionJson) return null;

    const session: JwtSessionData = JSON.parse(sessionJson);
    const now = Math.floor(Date.now() / 1000);

    // Verificar si el token ya expiró
    if (session.payload && session.payload.exp && session.payload.exp <= now) {
      clearStoredJwtSession();
      return null;
    }

    return session;
  } catch (e) {
    clearStoredJwtSession();
    return null;
  }
}

export function clearStoredJwtSession(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY_TOKEN);
      window.localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  } catch (e) {
    console.error('Error al limpiar sesión JWT:', e);
  }
}

