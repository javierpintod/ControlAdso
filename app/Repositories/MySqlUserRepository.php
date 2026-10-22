<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\UserRepositoryInterface;
use PDO;

/**
 * Class MySqlUserRepository
 * Repositorio de usuarios institucionales (SRP).
 */
class MySqlUserRepository implements UserRepositoryInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAll(): array
    {
        return $this->db->query("SELECT id, name, email, role, role_title, authorized_environments, last_login, status FROM user_profiles ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM user_profiles WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM user_profiles WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }
}
