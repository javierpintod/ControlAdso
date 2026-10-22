<?php
declare(strict_types=1);

require_once __DIR__ . '/../BaseAsset.php';

/**
 * Concrete Product: RoboticsAsset
 * Familia: Robótica Educativa, Realidad Virtual y Dispositivos IoT (Brazos 6-DOF, VR, Sensores)
 */
class RoboticsAsset extends BaseAsset
{
    protected string $degreesOfFreedom;
    protected string $communicationProtocol;
    protected string $payloadCapacity;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->degreesOfFreedom = $data['dof'] ?? ($data['technical_specs']['dof'] ?? '6 Grados de Libertad (6-DOF)');
        $this->communicationProtocol = $data['protocol'] ?? ($data['technical_specs']['protocol'] ?? 'ROS2 / Ethernet / USB 3.0 / CAN');
        $this->payloadCapacity = $data['payload'] ?? ($data['technical_specs']['payload'] ?? '500g - 2.5kg');

        $this->technicalSpecs = [
            'family_type' => 'ROBOTICS_IOT',
            'degrees_of_freedom' => $this->degreesOfFreedom,
            'communication_protocol' => $this->communicationProtocol,
            'payload_capacity' => $this->payloadCapacity,
            'maintenance_cycle_days' => 120,
            'calibration_required' => true,
            'safety_emergency_stop' => 'Botón Físico E-Stop Integrado'
        ];
    }

    public function getFamily(): string
    {
        return 'Robótica Educativa, Realidad Virtual e IoT';
    }

    public function getDegreesOfFreedom(): string { return $this->degreesOfFreedom; }
}
