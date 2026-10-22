<?php
declare(strict_types=1);

/**
 * Endpoint de Detalle de Ticket (Delegado a ServiceDeskController en MVC)
 * ControlAdso - EduStock SENA
 */

require_once __DIR__ . '/app/bootstrap.php';

$controller = App::resolve(\App\Controllers\ServiceDeskController::class);
$request = \App\Core\Request::capture();

if ($request->isPost() && $request->post('content')) {
    $response = $controller->addNote($request);
} else {
    $response = $controller->detail($request);
}

$response->send();
