<?php
declare(strict_types=1);

namespace App\Core;

use ReflectionClass;
use ReflectionNamedType;
use Exception;

/**
 * Class Container
 * Contenedor de Inversión de Control (IoC) e Inyección de Dependencias (DI).
 * Aplica el principio de Inversión de Dependencias (DIP) de SOLID.
 */
class Container
{
    private array $bindings = [];
    private array $instances = [];

    /**
     * Registra un enlace abstracto -> concreto
     */
    public function bind(string $abstract, $concrete = null): void
    {
        if ($concrete === null) {
            $concrete = $abstract;
        }
        $this->bindings[$abstract] = $concrete;
    }

    /**
     * Registra un singleton en el contenedor
     */
    public function singleton(string $abstract, $concrete = null): void
    {
        $this->bind($abstract, $concrete);
        $this->instances[$abstract] = null;
    }

    /**
     * Resuelve y retorna una instancia con sus dependencias inyectadas por reflexión
     */
    public function get(string $abstract): ?object
    {
        // Si ya existe instancia singleton creada, retornarla
        if (isset($this->instances[$abstract]) && $this->instances[$abstract] !== null) {
            return $this->instances[$abstract];
        }

        $concrete = $this->bindings[$abstract] ?? $abstract;

        // Si es una clausura o función anónima, ejecutarla
        if ($concrete instanceof \Closure) {
            $object = $concrete($this);
        } else {
            $object = $this->build($concrete);
        }

        // Si estaba marcado como singleton, guardar la instancia
        if (array_key_exists($abstract, $this->instances)) {
            $this->instances[$abstract] = $object;
        }

        return $object;
    }

    /**
     * Construye un objeto instanciando recursivamente sus dependencias de constructor
     */
    private function build(string $concrete): object
    {
        if (!class_exists($concrete)) {
            throw new Exception("No se puede resolver la clase {$concrete}");
        }

        $reflector = new ReflectionClass($concrete);

        if (!$reflector->isInstantiable()) {
            throw new Exception("La clase {$concrete} no es instanciable (interfaz o clase abstracta sin binding).");
        }

        $constructor = $reflector->getConstructor();

        if ($constructor === null) {
            return new $concrete();
        }

        $parameters = $constructor->getParameters();
        $dependencies = [];

        foreach ($parameters as $param) {
            $type = $param->getType();

            if ($type instanceof ReflectionNamedType && !$type->isBuiltin()) {
                $dependencies[] = $this->get($type->getName());
            } elseif ($param->isDefaultValueAvailable()) {
                $dependencies[] = $param->getDefaultValue();
            } else {
                throw new Exception("No se puede resolver el parámetro '{$param->getName()}' de la clase {$concrete}");
            }
        }

        return $reflector->newInstanceArgs($dependencies);
    }
}
