<?php
declare(strict_types=1);

require_once __DIR__ . '/../app/bootstrap.php';

use App\Core\Container;
use App\Services\AssetService;
use App\Services\MovementService;
use App\Services\ServiceDeskService;
use App\Models\Asset;

echo "=========================================================\n";
echo "PRUEBAS DE CASOS DE USO PRINCIPALES (ControlAdso)\n";
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

// Configuración inicial del contenedor (Mocking simple de PDO si no está disponible)
$container = App::getContainer();
$pdo = $container->get(PDO::class);
if ($pdo === null) {
    echo "⚠️ MODO MOCK ACTIVADO (No hay conexión a base de datos real).\n";
}

$currentUser = [
    'id' => 'usr-test-1',
    'name' => 'Usuario Tester',
    'role' => 'admin'
];

try {
    // 1. Caso de Uso: Servicio de Activos (AssetService)
    $assetService = $container->get(AssetService::class);
    assertTest("Servicio de Activos instanciado correctamente", $assetService instanceof AssetService, $passCount, $totalTests);

    // Probar si falla correctamente al intentar crear sin datos requeridos
    $threwException = false;
    try {
        $assetService->createAssetWithFactory([], $currentUser);
    } catch (\InvalidArgumentException $e) {
        $threwException = true;
    }
    assertTest("AssetService valida correctamente datos vacíos al crear", $threwException, $passCount, $totalTests);

    // 2. Caso de Uso: Servicio de Movimientos (MovementService)
    $movementService = $container->get(MovementService::class);
    assertTest("Servicio de Movimientos instanciado correctamente", $movementService instanceof MovementService, $passCount, $totalTests);

    // Probar validación de movimiento
    $threwException = false;
    try {
        $movementService->createTransfer([], $currentUser);
    } catch (\InvalidArgumentException $e) {
        $threwException = true;
    }
    assertTest("MovementService valida correctamente datos vacíos al transferir", $threwException, $passCount, $totalTests);

    // 3. Caso de Uso: Mesa de Ayuda (ServiceDeskService)
    $ticketService = $container->get(ServiceDeskService::class);
    assertTest("Servicio de Mesa de Ayuda instanciado correctamente", $ticketService instanceof ServiceDeskService, $passCount, $totalTests);

    $threwException = false;
    try {
        $ticketService->createTicket([], $currentUser);
    } catch (\InvalidArgumentException $e) {
        $threwException = true;
    }
    assertTest("ServiceDeskService valida correctamente datos vacíos al crear ticket", $threwException, $passCount, $totalTests);

    // Simulando lectura
    $tickets = $ticketService->getAllTickets();
    assertTest("ServiceDeskService recupera lista de tickets (como array)", is_array($tickets), $passCount, $totalTests);

} catch (\Exception $e) {
    echo "Excepción global capturada: " . $e->getMessage() . "\n";
}

echo "\n---------------------------------------------------------\n";
echo "RESULTADO: {$passCount} de {$totalTests} pruebas superadas con éxito.\n";
echo "---------------------------------------------------------\n";
