<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\MovementRepositoryInterface;
use PDO;

/**
 * Class MySqlMovementRepository
 * Repositorio de traslados y movimientos serializados (SRP).
 */
class MySqlMovementRepository implements MovementRepositoryInterface
{
    private ?PDO $db;

    public function __construct(?PDO $db)
    {
        $this->db = $db;
    }

    public function getAll(): array
    {
        return $this->db->query("SELECT * FROM inventory_movements ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM inventory_movements WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function findByFolio(string $folio): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM inventory_movements WHERE folio = ? LIMIT 1");
        $stmt->execute([$folio]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(array $data): bool
    {
        $sql = "INSERT INTO inventory_movements (
            id, folio, type, product_name, asset_id, asset_code, serial_number,
            origin_environment_id, origin_environment_name, destination_environment_id, destination_environment_name,
            quantity, notes, user_id, user_name, user_role, user_email,
            timestamp_str, crypto_hash, qr_verification_token, status
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?
        )";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $data['id'], $data['folio'], $data['type'] ?? 'TRANSFER',
            $data['product_name'], $data['asset_id'], $data['asset_code'], $data['serial_number'],
            $data['origin_environment_id'], $data['origin_environment_name'],
            $data['destination_environment_id'], $data['destination_environment_name'],
            $data['quantity'] ?? 1, $data['notes'] ?? '',
            $data['user_id'], $data['user_name'], $data['user_role'], $data['user_email'],
            $data['timestamp_str'], $data['crypto_hash'], $data['qr_verification_token'],
            $data['status'] ?? 'COMPLETADO'
        ]);
    }
}
