<?php
declare(strict_types=1);

namespace App\Repositories\Contracts;

/**
 * Interface UserRepositoryInterface
 * Contrato de persistencia para usuarios y perfiles institucionales.
 */
interface UserRepositoryInterface
{
    public function getAll(): array;
    public function findById(string $id): ?array;
    public function findByEmail(string $email): ?array;
}
