<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetAbstractFactory.php';
require_once __DIR__ . '/ITEquipmentFactory.php';
require_once __DIR__ . '/InfrastructureFactory.php';
require_once __DIR__ . '/RoboticsFactory.php';
require_once __DIR__ . '/FurnitureFactory.php';

/**
 * Class AssetFactoryProducer
 * Productor de Fábricas (Factory of Factories).
 * Punto de entrada del patrón Fábrica Abstracta que resuelve y suministra la fábrica
 * concreta adecuada según la categoría o tipo de elemento a almacenar.
 */
class AssetFactoryProducer
{
    /**
     * @var AssetAbstractFactory[]
     */
    private static array $factories = [];

    /**
     * Obtiene la fábrica correspondiente para un identificador o código de categoría
     *
     * @param string $categoryIdentifier ID de categoría (ej: 'cat-comp', 'cat-clim', 'cat-robt') o nombre
     * @return AssetAbstractFactory Instancia de la fábrica concreta
     */
    public static function getFactory(string $categoryIdentifier): AssetAbstractFactory
    {
        self::initFactories();

        $key = strtolower(trim($categoryIdentifier));

        // Búsqueda directa por categorías soportadas
        foreach (self::$factories as $factory) {
            foreach ($factory->getSupportedCategories() as $supported) {
                if (strtolower($supported) === $key) {
                    return $factory;
                }
            }
        }

        // Búsqueda por coincidencia de texto
        if (str_contains($key, 'comp') || str_contains($key, 'cpu') || str_contains($key, 'aio') || str_contains($key, 'laptop') || str_contains($key, 'portatil')) {
            return self::$factories['it'];
        }

        if (str_contains($key, 'clim') || str_contains($key, 'aire') || str_contains($key, 'infra') || str_contains($key, 'rack') || str_contains($key, 'ups')) {
            return self::$factories['infrastructure'];
        }

        if (str_contains($key, 'robt') || str_contains($key, 'robot') || str_contains($key, 'iot') || str_contains($key, 'simulador') || str_contains($key, 'vr')) {
            return self::$factories['robotics'];
        }

        // Por defecto, asignar fábrica de mobiliario/general
        return self::$factories['furniture'];
    }

    /**
     * Retorna todas las fábricas concretas disponibles en el sistema
     *
     * @return AssetAbstractFactory[]
     */
    public static function getAllFactories(): array
    {
        self::initFactories();
        return self::$factories;
    }

    private static function initFactories(): void
    {
        if (empty(self::$factories)) {
            self::$factories = [
                'it' => new ITEquipmentFactory(),
                'infrastructure' => new InfrastructureFactory(),
                'robotics' => new RoboticsFactory(),
                'furniture' => new FurnitureFactory(),
            ];
        }
    }
}
