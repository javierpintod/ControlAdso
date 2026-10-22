<?php
declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Asset;

/**
 * Interface AssetRepositoryInterface
 * Contrato de Persistencia para Activos (Principio ISP y DIP de SOLID).
 */
interface AssetRepositoryInterface
{
    /**
     * @return Asset[]
     */
    public function getAll(?string $search = null, ?string $categoryId = null, ?string $environmentId = null, ?string $status = null): array;

    public function findById(string $id): ?Asset;

    public function save(Asset $asset): bool;

    public function update(Asset $asset): bool;

    public function delete(string $id): bool;

    public function count(): int;

    public function countByStatus(string $status): int;

    public function getHistory(string $assetId): array;

    public function addHistory(array $data): bool;
}
