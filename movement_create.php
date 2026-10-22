<?php
declare(strict_types=1);

/**
 * Endpoint de Registro de Traslado (Delegado a MovementController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\MovementController::class);
$response = $controller->create(\App\Core\Request::capture());
$response->send();
