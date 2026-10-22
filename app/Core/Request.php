<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Class Request
 * Encapsula la información de la petición HTTP (Principio SRP de SOLID).
 */
class Request
{
    private array $get;
    private array $post;
    private array $server;
    private array $cookies;

    public function __construct(?array $get = null, ?array $post = null, ?array $server = null, ?array $cookies = null)
    {
        $this->get = $get ?? $_GET;
        $this->post = $post ?? $_POST;
        $this->server = $server ?? $_SERVER;
        $this->cookies = $cookies ?? $_COOKIE;
    }

    public static function capture(): self
    {
        return new self($_GET, $_POST, $_SERVER, $_COOKIE);
    }

    public function getMethod(): string
    {
        return strtoupper($this->server['REQUEST_METHOD'] ?? 'GET');
    }

    public function isPost(): bool
    {
        return $this->getMethod() === 'POST';
    }

    public function isGet(): bool
    {
        return $this->getMethod() === 'GET';
    }

    public function get(string $key, $default = null)
    {
        return $this->get[$key] ?? $default;
    }

    public function post(string $key, $default = null)
    {
        return $this->post[$key] ?? $default;
    }

    public function input(string $key, $default = null)
    {
        return $this->post[$key] ?? ($this->get[$key] ?? $default);
    }

    public function all(): array
    {
        return array_merge($this->get, $this->post);
    }

    public function cookie(string $key, $default = null)
    {
        return $this->cookies[$key] ?? $default;
    }

    public function getUri(): string
    {
        $uri = $this->server['REQUEST_URI'] ?? '/';
        $position = strpos($uri, '?');
        return $position === false ? $uri : substr($uri, 0, $position);
    }
}
