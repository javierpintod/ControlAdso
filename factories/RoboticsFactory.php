<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetAbstractFactory.php';
require_once __DIR__ . '/models/RoboticsAsset.php';

/**
 * Concrete Factory: RoboticsFactory
 * Fábrica concreta responsable de crear elementos de la familia de Robótica, IoT y Realidad Virtual.
 */
class RoboticsFactory extends AssetAbstractFactory
{
    public function createAsset(array $data): AssetInterface
    {
        $errors = $this->validateSpecificRequirements($data);
        if (!empty($errors)) {
            throw new InvalidArgumentException("Error de validación en Fábrica de Robótica: " . implode(', ', $errors));
        }

        $preparedData = $this->prepareInstitutionalData($data);
        return new RoboticsAsset($preparedData);
    }

    public function getFamilyName(): string
    {
        return 'Familia de Robótica Educativa, Sensores e IoT';
    }

    public function getSupportedCategories(): array
    {
        return ['cat-robt', 'ROBT', 'cat-iot', 'robotica', 'simulador'];
    }

    public function getDefaultWarrantyYears(): int
    {
        return 2; // Activos de laboratorio robótico: 2 años con recalibraciones semestrales
    }

    public function validateSpecificRequirements(array $data): array
    {
        $errors = [];
        if (empty($data['placa'])) {
            $errors[] = 'El número de placa de inventario institucional es requerido para equipos de robótica.';
        }
        return $errors;
    }
}
