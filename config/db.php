<?php
/**
 * Patrón Singleton para Conexión Única a Base de Datos MySQL (PDO)
 * ControlAdso - EduStock Asset Manager
 * SENA Centro de Servicios y Gestión Empresarial
 */

if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
if (!defined('DB_PORT')) define('DB_PORT', getenv('DB_PORT') ?: '3306');
if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME') ?: 'controladso_db');
if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'root');
if (!defined('DB_PASS')) define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

/**
 * Clase Database con Patrón Singleton
 * Garantiza que solo exista una única instancia de conexión en todo el ciclo de vida de la aplicación.
 */
class Database {
    private static ?Database $instance = null;
    private ?PDO $connection = null;

    /**
     * Constructor privado: impide la creación directa de objetos con 'new'
     */
    private function __construct() {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Si la base de datos aún no existe o el servicio está apagado
            $this->connection = null;
        }
    }

    /**
     * Prevenir la clonación del objeto (Patrón Singleton)
     */
    private function __clone() {}

    /**
     * Prevenir la deserialización del objeto (Patrón Singleton)
     */
    public function __wakeup() {
        throw new \Exception("No se permite deserializar una instancia de Database (Singleton).");
    }

    /**
     * Punto de acceso global para obtener la única instancia de la clase Database
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Obtiene la conexión PDO activa
     */
    public function getConnection(): ?PDO {
        return $this->connection;
    }
}

/**
 * Función global helper para obtener la conexión PDO única (Singleton)
 */
function getDB(): ?PDO {
    return Database::getInstance()->getConnection();
}

/**
 * Verifica si hay conexión activa con la base de datos
 */
function isDBConnected(): bool {
    return getDB() !== null;
}
