<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\ServiceDeskService;
use App\Services\AssetService;
use Exception;

/**
 * Class ServiceDeskController
 * Controlador para la Mesa de Ayuda Técnica y Gestión de Casos con SLA (SRP).
 */
class ServiceDeskController extends Controller
{
    private ServiceDeskService $serviceDeskService;
    private AssetService $assetService;

    public function __construct(
        ServiceDeskService $serviceDeskService,
        AssetService $assetService
    ) {
        parent::__construct();
        $this->serviceDeskService = $serviceDeskService;
        $this->assetService = $assetService;
    }

    public function index(Request $request): Response
    {
        $this->requireAuth();
        $tickets = $this->serviceDeskService->getAllTickets();

        return $this->render('servicedesk/index', [
            'pageTitle' => 'Mesa de Servicio Técnico (Service Desk) | ControlAdso',
            'tickets' => $tickets,
            'msg' => $request->get('msg')
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $this->requireAuth();
        $error = '';

        if ($request->isPost()) {
            try {
                $ticket = $this->serviceDeskService->createTicket($request->all(), $user);
                return $this->redirect("ticket_detail.php?id=" . urlencode($ticket['id']) . "&msg=created");
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $assets = $this->assetService->getAssets();

        return $this->render('servicedesk/create', [
            'pageTitle' => 'Apertura de Ticket Técnico | ControlAdso',
            'assets' => $assets,
            'selectedAssetId' => $request->get('asset_id'),
            'error' => $error
        ]);
    }

    public function detail(Request $request): Response
    {
        $this->requireAuth();
        $id = $request->get('id', '');

        $ticket = $this->serviceDeskService->getTicketDetails($id);
        if (!$ticket) {
            return $this->redirect('servicedesk.php?error=not_found');
        }

        return $this->render('servicedesk/detail', [
            'pageTitle' => "Detalle de Caso: {$ticket['folio']} | ControlAdso",
            'ticket' => $ticket,
            'msg' => $request->get('msg')
        ]);
    }

    public function addNote(Request $request): Response
    {
        $user = $this->requireAuth();
        $ticketId = $request->post('ticket_id');
        $content = $request->post('content');

        if (!empty($ticketId) && !empty($content)) {
            $this->serviceDeskService->addNote($ticketId, $content, $user);
            return $this->redirect("ticket_detail.php?id=" . urlencode($ticketId) . "&msg=note_added");
        }

        return $this->redirect("ticket_detail.php?id=" . urlencode($ticketId ?? ''));
    }
}
