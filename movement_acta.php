<?php
declare(strict_types=1);

/**
 * Endpoint de Acta de Traslado Digital (Delegado a MovementController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\MovementController::class);
$response = $controller->acta(\App\Core\Request::capture());
$response->send();
