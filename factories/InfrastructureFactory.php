<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetAbstractFactory.php';
require_once __DIR__ . '/models/InfrastructureAsset.php';

/**
 * Concrete Factory: InfrastructureFactory
 * Fábrica concreta responsable de crear elementos de la familia de Climatización e Infraestructura.
 */
class InfrastructureFactory extends AssetAbstractFactory
{
    public function createAsset(array $data): AssetInterface
    {
        $errors = $this->validateSpecificRequirements($data);
        if (!empty($errors)) {
            throw new InvalidArgumentException("Error de validación en Fábrica de Infraestructura: " . implode(', ', $errors));
        }

        $preparedData = $this->prepareInstitutionalData($data);
        return new InfrastructureAsset($preparedData);
    }

    public function getFamilyName(): string
    {
        return 'Familia de Climatización e Infraestructura Técnica (HVAC)';
    }

    public function getSupportedCategories(): array
    {
        return ['cat-clim', 'CLIM', 'cat-infra', 'climatizacion', 'redes'];
    }

    public function getDefaultWarrantyYears(): int
    {
        return 5; // Infraestructura y compresores: 5 años de vida útil y garantía extendida
    }

    public function validateSpecificRequirements(array $data): array
    {
        $errors = [];
        if (empty($data['placa'])) {
            $errors[] = 'El número de placa es obligatorio para activos de climatización e infraestructura.';
        }
        return $errors;
    }
}
