<?php
/**
 * Implementación de JSON Web Tokens (JWT) - RFC 7519
 * Algoritmo: HMAC SHA-256 (HS256)
 * ControlAdso - EduStock Asset Manager (SENA)
 */

if (!defined('JWT_SECRET')) {
    define('JWT_SECRET', getenv('JWT_SECRET') ?: 'ControlAdso_SENA_SecretKey_2026_Sha256_Token_Security');
}

class JWT {
    /**
     * Codificación en Base64 URL-safe (sin rellenos de padding '=')
     */
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decodificación desde Base64 URL-safe
     */
    private static function base64UrlDecode(string $data): string {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Genera un token JWT firmado criptográficamente con HMAC-SHA256
     * 
     * @param array $payload Datos a almacenar dentro del token
     * @param int $expirySeconds Tiempo de expiración en segundos (por defecto 7 días)
     * @return string Token JWT generado en formato header.payload.signature
     */
    public static function encode(array $payload, int $expirySeconds = 604800): string {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $now = time();
        $payload['iat'] = $now;
        $payload['exp'] = $now + $expirySeconds;

        $headerEncoded = self::base64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES));

        $dataToSign = "{$headerEncoded}.{$payloadEncoded}";
        $rawSignature = hash_hmac('sha256', $dataToSign, JWT_SECRET, true);
        $signatureEncoded = self::base64UrlEncode($rawSignature);

        return "{$headerEncoded}.{$payloadEncoded}.{$signatureEncoded}";
    }

    /**
     * Valida y decodifica un token JWT
     * 
     * @param string $token Token en formato header.payload.signature
     * @return array|null Retorna el payload decodificado si es válido, o null si está vencido/alterado
     */
    public static function decode(string $token): ?array {
        $parts = explode('.', trim($token));
        if (count($parts) !== 3) {
            return null;
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        // Verificar firma criptográfica
        $dataToSign = "{$headerEncoded}.{$payloadEncoded}";
        $expectedRawSignature = hash_hmac('sha256', $dataToSign, JWT_SECRET, true);
        $expectedSignatureEncoded = self::base64UrlEncode($expectedRawSignature);

        // Comparación segura en tiempo constante para evitar ataques de temporización
        if (!hash_equals($expectedSignatureEncoded, $signatureEncoded)) {
            return null;
        }

        $payloadJson = self::base64UrlDecode($payloadEncoded);
        $payload = json_decode($payloadJson, true);

        if (!is_array($payload)) {
            return null;
        }

        // Verificar expiración temporal (exp claim)
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Token expirado
        }

        return $payload;
    }

    /**
     * Extrae el token JWT desde las cookies, cabecera Authorization: Bearer, o sesión
     */
    public static function getTokenFromRequest(): ?string {
        // 1. Buscar en Cookie HTTP-Only
        if (!empty($_COOKIE['jwt_auth'])) {
            return $_COOKIE['jwt_auth'];
        }

        // 2. Buscar en cabecera HTTP Authorization (Bearer <token>)
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            return $matches[1];
        }

        // 3. Buscar en variable de sesión de respaldo
        if (!empty($_SESSION['jwt_token'])) {
            return $_SESSION['jwt_token'];
        }

        return null;
    }
}
