<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\AssetService;
use App\Services\MovementService;
use App\Services\ServiceDeskService;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;

/**
 * Class DashboardController
 * Controlador principal del Dashboard de ControlAdso (SRP).
 */
class DashboardController extends Controller
{
    private AssetService $assetService;
    private MovementService $movementService;
    private ServiceDeskService $serviceDeskService;
    private EnvironmentRepositoryInterface $environmentRepository;

    public function __construct(
        AssetService $assetService,
        MovementService $movementService,
        ServiceDeskService $serviceDeskService,
        EnvironmentRepositoryInterface $environmentRepository
    ) {
        parent::__construct();
        $this->assetService = $assetService;
        $this->movementService = $movementService;
        $this->serviceDeskService = $serviceDeskService;
        $this->environmentRepository = $environmentRepository;
    }

    public function index(Request $request): Response
    {
        $this->requireAuth();

        $metrics = $this->assetService->getDashboardMetrics();
        $environments = $this->environmentRepository->getAllEnvironments();
        $categories = $this->environmentRepository->getAllCategories();
        $recentMovements = array_slice($this->movementService->getAllMovements(), 0, 5);
        $recentTickets = array_slice($this->serviceDeskService->getAllTickets(), 0, 5);

        return $this->render('dashboard/index', [
            'pageTitle' => 'Dashboard Institucional | ControlAdso SENA',
            'metrics' => $metrics,
            'environments' => $environments,
            'categories' => $categories,
            'recentMovements' => $recentMovements,
            'recentTickets' => $recentTickets
        ]);
    }
}
