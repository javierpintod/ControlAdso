<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\MovementService;
use App\Services\AssetService;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use Exception;

/**
 * Class MovementController
 * Controlador para la gestión de traslados y actas de entrega digitales (SRP).
 */
class MovementController extends Controller
{
    private MovementService $movementService;
    private AssetService $assetService;
    private EnvironmentRepositoryInterface $environmentRepository;

    public function __construct(
        MovementService $movementService,
        AssetService $assetService,
        EnvironmentRepositoryInterface $environmentRepository
    ) {
        parent::__construct();
        $this->movementService = $movementService;
        $this->assetService = $assetService;
        $this->environmentRepository = $environmentRepository;
    }

    public function index(Request $request): Response
    {
        $this->requireAuth();
        $movements = $this->movementService->getAllMovements();

        return $this->render('movements/index', [
            'pageTitle' => 'Histórico de Traslados y Movimientos | ControlAdso',
            'movements' => $movements,
            'msg' => $request->get('msg')
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $this->requireAuth();
        $error = '';

        if ($request->isPost()) {
            try {
                $movement = $this->movementService->createTransfer($request->all(), $user);
                return $this->redirect("movement_acta.php?id=" . urlencode($movement['id']) . "&msg=created");
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $assets = $this->assetService->getAssets(null, null, null, 'operativo');
        $environments = $this->environmentRepository->getAllEnvironments();

        return $this->render('movements/create', [
            'pageTitle' => 'Nuevo Traslado de Activo entre Ambientes | ControlAdso',
            'assets' => $assets,
            'environments' => $environments,
            'selectedAssetId' => $request->get('asset_id'),
            'error' => $error
        ]);
    }

    public function acta(Request $request): Response
    {
        $this->requireAuth();
        $id = $request->get('id', '');

        $movement = $this->movementService->getMovementById($id);
        if (!$movement) {
            return $this->redirect('movements.php?error=not_found');
        }

        return $this->render('movements/acta', [
            'pageTitle' => "Acta de Custodia Digital Folio: {$movement['folio']} | SENA",
            'movement' => $movement
        ]);
    }
}
