<?php
declare(strict_types=1);

/**
 * Bootstrap de la Arquitectura MVC para ControlAdso
 * Inicializa el Autoloader PSR-4, la configuración de la Base de Datos,
 * la sesión, y el Contenedor de Inyección de Dependencias (IoC / DI Container).
 */

if (!defined('APP_INIT')) {
    define('APP_INIT', true);
}

// 1. Requerir configuración del núcleo existente
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../config/auth.php';

// 2. Autoloader PSR-4 para el namespace App\
spl_autoload_register(function (string $class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Core\Container;
use App\Core\Router;
use App\Core\Request;
use App\Core\Response;
use App\Repositories\Contracts\AssetRepositoryInterface;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use App\Repositories\Contracts\MovementRepositoryInterface;
use App\Repositories\Contracts\TicketRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\MySqlAssetRepository;
use App\Repositories\MySqlEnvironmentRepository;
use App\Repositories\MySqlMovementRepository;
use App\Repositories\MySqlTicketRepository;
use App\Repositories\MySqlUserRepository;
use App\Services\AssetService;
use App\Services\MovementService;
use App\Services\ServiceDeskService;
use App\Controllers\DashboardController;
use App\Controllers\AssetController;
use App\Controllers\MovementController;
use App\Controllers\ServiceDeskController;
use App\Controllers\AuthController;

/**
 * Class App
 * Facade principal de la aplicación MVC
 */
class App
{
    private static ?Container $container = null;
    private static ?Router $router = null;

    public static function getContainer(): Container
    {
        if (self::$container === null) {
            self::$container = new Container();
            self::configureContainer(self::$container);
        }
        return self::$container;
    }

    public static function getRouter(): Router
    {
        if (self::$router === null) {
            self::$router = new Router(self::getContainer());
            self::configureRoutes(self::$router);
        }
        return self::$router;
    }

    public static function resolve(string $class)
    {
        return self::getContainer()->get($class);
    }

    public static function run(): void
    {
        $request = Request::capture();
        $response = self::getRouter()->dispatch($request);
        $response->send();
    }

    /**
     * Configuración de bindings para SOLID (DIP e Inversión de Dependencias)
     */
    private static function configureContainer(Container $c): void
    {
        // Registrar PDO como Singleton a partir del patrón Singleton existente
        $c->singleton(\PDO::class, function () {
            return Database::getInstance()->getConnection();
        });

        // Vincular contratos/interfaces con sus implementaciones concretas de MySQL
        $c->bind(AssetRepositoryInterface::class, MySqlAssetRepository::class);
        $c->bind(EnvironmentRepositoryInterface::class, MySqlEnvironmentRepository::class);
        $c->bind(MovementRepositoryInterface::class, MySqlMovementRepository::class);
        $c->bind(TicketRepositoryInterface::class, MySqlTicketRepository::class);
        $c->bind(UserRepositoryInterface::class, MySqlUserRepository::class);

        // Registrar servicios de dominio
        $c->singleton(AssetService::class);
        $c->singleton(MovementService::class);
        $c->singleton(ServiceDeskService::class);

        // Registrar controladores
        $c->bind(DashboardController::class);
        $c->bind(AssetController::class);
        $c->bind(MovementController::class);
        $c->bind(ServiceDeskController::class);
        $c->bind(AuthController::class);
    }

    /**
     * Configuración del mapa de rutas del enrutador Front-Controller
     */
    private static function configureRoutes(Router $r): void
    {
        $r->get('/', [DashboardController::class, 'index']);
        $r->get('/dashboard', [DashboardController::class, 'index']);
        
        $r->get('/assets', [AssetController::class, 'index']);
        $r->get('/assets/create', [AssetController::class, 'create']);
        $r->post('/assets/create', [AssetController::class, 'create']);
        $r->get('/assets/detail', [AssetController::class, 'detail']);
        $r->get('/assets/edit', [AssetController::class, 'edit']);
        $r->post('/assets/edit', [AssetController::class, 'edit']);
        $r->post('/assets/delete', [AssetController::class, 'delete']);

        $r->get('/movements', [MovementController::class, 'index']);
        $r->get('/movements/create', [MovementController::class, 'create']);
        $r->post('/movements/create', [MovementController::class, 'create']);
        $r->get('/movements/acta', [MovementController::class, 'acta']);

        $r->get('/servicedesk', [ServiceDeskController::class, 'index']);
        $r->get('/servicedesk/create', [ServiceDeskController::class, 'create']);
        $r->post('/servicedesk/create', [ServiceDeskController::class, 'create']);
        $r->get('/servicedesk/detail', [ServiceDeskController::class, 'detail']);
        $r->post('/servicedesk/note', [ServiceDeskController::class, 'addNote']);

        $r->get('/login', [AuthController::class, 'login']);
        $r->post('/login', [AuthController::class, 'login']);
        $r->get('/logout', [AuthController::class, 'logout']);
    }
}
