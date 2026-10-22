<?php
declare(strict_types=1);

namespace App\Repositories\Contracts;

/**
 * Interface TicketRepositoryInterface
 * Contrato de persistencia para casos y tickets de la Mesa de Ayuda Técnica.
 */
interface TicketRepositoryInterface
{
    public function getAll(): array;
    public function findById(string $id): ?array;
    public function create(array $data): bool;
    public function updateStatus(string $id, string $status, string $statusLabel): bool;
    public function getNotes(string $ticketId): array;
    public function addNote(array $data): bool;
    public function getTimeline(string $ticketId): array;
}
