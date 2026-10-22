<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use PDO;

/**
 * Class MySqlEnvironmentRepository
 * Repositorio de Ambientes y Categorías en MySQL (SRP & ISP).
 */
class MySqlEnvironmentRepository implements EnvironmentRepositoryInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAllEnvironments(): array
    {
        return $this->db->query("SELECT * FROM environments ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findEnvironmentById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM environments WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function getAllCategories(): array
    {
        return $this->db->query("SELECT * FROM product_categories ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findCategoryById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM product_categories WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function getCampuses(): array
    {
        return $this->db->query("SELECT * FROM campuses ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);
    }
}
