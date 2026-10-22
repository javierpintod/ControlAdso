<?php
declare(strict_types=1);

/**
 * Endpoint de Mesa de Ayuda Técnica (Delegado a ServiceDeskController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\ServiceDeskController::class);
$response = $controller->index(\App\Core\Request::capture());
$response->send();
