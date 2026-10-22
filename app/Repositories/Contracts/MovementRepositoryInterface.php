<?php
declare(strict_types=1);

namespace App\Repositories\Contracts;

/**
 * Interface MovementRepositoryInterface
 * Contrato de persistencia para traslados y movimientos de inventario con actas criptográficas.
 */
interface MovementRepositoryInterface
{
    public function getAll(): array;
    public function findById(string $id): ?array;
    public function findByFolio(string $folio): ?array;
    public function create(array $data): bool;
}
