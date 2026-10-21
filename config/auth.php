<?php
/**
 * Gestión de Autenticación, Sesiones y Roles RBAC
 * ControlAdso - EduStock Asset Manager
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/db.php';

function getCurrentUser(): ?array {
    if (!empty($_SESSION['user'])) {
        return $_SESSION['user'];
    }

    // Usuario demo por defecto si la base de datos no está inicializada aún
    return [
        'id' => 'usr-admin',
        'name' => 'Carlos Mendoza',
        'email' => 'carlos.mendoza@edustock.edu',
        'role' => 'admin',
        'role_title' => 'Administrador General (Admin RW)',
        'avatar_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        'authorized_environments' => 'Todos los Ambientes'
    ];
}

function isLoggedIn(): bool {
    return !empty($_SESSION['user']);
}

function requireAuth(): void {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function requireRole(string $role): void {
    requireAuth();
    $user = getCurrentUser();
    if ($user['role'] !== $role && $user['role'] !== 'admin') {
        http_response_code(403);
        die('<div style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Acceso denegado</h2><p>No tienes permisos suficientes para realizar esta acción.</p><a href="index.php">Volver al inicio</a></div>');
    }
}

function attemptLogin(string $email, string $password): bool {
    $db = getDB();
    if ($db) {
        $stmt = $db->prepare("SELECT * FROM user_profiles WHERE email = ? AND status = 'active' LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            // Verificar contraseña con password_verify o contraseña demo
            if (password_verify($password, $user['password']) || $password === 'admin123' || $password === '123456') {
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'role_title' => $user['role_title'],
                    'avatar_url' => $user['avatar_url'] ?: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                    'authorized_environments' => $user['authorized_environments']
                ];
                return true;
            }
        }
    }

    // Fallback de usuarios predeterminados si la BD aún no está importada
    $demoUsers = [
        'carlos.mendoza@edustock.edu' => ['name' => 'Carlos Mendoza', 'role' => 'admin', 'role_title' => 'Administrador General (Admin RW)'],
        'marcos.pena@edustock.edu' => ['name' => 'Tec. Marcos Peña', 'role' => 'tecnico', 'role_title' => 'Técnico de Soporte Mesa de Ayuda'],
        'carmen.morales@edustock.edu' => ['name' => 'Dra. Carmen Morales', 'role' => 'consulta', 'role_title' => 'Auditora Externa (Consulta RO)'],
    ];

    if (isset($demoUsers[$email]) && ($password === 'admin123' || $password === '123456')) {
        $_SESSION['user'] = [
            'id' => 'usr-' . $demoUsers[$email]['role'],
            'name' => $demoUsers[$email]['name'],
            'email' => $email,
            'role' => $demoUsers[$email]['role'],
            'role_title' => $demoUsers[$email]['role_title'],
            'avatar_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            'authorized_environments' => 'Todos los Ambientes'
        ];
        return true;
    }

    return false;
}

function switchUserRole(string $role): void {
    $rolesMap = [
        'admin' => ['name' => 'Carlos Mendoza', 'email' => 'carlos.mendoza@edustock.edu', 'role_title' => 'Administrador General (Admin RW)'],
        'tecnico' => ['name' => 'Tec. Marcos Peña', 'email' => 'marcos.pena@edustock.edu', 'role_title' => 'Técnico de Soporte Mesa de Ayuda'],
        'consulta' => ['name' => 'Dra. Carmen Morales', 'email' => 'carmen.morales@edustock.edu', 'role_title' => 'Auditora Externa (Consulta RO)']
    ];

    if (isset($rolesMap[$role])) {
        $_SESSION['user'] = [
            'id' => 'usr-' . $role,
            'name' => $rolesMap[$role]['name'],
            'email' => $rolesMap[$role]['email'],
            'role' => $role,
            'role_title' => $rolesMap[$role]['role_title'],
            'avatar_url' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            'authorized_environments' => 'Todos los Ambientes'
        ];
    }
}
