<?php
declare(strict_types=1);

/**
 * Endpoint de Cierre de Sesión (Delegado a AuthController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\AuthController::class);
$response = $controller->logout();
$response->send();
