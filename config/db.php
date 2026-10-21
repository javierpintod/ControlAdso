<?php
/**
 * Conexión a Base de Datos MySQL mediante PDO
 * ControlAdso - EduStock Asset Manager
 * SENA Centro de Servicios y Gestión Empresarial
 */

if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
if (!defined('DB_PORT')) define('DB_PORT', getenv('DB_PORT') ?: '3306');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'controladso_db');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'root');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

function getDB(): ?PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Intentar conexión sin base de datos por si aún no ha sido creada
        try {
            $dsnNoDb = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=utf8mb4";
            $tempPdo = new PDO($dsnNoDb, DB_USER, DB_PASS, $options);
            // Si la conexión al servidor MySQL fue exitosa pero falta la base de datos:
            return null;
        } catch (PDOException $errServer) {
            return null;
        }
    }
}

function isDBConnected(): bool {
    return getDB() !== null;
}
