<?php
/**
 * Gestión de Autenticación mediante JSON Web Tokens (JWT) y Sesiones RBAC
 * ControlAdso - EduStock Asset Manager
 * SENA Centro de Servicios y Gestión Empresarial
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/jwt.php';

/**
 * Establece la cookie de autenticación JWT (HTTP-Only para máxima seguridad)
 */
function setAuthToken(array $userPayload): string {
    $token = JWT::encode($userPayload, 604800); // Válido por 7 días

    // Guardar en cookie HTTP-Only
    setcookie('jwt_auth', $token, [
        'expires' => time() + 604800,
        'path' => '/',
        'domain' => '',
        'secure' => false, // Cambiar a true en producción HTTPS
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    // Respaldo en sesión
    $_SESSION['jwt_token'] = $token;
    $_SESSION['user'] = $userPayload;

    return $token;
}

/**
 * Elimina la cookie y token JWT al cerrar sesión
 */
function clearAuthToken(): void {
    setcookie('jwt_auth', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true
    ]);
    unset($_SESSION['jwt_token']);
    unset($_SESSION['user']);
}

/**
 * Obtiene el usuario autenticado decodificando y validando el token JWT
 */
function getCurrentUser(): ?array {
    $token = JWT::getTokenFromRequest();

    if ($token) {
        $decoded = JWT::decode($token);
        if ($decoded) {
            return [
                'id' => $decoded['sub'] ?? ($decoded['id'] ?? 'usr-admin'),
                'name' => $decoded['name'] ?? 'Usuario',
                'email' => $decoded['email'] ?? '',
                'role' => $decoded['role'] ?? 'consulta',
                'role_title' => $decoded['role_title'] ?? 'Usuario',
                'avatar_url' => $decoded['avatar_url'] ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                'authorized_environments' => $decoded['authorized_environments'] ?? 'Todos los Ambientes'
            ];
        }
    }

    if (!empty($_SESSION['user'])) {
        return $_SESSION['user'];
    }

    return null;
}

/**
 * Comprueba si existe un token JWT válido
 */
function isLoggedIn(): bool {
    $token = JWT::getTokenFromRequest();
    if ($token) {
        return JWT::decode($token) !== null;
    }
    return !empty($_SESSION['user']);
}

/**
 * Exige autenticación; redirige al login si el token JWT no es válido
 */
function requireAuth(): void {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

/**
 * Exige un rol específico en el payload del JWT
 */
function requireRole(string $role): void {
    requireAuth();
    $user = getCurrentUser();
    if ($user['role'] !== $role && $user['role'] !== 'admin') {
        http_response_code(403);
        die('<div style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Acceso denegado</h2><p>No tienes permisos suficientes para realizar esta acción.</p><a href="index.php">Volver al inicio</a></div>');
    }
}

/**
 * Valida credenciales e inicializa la sesión emitiendo un nuevo JWT
 */
function attemptLogin(string $email, string $password): bool {
    $db = getDB();
    if ($db) {
        $stmt = $db->prepare("SELECT * FROM user_profiles WHERE email = ? AND status = 'active' LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            if (password_verify($password, $user['password'])) {
                $payload = [
                    'sub' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'role_title' => $user['role_title'],
                    'avatar_url' => $user['avatar_url'] ?: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    'authorized_environments' => $user['authorized_environments']
                ];
                setAuthToken($payload);
                return true;
            }
        }
    }

    return false;
}

