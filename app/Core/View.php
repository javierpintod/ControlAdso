<?php
declare(strict_types=1);

namespace App\Core;

use Exception;

/**
 * Class View
 * Motor de Renderizado de Vistas con soporte de Layouts (SRP).
 */
class View
{
    private static string $viewsPath = __DIR__ . '/../Views/';

    public static function setViewsPath(string $path): void
    {
        self::$viewsPath = rtrim($path, '/\\') . '/';
    }

    /**
     * Renderiza una vista con datos y layout opcional
     */
    public static function render(string $view, array $data = [], ?string $layout = 'main'): string
    {
        $viewFile = self::$viewsPath . ltrim($view, '/') . '.php';

        if (!file_exists($viewFile)) {
            throw new Exception("La vista '{$view}' no existe en: {$viewFile}");
        }

        // Extraer variables para la vista
        extract($data);

        // Capturar contenido de la vista
        ob_start();
        require $viewFile;
        $content = ob_get_clean();

        // Si se especificó un layout, envolver el contenido en el layout
        if ($layout !== null) {
            $layoutFile = self::$viewsPath . 'layouts/' . ltrim($layout, '/') . '.php';
            if (file_exists($layoutFile)) {
                ob_start();
                require $layoutFile;
                return ob_get_clean();
            }
        }

        return $content;
    }
}
