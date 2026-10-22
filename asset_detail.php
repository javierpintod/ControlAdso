<?php
declare(strict_types=1);

/**
 * Endpoint de Ficha y Hoja de Vida de Activo (Delegado a AssetController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\AssetController::class);
$response = $controller->detail(\App\Core\Request::capture());
$response->send();
