<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetAbstractFactory.php';
require_once __DIR__ . '/models/FurnitureAsset.php';

/**
 * Concrete Factory: FurnitureFactory
 * Fábrica concreta responsable de crear elementos de la familia de Mobiliario y Enseres de Ambientes.
 */
class FurnitureFactory extends AssetAbstractFactory
{
    public function createAsset(array $data): AssetInterface
    {
        $errors = $this->validateSpecificRequirements($data);
        if (!empty($errors)) {
            throw new InvalidArgumentException("Error de validación en Fábrica de Mobiliario: " . implode(', ', $errors));
        }

        $preparedData = $this->prepareInstitutionalData($data);
        return new FurnitureAsset($preparedData);
    }

    public function getFamilyName(): string
    {
        return 'Familia de Mobiliario Ergonómico y Enseres de Aprendizaje';
    }

    public function getSupportedCategories(): array
    {
        return ['cat-mob', 'cat-furn', 'MOB', 'FURN', 'mobiliario', 'silla', 'mesa', 'locker', 'tablero', 'general'];
    }

    public function getDefaultWarrantyYears(): int
    {
        return 1; // Mobiliario estándar: 1 año de garantía comercial
    }

    public function validateSpecificRequirements(array $data): array
    {
        $errors = [];
        if (empty($data['placa'])) {
            $errors[] = 'El número de placa de inventario institucional es requerido para mobiliario devolutivo.';
        }
        return $errors;
    }
}
