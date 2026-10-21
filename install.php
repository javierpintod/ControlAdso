<?php
/**
 * Asistente de Instalación y Migración a MySQL
 * ControlAdso - EduStock Asset Manager
 */

require_once __DIR__ . '/config/db.php';

$message = '';
$error = '';
$tablesCreated = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = trim($_POST['db_host'] ?? '127.0.0.1');
    $dbPort = trim($_POST['db_port'] ?? '3306');
    $dbName = trim($_POST['db_name'] ?? 'controladso_db');
    $dbUser = trim($_POST['db_user'] ?? 'root');
    $dbPass = $_POST['db_pass'] ?? '';

    try {
        // Conectar al servidor MySQL general sin especificar la base de datos
        $pdoServer = new PDO("mysql:host={$dbHost};port={$dbPort};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        // Crear la base de datos si no existe
        $pdoServer->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

        // Conectar a la base de datos creada
        $pdoDb = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_MULTI_STATEMENTS => true
        ]);

        // Leer el archivo schema.sql
        $schemaPath = __DIR__ . '/database/schema.sql';
        if (!file_exists($schemaPath)) {
            throw new Exception("El archivo SQL no se encontró en {$schemaPath}");
        }

        $sqlContent = file_get_contents($schemaPath);

        // Ejecutar las sentencias SQL
        $pdoDb->exec($sqlContent);

        // Consultar tablas creadas
        $stmt = $pdoDb->query("SHOW TABLES;");
        $tablesCreated = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Contar activos y usuarios insertados
        $countAssets = $pdoDb->query("SELECT COUNT(*) FROM assets")->fetchColumn();
        $countUsers = $pdoDb->query("SELECT COUNT(*) FROM user_profiles")->fetchColumn();
        $countEnvs = $pdoDb->query("SELECT COUNT(*) FROM environments")->fetchColumn();

        $message = "¡Base de datos instalada y aprovisionada con éxito! Se crearon " . count($tablesCreated) . " tablas, {$countEnvs} ambientes, {$countUsers} usuarios y {$countAssets} activos institucionales del SENA.";

    } catch (Exception $e) {
        $error = "Error al instalar la base de datos: " . $e->getMessage();
    }
}

$isConnected = isDBConnected();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalador de Base de Datos MySQL - ControlAdso</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
        <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <i data-lucide="database" class="w-6 h-6"></i>
            </div>
            <div>
                <h1 class="text-xl font-bold text-white">Instalador MySQL • ControlAdso</h1>
                <p class="text-sm text-slate-400">Configuración rápida para XAMPP / WampServer / MySQL</p>
            </div>
        </div>

        <?php if ($isConnected && empty($message) && empty($error)): ?>
            <div class="p-4 mb-6 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-start space-x-3">
                <i data-lucide="check-circle" class="w-5 h-5 mt-0.5 text-emerald-400 shrink-0"></i>
                <div class="text-sm">
                    <p class="font-semibold text-emerald-200">¡Conexión establecida con MySQL!</p>
                    <p class="mt-1">La base de datos <code class="bg-emerald-900/60 px-1.5 py-0.5 rounded text-white"><?= htmlspecialchars(DB_NAME) ?></code> ya está accesible. Puedes volver a ejecutar la instalación para reiniciar los datos iniciales o ingresar a la aplicación.</p>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!empty($message)): ?>
            <div class="p-4 mb-6 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-start space-x-3">
                <i data-lucide="check-circle-2" class="w-5 h-5 mt-0.5 text-emerald-400 shrink-0"></i>
                <div class="text-sm">
                    <p class="font-semibold text-emerald-200">Operación Exitosa</p>
                    <p class="mt-1"><?= htmlspecialchars($message) ?></p>
                    <div class="mt-4 flex space-x-3">
                        <a href="index.php" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition text-xs flex items-center space-x-2">
                            <span>Ir al Dashboard</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                        <a href="login.php" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition text-xs">
                            Ir al Login
                        </a>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!empty($error)): ?>
            <div class="p-4 mb-6 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 flex items-start space-x-3">
                <i data-lucide="alert-circle" class="w-5 h-5 mt-0.5 text-rose-400 shrink-0"></i>
                <div class="text-sm">
                    <p class="font-semibold text-rose-200">Error durante la instalación</p>
                    <p class="mt-1"><?= htmlspecialchars($error) ?></p>
                    <p class="mt-2 text-xs text-rose-400">Verifica que el servicio de MySQL en tu panel de XAMPP / MAMP esté encendido (en verde).</p>
                </div>
            </div>
        <?php endif; ?>

        <form method="POST" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Servidor (Host)</label>
                    <input type="text" name="db_host" value="127.0.0.1" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Puerto</label>
                    <input type="text" name="db_port" value="3306" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                </div>
            </div>

            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Nombre de la Base de Datos</label>
                <input type="text" name="db_name" value="controladso_db" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <span class="text-xs text-slate-500">Se creará automáticamente si aún no existe.</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Usuario MySQL</label>
                    <input type="text" name="db_user" value="root" required class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <span class="text-xs text-slate-500">En XAMPP usualmente es 'root'.</span>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                    <input type="password" name="db_pass" value="" placeholder="(Vacía en XAMPP)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <span class="text-xs text-slate-500">En XAMPP se deja vacía.</span>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-700 flex items-center justify-between">
                <a href="index.php" class="text-xs text-slate-400 hover:text-white transition">
                    &larr; Volver a la Aplicación
                </a>
                <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-emerald-900/30 flex items-center space-x-2">
                    <i data-lucide="play" class="w-4 h-4"></i>
                    <span>Ejecutar Instalación / Migración</span>
                </button>
            </div>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-700/60 text-xs text-slate-400 space-y-2">
            <p class="font-semibold text-slate-300">Usuarios demo generados:</p>
            <ul class="list-disc list-inside space-y-1 text-slate-400">
                <li><span class="text-slate-200">Admin:</span> carlos.mendoza@edustock.edu (clave: <code class="text-emerald-400">admin123</code>)</li>
                <li><span class="text-slate-200">Técnico:</span> marcos.pena@edustock.edu (clave: <code class="text-emerald-400">admin123</code>)</li>
                <li><span class="text-slate-200">Auditor:</span> carmen.morales@edustock.edu (clave: <code class="text-emerald-400">admin123</code>)</li>
            </ul>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
