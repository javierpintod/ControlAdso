<?php
declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\TicketRepositoryInterface;
use App\Repositories\Contracts\AssetRepositoryInterface;
use InvalidArgumentException;

/**
 * Class ServiceDeskService
 * Lógica de negocio para Mesa de Ayuda, cálculo de SLA y diagnósticos (SRP).
 */
class ServiceDeskService
{
    private TicketRepositoryInterface $ticketRepository;
    private AssetRepositoryInterface $assetRepository;

    public function __construct(
        TicketRepositoryInterface $ticketRepository,
        AssetRepositoryInterface $assetRepository
    ) {
        $this->ticketRepository = $ticketRepository;
        $this->assetRepository = $assetRepository;
    }

    public function getAllTickets(): array
    {
        return $this->ticketRepository->getAll();
    }

    public function getTicketById(string $id): ?array
    {
        return $this->ticketRepository->findById($id);
    }

    public function getTicketDetails(string $id): ?array
    {
        $ticket = $this->ticketRepository->findById($id);
        if (!$ticket) {
            return null;
        }

        $ticket['notes'] = $this->ticketRepository->getNotes($id);
        $ticket['timeline'] = $this->ticketRepository->getTimeline($id);
        $ticket['asset'] = $this->assetRepository->findById($ticket['asset_id']);

        return $ticket;
    }

    public function createTicket(array $data, array $currentUser): array
    {
        $assetId = trim($data['asset_id'] ?? '');
        $title = trim($data['title'] ?? '');
        $priority = trim($data['priority'] ?? 'media');
        $symptom = trim($data['declared_symptom'] ?? '');

        if (empty($assetId) || empty($title) || empty($symptom)) {
            throw new InvalidArgumentException("Debe completar los campos obligatorios: Activo, Título y Síntoma detectado.");
        }

        $asset = $this->assetRepository->findById($assetId);
        if (!$asset) {
            throw new InvalidArgumentException("El activo especificado no existe.");
        }

        $ticketId = 'tk-' . uniqid();
        $ticketNumber = 'TK-' . rand(1000, 9999) . '-' . substr($asset->placa, -4);
        $folio = 'TKT-SENA-' . date('Y') . '-' . strtoupper(substr(uniqid(), -4));

        [$priorityLabel, $slaHours] = match($priority) {
            'critica' => ['Crítica (P1)', 24],
            'alta' => ['Alta (P2)', 48],
            'media' => ['Media (P3)', 72],
            default => ['Baja (P4)', 120]
        };

        $ticketData = [
            'id' => $ticketId,
            'ticket_number' => $ticketNumber,
            'folio' => $folio,
            'title' => $title,
            'asset_id' => $asset->id,
            'asset_name' => $asset->name,
            'asset_code' => $asset->assetCode,
            'serial_number' => $asset->serialNumber,
            'priority' => $priority,
            'priority_label' => $priorityLabel,
            'status' => 'recibido',
            'status_label' => 'Recibido en Mesa',
            'sla_hours_left' => $slaHours,
            'total_sla_hours' => $slaHours,
            'origin_environment_id' => $asset->environmentId,
            'origin_environment' => $asset->environmentName,
            'environment_name' => $asset->station,
            'current_custody_location' => 'Mesa de Servicio Técnico — Banco #01',
            'received_by' => $currentUser['name'] ?? 'Técnico de Turno',
            'reporter_name' => trim($data['reporter_name'] ?? $currentUser['name']),
            'reporter_date' => date('Y-m-d H:i:s'),
            'declared_symptom' => $symptom,
            'diagnostic_notes' => trim($data['diagnostic_notes'] ?? 'En espera de revisión técnica inicial.'),
            'repair_cost_estimate' => trim($data['repair_cost_estimate'] ?? '$0 COP'),
            'technician_name' => $currentUser['name'] ?? 'Tec. Marcos Peña'
        ];

        // 1. Guardar ticket
        $this->ticketRepository->create($ticketData);

        // 2. Actualizar estado del activo a mesa de servicio
        $asset->physicalStatus = 'mesa_servicio';
        $asset->statusLabel = 'En Mesa de Ayuda / Diagnóstico';
        $this->assetRepository->update($asset);

        // 3. Registrar en historial del activo
        $this->assetRepository->addHistory([
            'asset_id' => $asset->id,
            'title' => "Apertura de Ticket {$folio}",
            'description' => "Remisión a mesa de ayuda técnica por: {$title}. Prioridad: {$priorityLabel}.",
            'author' => $currentUser['name'] ?? 'Técnico',
            'event_type' => 'SERVICE_DESK'
        ]);

        return $ticketData;
    }

    public function addNote(string $ticketId, string $content, array $currentUser): bool
    {
        $initials = 'TC';
        if (!empty($currentUser['name'])) {
            $parts = explode(' ', trim($currentUser['name']));
            $initials = strtoupper(substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
        }

        return $this->ticketRepository->addNote([
            'ticket_id' => $ticketId,
            'author' => $currentUser['name'] ?? 'Técnico',
            'author_initials' => $initials,
            'content' => trim($content),
            'time_ago' => 'Justo ahora'
        ]);
    }
}
