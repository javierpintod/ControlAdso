<?php
declare(strict_types=1);

/**
 * Endpoint de Login Institucional (Delegado a AuthController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\AuthController::class);
$response = $controller->login(\App\Core\Request::capture());
$response->send();
