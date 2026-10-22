<?php
declare(strict_types=1);

require_once __DIR__ . '/../BaseAsset.php';

/**
 * Concrete Product: FurnitureAsset
 * Familia: Mobiliario Ergonómico y Enseres de Ambientes de Aprendizaje (Sillas, Mesas, Lockers)
 */
class FurnitureAsset extends BaseAsset
{
    protected string $material;
    protected string $ergonomicStandard;
    protected string $loadCapacity;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->material = $data['material'] ?? ($data['technical_specs']['material'] ?? 'Polipropileno / Acero Electroestático / Malla Transpirable');
        $this->ergonomicStandard = $data['ergonomic_standard'] ?? ($data['technical_specs']['ergonomic_standard'] ?? 'Norma NTC 5655 / ANSI BIFMA');
        $this->loadCapacity = $data['load_capacity'] ?? ($data['technical_specs']['load_capacity'] ?? '120 kg - 150 kg');

        $this->technicalSpecs = [
            'family_type' => 'FURNITURE_FIXTURE',
            'material' => $this->material,
            'ergonomic_standard' => $this->ergonomicStandard,
            'load_capacity' => $this->loadCapacity,
            'maintenance_cycle_days' => 365,
            'requires_specialized_tooling' => false
        ];
    }

    public function getFamily(): string
    {
        return 'Mobiliario Ergonómico y Enseres Institucionales';
    }

    public function getMaterial(): string { return $this->material; }
}
