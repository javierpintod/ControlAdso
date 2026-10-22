<?php
declare(strict_types=1);

require_once __DIR__ . '/../BaseAsset.php';

/**
 * Concrete Product: InfrastructureAsset
 * Familia: Climatización, Redes e Infraestructura de Ambientes (Aires acondicionados, Racks, UPS)
 */
class InfrastructureAsset extends BaseAsset
{
    protected string $btuCapacity;
    protected string $voltage;
    protected string $filterType;
    protected string $refrigerantGas;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->btuCapacity = $data['btu_capacity'] ?? ($data['technical_specs']['btu_capacity'] ?? '24000 BTU / 60000 BTU');
        $this->voltage = $data['voltage'] ?? ($data['technical_specs']['voltage'] ?? '220V Bifásico');
        $this->filterType = $data['filter_type'] ?? ($data['technical_specs']['filter_type'] ?? 'Antibacteriano Lavable');
        $this->refrigerantGas = $data['refrigerant_gas'] ?? ($data['technical_specs']['refrigerant_gas'] ?? 'R410A Ecológico');

        $this->technicalSpecs = [
            'family_type' => 'INFRASTRUCTURE_HVAC',
            'btu_capacity' => $this->btuCapacity,
            'voltage' => $this->voltage,
            'filter_type' => $this->filterType,
            'refrigerant_gas' => $this->refrigerantGas,
            'maintenance_cycle_days' => 90, // Mantenimiento trimestral obligatorio
            'requires_certified_technician' => true,
            'mounting_type' => 'Pared / Piso Techo'
        ];
    }

    public function getFamily(): string
    {
        return 'Climatización e Infraestructura Técnica';
    }

    public function getBtuCapacity(): string { return $this->btuCapacity; }
    public function getVoltage(): string { return $this->voltage; }
}
