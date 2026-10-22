<?php
declare(strict_types=1);

namespace App\Repositories;

use App\Repositories\Contracts\TicketRepositoryInterface;
use PDO;

/**
 * Class MySqlTicketRepository
 * Repositorio de mesa de ayuda y tickets de servicio (SRP & ISP).
 */
class MySqlTicketRepository implements TicketRepositoryInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function getAll(): array
    {
        return $this->db->query("SELECT * FROM service_desk_tickets ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM service_desk_tickets WHERE id = ? OR folio = ? LIMIT 1");
        $stmt->execute([$id, $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(array $data): bool
    {
        $sql = "INSERT INTO service_desk_tickets (
            id, ticket_number, folio, title, asset_id, asset_name, asset_code, serial_number,
            priority, priority_label, status, status_label, sla_hours_left, total_sla_hours,
            origin_environment_id, origin_environment, environment_name, current_custody_location,
            received_by, reporter_name, reporter_date, declared_symptom, diagnostic_notes,
            repair_cost_estimate, technician_name, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, NOW()
        )";

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $data['id'], $data['ticket_number'], $data['folio'], $data['title'],
            $data['asset_id'], $data['asset_name'], $data['asset_code'], $data['serial_number'],
            $data['priority'], $data['priority_label'], $data['status'], $data['status_label'],
            $data['sla_hours_left'], $data['total_sla_hours'],
            $data['origin_environment_id'], $data['origin_environment'], $data['environment_name'],
            $data['current_custody_location'], $data['received_by'], $data['reporter_name'],
            $data['reporter_date'], $data['declared_symptom'], $data['diagnostic_notes'] ?? '',
            $data['repair_cost_estimate'] ?? '$0 COP', $data['technician_name']
        ]);
    }

    public function updateStatus(string $id, string $status, string $statusLabel): bool
    {
        $stmt = $this->db->prepare("UPDATE service_desk_tickets SET status = ?, status_label = ? WHERE id = ?");
        return $stmt->execute([$status, $statusLabel, $id]);
    }

    public function getNotes(string $ticketId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at DESC");
        $stmt->execute([$ticketId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addNote(array $data): bool
    {
        $stmt = $this->db->prepare("INSERT INTO ticket_notes (id, ticket_id, author, author_initials, content, time_ago) VALUES (?, ?, ?, ?, ?, ?)");
        return $stmt->execute([
            $data['id'] ?? uniqid('note-'),
            $data['ticket_id'],
            $data['author'],
            $data['author_initials'] ?? 'TE',
            $data['content'],
            $data['time_ago'] ?? 'Justo ahora'
        ]);
    }

    public function getTimeline(string $ticketId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM ticket_timeline_steps WHERE ticket_id = ? ORDER BY step_number ASC");
        $stmt->execute([$ticketId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
