<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetInterface.php';

/**
 * Class AssetAbstractFactory
 * Clase abstracta que define la interfaz de la FÁBRICA ABSTRACTA (Abstract Factory).
 * Establece los métodos de fabricación para crear familias de activos relacionados
 * y aplicar reglas de negocio específicas de cada familia (garantías, specs, mantenimiento).
 */
abstract class AssetAbstractFactory
{
    /**
     * Método fábrica principal: Crea y retorna una instancia concreta de AssetInterface
     */
    abstract public function createAsset(array $data): AssetInterface;

    /**
     * Retorna el nombre legible de la familia de activos
     */
    abstract public function getFamilyName(): string;

    /**
     * Retorna los IDs o códigos de categoría que esta fábrica puede procesar
     */
    abstract public function getSupportedCategories(): array;

    /**
     * Retorna los años de garantía institucional predeterminados para esta familia
     */
    abstract public function getDefaultWarrantyYears(): int;

    /**
     * Valida requerimientos mínimos o técnicos específicos de la familia
     * Retorna un arreglo de errores (vacío si es válido)
     */
    abstract public function validateSpecificRequirements(array $data): array;

    /**
     * Prepara y estandariza los datos antes de la instanciación
     */
    public function prepareInstitutionalData(array $data): array
    {
        // Calcular fecha límite de garantía según los años institucionales de la familia
        if (empty($data['warranty_until'])) {
            $years = $this->getDefaultWarrantyYears();
            $data['warranty_until'] = date('Y-m-d', strtotime("+{$years} years"));
        }

        if (empty($data['assigned_date'])) {
            $data['assigned_date'] = date('Y-m-d');
        }

        if (empty($data['fecha_adquisicion'])) {
            $data['fecha_adquisicion'] = date('d/m/Y');
        }

        return $data;
    }
}
