<?php
declare(strict_types=1);

namespace App\Core;

use Exception;

/**
 * Class Router
 * Enrutador Front-Controller para el patrón MVC (SRP & OCP).
 */
class Router
{
    private Container $container;
    private array $routes = [
        'GET' => [],
        'POST' => []
    ];

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function get(string $path, array $handler): void
    {
        $this->routes['GET'][$this->normalizePath($path)] = $handler;
    }

    public function post(string $path, array $handler): void
    {
        $this->routes['POST'][$this->normalizePath($path)] = $handler;
    }

    public function dispatch(Request $request): Response
    {
        $method = $request->getMethod();
        
        // Soporta tanto rutas por URI limpia como por parámetro query: ?route=assets/create
        $path = $this->resolvePath($request);

        if (isset($this->routes[$method][$path])) {
            [$controllerClass, $action] = $this->routes[$method][$path];
            $controller = $this->container->get($controllerClass);

            if (!method_exists($controller, $action)) {
                throw new Exception("El método '{$action}' no existe en el controlador '{$controllerClass}'");
            }

            $response = $controller->$action($request);

            if ($response instanceof Response) {
                return $response;
            }

            if (is_string($response)) {
                return new Response($response);
            }

            if (is_array($response)) {
                return Response::json($response);
            }

            return new Response();
        }

        return new Response("<h1>Error 404 - Ruta no encontrada</h1><p>La ruta '{$path}' [{$method}] no está registrada en el enrutador MVC.</p>", 404);
    }

    private function resolvePath(Request $request): string
    {
        // 1. Si viene por query param ?route=
        $routeParam = $request->get('route');
        if (!empty($routeParam)) {
            return $this->normalizePath($routeParam);
        }

        // 2. Extraer de REQUEST_URI relativo a la carpeta del proyecto
        $uri = $request->getUri();
        $scriptName = dirname($request->all()['SCRIPT_NAME'] ?? '/');
        
        // Remover el prefijo de la subcarpeta (ej: /ControlAdso)
        if ($scriptName !== '/' && $scriptName !== '\\' && strpos($uri, $scriptName) === 0) {
            $uri = substr($uri, strlen($scriptName));
        }

        // Remover archivo .php si viene directo (ej: /index.php -> /)
        $uri = preg_replace('/^\/index\.php/', '', $uri);

        return $this->normalizePath($uri ?: '/');
    }

    private function normalizePath(string $path): string
    {
        $trimmed = '/' . trim($path, '/');
        return $trimmed === '//' ? '/' : $trimmed;
    }
}
