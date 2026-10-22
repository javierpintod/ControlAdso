<?php
declare(strict_types=1);

/**
 * Front Controller & Punto de Entrada Principal (MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

// Si se invoca con parámetro de ruta (Front Controller unificado)
if (isset($_GET['route'])) {
    App::run();
    exit;
}

// Despacho predeterminado del Dashboard
$controller = App::resolve(\App\Controllers\DashboardController::class);
$response = $controller->index(\App\Core\Request::capture());
$response->send();
