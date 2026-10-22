<?php
declare(strict_types=1);

require_once __DIR__ . '/../BaseAsset.php';

/**
 * Concrete Product: ComputeAsset
 * Familia: Cómputo y Tecnología (Laptops, Workstations, Servidores, AIOs)
 */
class ComputeAsset extends BaseAsset
{
    protected string $processor;
    protected string $ram;
    protected string $storage;
    protected string $screenSize;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->processor = $data['processor'] ?? ($data['technical_specs']['processor'] ?? 'Intel Core i7 / Xeon');
        $this->ram = $data['ram'] ?? ($data['technical_specs']['ram'] ?? '16 GB / 32 GB');
        $this->storage = $data['storage'] ?? ($data['technical_specs']['storage'] ?? '512 GB SSD NVMe / 1 TB');
        $this->screenSize = $data['screen_size'] ?? ($data['technical_specs']['screen_size'] ?? '15.6" / 23.8"');

        $this->technicalSpecs = [
            'family_type' => 'COMPUTE_EQUIPMENT',
            'processor' => $this->processor,
            'ram' => $this->ram,
            'storage' => $this->storage,
            'screen_size' => $this->screenSize,
            'maintenance_cycle_days' => 180,
            'requires_network_access' => true,
            'operating_system_license' => 'Windows 11 Pro Edu / Ubuntu LTS'
        ];
    }

    public function getFamily(): string
    {
        return 'Equipos de Cómputo y Estaciones Móviles';
    }

    public function getProcessor(): string { return $this->processor; }
    public function getRam(): string { return $this->ram; }
    public function getStorage(): string { return $this->storage; }
}
