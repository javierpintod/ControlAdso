<?php
declare(strict_types=1);

namespace App\Models;

/**
 * Class Asset (Entidad del Modelo)
 * Representa un activo serializado institucional del SENA en el dominio MVC.
 */
class Asset
{
    public string $id;
    public string $serialNumber;
    public string $assetCode;
    public string $name;
    public string $description;
    public string $categoryId;
    public string $categoryName;
    public string $environmentId;
    public string $environmentName;
    public string $station;
    public string $physicalStatus;
    public string $statusLabel;
    public string $responsiblePerson;
    public string $assignedDate;
    public string $warrantyUntil;
    public string $barcode;
    public string $qrToken;
    public string $regional;
    public string $centroCosto;
    public string $modulo;
    public string $modelo;
    public string $consecutivo;
    public string $descripcion;
    public string $descripcionActual;
    public string $tipo;
    public string $placa;
    public string $serial;
    public string $fechaAdquisicion;
    public string $valorIngreso;
    public ?string $createdAt;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? '';
        $this->serialNumber = $data['serial_number'] ?? ($data['serial'] ?? '');
        $this->assetCode = $data['asset_code'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->description = $data['description'] ?? ($data['descripcion_actual'] ?? '');
        $this->categoryId = $data['category_id'] ?? '';
        $this->categoryName = $data['category_name'] ?? '';
        $this->environmentId = $data['environment_id'] ?? '';
        $this->environmentName = $data['environment_name'] ?? '';
        $this->station = $data['station'] ?? 'Estación Principal';
        $this->physicalStatus = $data['physical_status'] ?? 'operativo';
        $this->statusLabel = $data['status_label'] ?? 'Operativo en Uso';
        $this->responsiblePerson = $data['responsible_person'] ?? '';
        $this->assignedDate = $data['assigned_date'] ?? date('Y-m-d');
        $this->warrantyUntil = $data['warranty_until'] ?? date('Y-m-d', strtotime('+3 years'));
        $this->barcode = $data['barcode'] ?? '';
        $this->qrToken = $data['qr_token'] ?? '';
        $this->regional = $data['regional'] ?? '41';
        $this->centroCosto = $data['centro_costo'] ?? '952710';
        $this->modulo = $data['modulo'] ?? 'INVE';
        $this->modelo = $data['modelo'] ?? '';
        $this->consecutivo = $data['consecutivo'] ?? '';
        $this->descripcion = $data['descripcion'] ?? '';
        $this->descripcionActual = $data['descripcion_actual'] ?? $this->description;
        $this->tipo = $data['tipo'] ?? 'Devolutivo';
        $this->placa = $data['placa'] ?? '';
        $this->serial = $data['serial'] ?? $this->serialNumber;
        $this->fechaAdquisicion = $data['fecha_adquisicion'] ?? date('d/m/Y');
        $this->valorIngreso = $data['valor_ingreso'] ?? '$0,00';
        $this->createdAt = $data['created_at'] ?? null;
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
