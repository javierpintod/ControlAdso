<?php
declare(strict_types=1);

/**
 * Endpoint de Histórico de Movimientos (Delegado a MovementController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\MovementController::class);
$response = $controller->index(\App\Core\Request::capture());
$response->send();
