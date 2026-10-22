<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../factories/AssetInterface.php';

/**
 * AssetRepository
 *
 * Abstrae el acceso a la base de datos para la entidad Asset,
 * promoviendo el Principio de Responsabilidad Única (SRP) y
 * el Principio de Inversión de Dependencias (DIP) al separar
 * la lógica SQL de las vistas y controladores.
 */
class AssetRepository
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Guarda un nuevo activo en la base de datos (con metadatos SENA legacy)
     */
    public function create(AssetInterface $asset, string $descripcionOriginal, string $modeloManual, string $valorIngreso): bool
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
                CURDATE(), ?, ?, ?,
                '41', '952710', 'INVE', ?, ?,
                ?, ?, 'Devolutivo', ?, ?,
                DATE_FORMAT(CURDATE(), '%d/%m/%Y'), ?
            )";

        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            $asset->getId(),
            $asset->getSerialNumber(),
            $asset->getAssetCode(),
            $asset->getName(),
            $asset->getDescription(),
            $asset->getCategoryId(),
            $asset->getCategoryName(),
            $asset->getEnvironmentId(),
            $asset->getEnvironmentName(),
            $asset->getStation(),
            $asset->getPhysicalStatus(),
            $asset->getStatusLabel(),
            $asset->getResponsiblePerson(),
            $asset->getWarrantyUntil(),
            $asset->getBarcode(),
            $asset->getQrToken(),
            $modeloManual,
            $asset->getConsecutivo(),
            $descripcionOriginal,
            $asset->getDescription(),
            $asset->getPlaca(),
            $asset->getSerialNumber(),
            $valorIngreso
        ]);
    }

    /**
     * Registra el alta en el historial de vida del activo
     */
    public function logHistoryCreation(AssetInterface $asset, string $familyName, string $authorName): void
    {
        $histStmt = $this->db->prepare("INSERT INTO asset_history (id, asset_id, title, date_str, time_str, description, author, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        $envName = $asset->getEnvironmentName();
        $placa = $asset->getPlaca();
        $warrantyUntil = $asset->getWarrantyUntil();

        $histStmt->execute([
            uniqid('hist-'),
            $asset->getId(),
            'Alta de Activo en Inventario SENA (' . $familyName . ')',
            date('d/m/Y'),
            date('h:i A'),
            "Ingreso patrimonial procesado por fábrica especializada bajo el módulo INVE con placa {$placa} en {$envName}. Garantía hasta {$warrantyUntil}.",
            $authorName,
            'INVENTORY_IN'
        ]);
    }

    /**
     * Obtiene todos los activos aplicando filtros opcionales.
     */
    public function findAllWithFilters(string $q = '', string $envFilter = '', string $statusFilter = '', string $catFilter = ''): array
    {
        $sql = "SELECT * FROM assets WHERE 1=1";
        $params = [];

        if (!empty($q)) {
            $sql .= " AND (placa LIKE ? OR serial_number LIKE ? OR name LIKE ? OR modelo LIKE ? OR asset_code LIKE ?)";
            $wildcard = "%{$q}%";
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
        }

        if (!empty($envFilter)) {
            $sql .= " AND environment_id = ?";
            $params[] = $envFilter;
        }

        if (!empty($statusFilter)) {
            $sql .= " AND physical_status = ?";
            $params[] = $statusFilter;
        }

        if (!empty($catFilter)) {
            $sql .= " AND category_id = ?";
            $params[] = $catFilter;
        }

        $sql .= " ORDER BY created_at DESC LIMIT 100";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
