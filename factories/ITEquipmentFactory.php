<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetAbstractFactory.php';
require_once __DIR__ . '/models/ComputeAsset.php';

/**
 * Concrete Factory: ITEquipmentFactory
 * Fábrica concreta responsable de crear elementos de la familia de Cómputo y Tecnología.
 */
class ITEquipmentFactory extends AssetAbstractFactory
{
    public function createAsset(array $data): AssetInterface
    {
        $errors = $this->validateSpecificRequirements($data);
        if (!empty($errors)) {
            throw new InvalidArgumentException("Error de validación en Fábrica de Cómputo: " . implode(', ', $errors));
        }

        $preparedData = $this->prepareInstitutionalData($data);
        return new ComputeAsset($preparedData);
    }

    public function getFamilyName(): string
    {
        return 'Familia de Cómputo y Estaciones Móviles (IT)';
    }

    public function getSupportedCategories(): array
    {
        return ['cat-comp', 'cat-cpu', 'cat-aio', 'COMP', 'CPU', 'AIO', 'computo'];
    }

    public function getDefaultWarrantyYears(): int
    {
        return 3; // Garantía tecnológica institucional estándar de 3 años
    }

    public function validateSpecificRequirements(array $data): array
    {
        $errors = [];
        if (empty($data['placa'])) {
            $errors[] = 'El número de placa de inventario institucional es requerido para equipos de cómputo.';
        }
        return $errors;
    }
}
