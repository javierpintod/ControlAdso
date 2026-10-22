<?php
declare(strict_types=1);

namespace App\Repositories\Contracts;

/**
 * Interface EnvironmentRepositoryInterface
 * Contrato de acceso a ambientes y categorías de aprendizaje (ISP & DIP).
 */
interface EnvironmentRepositoryInterface
{
    public function getAllEnvironments(): array;
    public function findEnvironmentById(string $id): ?array;
    public function getAllCategories(): array;
    public function findCategoryById(string $id): ?array;
    public function getCampuses(): array;
}
