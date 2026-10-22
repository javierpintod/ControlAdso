<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Models\Asset;
use App\Repositories\Contracts\AssetRepositoryInterface;
use PDO;

/**
 * Class MySqlAssetRepository
 * Implementación de persistencia en MySQL para la entidad Asset (SOLID SRP, LSP, DIP).
 */
class MySqlAssetRepository implements AssetRepositoryInterface
{
    private ?PDO $db;

    public function __construct(?PDO $db)
    {
        $this->db = $db;
    }

    public function getAll(?string $search = null, ?string $categoryId = null, ?string $environmentId = null, ?string $status = null): array
    {
        $sql = "SELECT * FROM assets WHERE 1=1";
        $params = [];

        if (!empty($search)) {
            $sql .= " AND (name LIKE ? OR serial_number LIKE ? OR asset_code LIKE ? OR placa LIKE ? OR modelo LIKE ?)";
            $term = "%{$search}%";
            $params = array_merge($params, [$term, $term, $term, $term, $term]);
        }

        if (!empty($categoryId) && $categoryId !== 'all') {
            $sql .= " AND category_id = ?";
            $params[] = $categoryId;
        }

        if (!empty($environmentId) && $environmentId !== 'all') {
            $sql .= " AND environment_id = ?";
            $params[] = $environmentId;
        }

        if (!empty($status) && $status !== 'all') {
            $sql .= " AND physical_status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY created_at DESC";

        if ($this->db === null) {
            return [];
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $assets = [];
        foreach ($rows as $row) {
            $assets[] = new Asset($row);
        }

        return $assets;
    }

    public function findById(string $id): ?Asset
    {
        $stmt = $this->db->prepare("SELECT * FROM assets WHERE id = ? OR placa = ? OR asset_code = ? LIMIT 1");
        $stmt->execute([$id, $id, $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? new Asset($row) : null;
    }

    public function save(Asset $asset): bool
    {
        $sql = "INSERT INTO assets (
            id, serial_number, asset_code, name, description,
            category_id, category_name, environment_id, environment_name,
            station, physical_status, status_label, responsible_person,
            assigned_date, warranty_until, barcode, qr_token,
            regional, centro_costo, modulo, modelo, consecutivo,
            descripcion, descripcion_actual, tipo, placa, serial,
            fecha_adquisicion, valor_ingreso
        ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?
        )";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $asset->id, $asset->serialNumber, $asset->assetCode, $asset->name, $asset->description,
            $asset->categoryId, $asset->categoryName, $asset->environmentId, $asset->environmentName,
            $asset->station, $asset->physicalStatus, $asset->statusLabel, $asset->responsiblePerson,
            $asset->assignedDate, $asset->warrantyUntil, $asset->barcode, $asset->qrToken,
            $asset->regional, $asset->centroCosto, $asset->modulo, $asset->modelo, $asset->consecutivo,
            $asset->descripcion, $asset->descripcionActual, $asset->tipo, $asset->placa, $asset->serial,
            $asset->fechaAdquisicion, $asset->valorIngreso
        ]);
    }

    public function update(Asset $asset): bool
    {
        $sql = "UPDATE assets SET
            name = ?, description = ?, category_id = ?, category_name = ?,
            environment_id = ?, environment_name = ?, station = ?,
            physical_status = ?, status_label = ?, responsible_person = ?,
            modelo = ?, descripcion = ?, descripcion_actual = ?,
            valor_ingreso = ?
        WHERE id = ?";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $asset->name, $asset->description, $asset->categoryId, $asset->categoryName,
            $asset->environmentId, $asset->environmentName, $asset->station,
            $asset->physicalStatus, $asset->statusLabel, $asset->responsiblePerson,
            $asset->modelo, $asset->descripcion, $asset->descripcionActual,
            $asset->valorIngreso, $asset->id
        ]);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM assets WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function count(): int
    {
        if ($this->db === null) {
            return 0;
        }
        return (int)$this->db->query("SELECT COUNT(*) FROM assets")->fetchColumn();
    }

    public function countByStatus(string $status): int
    {
        if ($this->db === null) {
            return 0;
        }
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM assets WHERE physical_status = ?");
        $stmt->execute([$status]);
        return (int)$stmt->fetchColumn();
    }

    public function getHistory(string $assetId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM asset_history WHERE asset_id = ? ORDER BY created_at DESC");
        $stmt->execute([$assetId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addHistory(array $data): bool
    {
        $stmt = $this->db->prepare("INSERT INTO asset_history (id, asset_id, title, date_str, time_str, description, author, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        return $stmt->execute([
            $data['id'] ?? uniqid('hist-'),
            $data['asset_id'],
            $data['title'] ?? 'Evento en Inventario',
            $data['date_str'] ?? date('d/m/Y'),
            $data['time_str'] ?? date('h:i A'),
            $data['description'] ?? '',
            $data['author'] ?? 'Sistema',
            $data['event_type'] ?? 'GENERAL'
        ]);
    }
}
