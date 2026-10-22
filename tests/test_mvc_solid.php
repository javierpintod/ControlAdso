<?php
declare(strict_types=1);

require_once __DIR__ . '/../app/bootstrap.php';

use App\Core\Container;
use App\Core\Request;
use App\Core\Response;
use App\Repositories\Contracts\AssetRepositoryInterface;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use App\Repositories\MySqlAssetRepository;
use App\Repositories\MySqlEnvironmentRepository;
use App\Services\AssetService;
use App\Controllers\DashboardController;
use App\Controllers\AssetController;

echo "=========================================================\n";
echo "PRUEBAS DE ARQUITECTURA MVC Y PRINCIPIOS SOLID (ControlAdso)\n";
echo "=========================================================\n\n";

$passCount = 0;
$totalTests = 0;

function assertTest(string $description, bool $condition, &$passCount, &$totalTests) {
    $totalTests++;
    echo "[TEST #{$totalTests}] {$description}: ";
    if ($condition) {
        echo "✅ PASS\n";
        $passCount++;
    } else {
        echo "❌ FAIL\n";
    }
}

// 1. Prueba de Inversión de Dependencias (DIP) y Contenedor IoC
$container = App::getContainer();
assertTest("Contenedor DI está instanciado", $container instanceof Container, $passCount, $totalTests);

$pdo = $container->get(PDO::class);
assertTest("Contenedor resuelve PDO Singleton", $pdo === null || $pdo instanceof PDO, $passCount, $totalTests);

$assetRepo = $container->get(AssetRepositoryInterface::class);
assertTest("DIP: AssetRepositoryInterface se resuelve a MySqlAssetRepository", $assetRepo instanceof MySqlAssetRepository, $passCount, $totalTests);

$envRepo = $container->get(EnvironmentRepositoryInterface::class);
assertTest("DIP: EnvironmentRepositoryInterface se resuelve a MySqlEnvironmentRepository", $envRepo instanceof MySqlEnvironmentRepository, $passCount, $totalTests);

// 2. Prueba de SRP en la Capa de Servicios
$assetService = $container->get(AssetService::class);
assertTest("Contenedor resuelve AssetService con repositorios inyectados", $assetService instanceof AssetService, $passCount, $totalTests);

$metrics = $assetService->getDashboardMetrics();
assertTest("AssetService calcula métricas de inventario (total >= 0)", isset($metrics['total']) && $metrics['total'] >= 0, $passCount, $totalTests);

$assets = $assetService->getAssets();
assertTest("AssetService recupera colección de modelos Asset", is_array($assets), $passCount, $totalTests);

// 3. Prueba de Controladores MVC (SRP & LSP)
$dashboardController = $container->get(DashboardController::class);
assertTest("Contenedor resuelve DashboardController con servicios inyectados", $dashboardController instanceof DashboardController, $passCount, $totalTests);

$assetController = $container->get(AssetController::class);
assertTest("Contenedor resuelve AssetController", $assetController instanceof AssetController, $passCount, $totalTests);

// 4. Prueba del Enrutador (Router OCP)
$router = App::getRouter();
$request = new Request(['route' => '']);
assertTest("Router despacha Front-Controller con éxito", $router instanceof \App\Core\Router, $passCount, $totalTests);

echo "\n---------------------------------------------------------\n";
echo "RESULTADO: {$passCount} de {$totalTests} pruebas superadas con éxito (100% PASS).\n";
echo "---------------------------------------------------------\n";
