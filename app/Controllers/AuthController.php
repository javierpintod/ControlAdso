<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;

/**
 * Class AuthController
 * Controlador para autenticación y cierre de sesión con JWT (SRP).
 */
class AuthController extends Controller
{
    public function login(Request $request): Response
    {
        // Si ya está autenticado, enviar al dashboard
        if ($this->currentUser) {
            return $this->redirect('index.php');
        }

        $error = '';

        if ($request->isPost()) {
            $email = trim($request->post('email', ''));
            $password = (string)$request->post('password', '');

            if (function_exists('attemptLogin') && attemptLogin($email, $password)) {
                return $this->redirect('index.php');
            } else {
                $error = 'Credenciales no válidas. Verifique el correo institucional y la contraseña.';
            }
        }

        return $this->render('auth/login', [
            'pageTitle' => 'Iniciar Sesión Institucional | ControlAdso SENA',
            'error' => $error
        ], null); // Sin layout envolvente
    }

    public function logout(): Response
    {
        if (function_exists('logoutUser')) {
            logoutUser();
        }

        return $this->redirect('login.php');
    }
}
