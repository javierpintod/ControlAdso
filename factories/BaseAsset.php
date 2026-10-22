<?php
declare(strict_types=1);

require_once __DIR__ . '/AssetInterface.php';

/**
 * Class BaseAsset
 * Implementación abstracta de AssetInterface que consolida los atributos institucionales
 * del inventario SENA y los métodos compartidos por todas las familias de activos.
 */
abstract class BaseAsset implements AssetInterface
{
    protected string $id;
    protected string $serialNumber;
    protected string $assetCode;
    protected string $name;
    protected string $description;
    protected string $categoryId;
    protected string $categoryName;
    protected string $environmentId;
    protected string $environmentName;
    protected string $station;
    protected string $physicalStatus;
    protected string $statusLabel;
    protected string $responsiblePerson;
    protected string $assignedDate;
    protected string $warrantyUntil;
    protected string $barcode;
    protected string $qrToken;
    protected string $regional;
    protected string $centroCosto;
    protected string $modulo;
    protected string $modelo;
    protected string $consecutivo;
    protected string $descripcion;
    protected string $descripcionActual;
    protected string $tipo;
    protected string $placa;
    protected string $serial;
    protected string $fechaAdquisicion;
    protected string $valorIngreso;
    protected array $technicalSpecs = [];

    public function __construct(array $data)
    {
        $this->placa = trim($data['placa'] ?? '');
        $this->serial = trim($data['serial'] ?? '');
        $this->descripcion = trim($data['descripcion'] ?? '');
        $this->modelo = trim($data['modelo'] ?? 'N/A');
        $this->descripcionActual = trim($data['descripcion_actual'] ?? $this->descripcion);
        $this->categoryId = trim($data['category_id'] ?? 'general');
        $this->categoryName = trim($data['category_name'] ?? 'General');
        $this->environmentId = trim($data['environment_id'] ?? 'unassigned');
        $this->environmentName = trim($data['environment_name'] ?? 'Sin Asignar');
        $this->station = trim($data['station'] ?? 'Estación Principal');
        $this->physicalStatus = trim($data['physical_status'] ?? 'operativo');
        $this->responsiblePerson = trim($data['responsible_person'] ?? 'Responsable Institucional');
        $this->valorIngreso = trim($data['valor_ingreso'] ?? '$0,00');

        // Metadatos institucionales SENA
        $this->regional = $data['regional'] ?? '41'; // Regional Antioquia
        $this->centroCosto = $data['centro_costo'] ?? '952710'; // Centro de Servicios y Gestión Empresarial
        $this->modulo = $data['modulo'] ?? 'INVE'; // Módulo oficial de inventario
        $this->consecutivo = $data['consecutivo'] ?? (string)random_int(200000, 399999);
        $this->tipo = $data['tipo'] ?? 'Devolutivo';

        // Generación de identificadores normalizados
        $this->id = !empty($data['id']) ? $data['id'] : 'ast-sena-' . $this->placa;
        $this->assetCode = !empty($data['asset_code']) ? $data['asset_code'] : 'AST-' . $this->placa;
        $this->serialNumber = !empty($this->serial) ? $this->serial : 'SENA-SN-' . $this->placa;
        
        $this->name = !empty($this->modelo) && $this->modelo !== 'N/A'
            ? "{$this->descripcion} {$this->modelo}"
            : $this->descripcion;

        $paddedPlaca = substr(str_pad($this->placa, 10, '0', STR_PAD_LEFT), -10);
        $this->barcode = !empty($data['barcode']) ? $data['barcode'] : '770' . $paddedPlaca;
        $this->qrToken = !empty($data['qr_token']) ? $data['qr_token'] : 'qr_sena_' . $this->placa;

        $this->assignedDate = $data['assigned_date'] ?? date('Y-m-d');
        $this->fechaAdquisicion = $data['fecha_adquisicion'] ?? date('d/m/Y');

        $this->statusLabel = $this->resolveStatusLabel($this->physicalStatus);
        
        // Garantía calculada por la subclase/fábrica
        $this->warrantyUntil = $data['warranty_until'] ?? date('Y-m-d', strtotime('+3 years'));
        
        // Especificaciones técnicas
        if (!empty($data['technical_specs']) && is_array($data['technical_specs'])) {
            $this->technicalSpecs = $data['technical_specs'];
        }
    }

    protected function resolveStatusLabel(string $status): string
    {
        return match($status) {
            'operativo' => 'Operativo en Uso',
            'mesa_servicio' => 'En Mesa de Ayuda / Diagnóstico',
            'con_dano' => 'Con Daño Físico / Depósito',
            'mantenimiento' => 'En Mantenimiento Preventivo',
            default => 'Decomisado / Baja'
        };
    }

    public function getId(): string { return $this->id; }
    public function getSerialNumber(): string { return $this->serialNumber; }
    public function getAssetCode(): string { return $this->assetCode; }
    public function getName(): string { return $this->name; }
    public function getDescription(): string { return $this->descripcionActual; }
    public function getCategoryId(): string { return $this->categoryId; }
    public function getCategoryName(): string { return $this->categoryName; }
    public function getEnvironmentId(): string { return $this->environmentId; }
    public function getEnvironmentName(): string { return $this->environmentName; }
    public function getStation(): string { return $this->station; }
    public function getPhysicalStatus(): string { return $this->physicalStatus; }
    public function getStatusLabel(): string { return $this->statusLabel; }
    public function getResponsiblePerson(): string { return $this->responsiblePerson; }
    public function getAssignedDate(): string { return $this->assignedDate; }
    public function getWarrantyUntil(): string { return $this->warrantyUntil; }
    public function getBarcode(): string { return $this->barcode; }
    public function getQrToken(): string { return $this->qrToken; }
    public function getRegional(): string { return $this->regional; }
    public function getCentroCosto(): string { return $this->centroCosto; }
    public function getModulo(): string { return $this->modulo; }
    public function getModelo(): string { return $this->modelo; }
    public function getConsecutivo(): string { return $this->consecutivo; }
    public function getDescripcion(): string { return $this->descripcion; }
    public function getDescripcionActual(): string { return $this->descripcionActual; }
    public function getTipo(): string { return $this->tipo; }
    public function getPlaca(): string { return $this->placa; }
    public function getSerial(): string { return $this->serial; }
    public function getFechaAdquisicion(): string { return $this->fechaAdquisicion; }
    public function getValorIngreso(): string { return $this->valorIngreso; }
    public function getTechnicalSpecs(): array { return $this->technicalSpecs; }

    abstract public function getFamily(): string;

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'serial_number' => $this->serialNumber,
            'asset_code' => $this->assetCode,
            'name' => $this->name,
            'description' => $this->descripcionActual,
            'category_id' => $this->categoryId,
            'category_name' => $this->categoryName,
            'environment_id' => $this->environmentId,
            'environment_name' => $this->environmentName,
            'station' => $this->station,
            'physical_status' => $this->physicalStatus,
            'status_label' => $this->statusLabel,
            'responsible_person' => $this->responsiblePerson,
            'assigned_date' => $this->assignedDate,
            'warranty_until' => $this->warrantyUntil,
            'barcode' => $this->barcode,
            'qr_token' => $this->qrToken,
            'regional' => $this->regional,
            'centro_costo' => $this->centroCosto,
            'modulo' => $this->modulo,
            'modelo' => $this->modelo,
            'consecutivo' => $this->consecutivo,
            'descripcion' => $this->descripcion,
            'descripcion_actual' => $this->descripcionActual,
            'tipo' => $this->tipo,
            'placa' => $this->placa,
            'serial' => $this->serial,
            'fecha_adquisicion' => $this->fechaAdquisicion,
            'valor_ingreso' => $this->valorIngreso,
            'family' => $this->getFamily(),
            'technical_specs' => $this->technicalSpecs
        ];
    }
}
