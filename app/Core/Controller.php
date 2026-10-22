<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Class Controller
 * Controlador Base Abstracto (Principio LSP y SRP de SOLID).
 */
abstract class Controller
{
    protected ?array $currentUser = null;

    public function __construct()
    {
        // Obtener usuario autenticado si existe sesión o JWT
        if (function_exists('getCurrentUser')) {
            $this->currentUser = getCurrentUser();
        }
    }

    /**
     * Exige autenticación; si no hay sesión activa, redirige al login
     */
    protected function requireAuth(): array
    {
        if (function_exists('requireAuth')) {
            requireAuth();
            $this->currentUser = getCurrentUser();
            return $this->currentUser ?? [];
        }

        if (!$this->currentUser) {
            header('Location: login.php');
            exit;
        }

        return $this->currentUser;
    }

    /**
     * Renderiza una vista y devuelve una instancia de Response
     */
    protected function render(string $view, array $data = [], ?string $layout = 'main'): Response
    {
        $defaultData = [
            'currentUser' => $this->currentUser,
            'pageTitle' => 'ControlAdso - EduStock SENA'
        ];

        $mergedData = array_merge($defaultData, $data);
        $html = View::render($view, $mergedData, $layout);

        return new Response($html, 200, ['Content-Type' => 'text/html; charset=utf-8']);
    }

    /**
     * Retorna una respuesta de redirección HTTP
     */
    protected function redirect(string $url): Response
    {
        return Response::redirect($url);
    }

    /**
     * Retorna una respuesta JSON
     */
    protected function json(array $data, int $statusCode = 200): Response
    {
        return Response::json($data, $statusCode);
    }
}
