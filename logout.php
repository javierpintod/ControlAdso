<?php
/**
 * Cierre de Sesión y Revocación de JWT
 * ControlAdso - EduStock Asset Manager
 */

require_once __DIR__ . '/config/auth.php';

// Limpiar cookie y token JWT
clearAuthToken();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$_SESSION = [];
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

header('Location: login.php?msg=logged_out');
exit;
