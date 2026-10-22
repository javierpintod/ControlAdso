<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\AssetService;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use Exception;

/**
 * Class AssetController
 * Controlador para la gestión y ciclo de vida de los activos SENA (SRP).
 */
class AssetController extends Controller
{
    private AssetService $assetService;
    private EnvironmentRepositoryInterface $environmentRepository;

    public function __construct(
        AssetService $assetService,
        EnvironmentRepositoryInterface $environmentRepository
    ) {
        parent::__construct();
        $this->assetService = $assetService;
        $this->environmentRepository = $environmentRepository;
    }

    public function index(Request $request): Response
    {
        $this->requireAuth();

        $search = $request->get('search');
        $category = $request->get('category');
        $environment = $request->get('environment');
        $status = $request->get('status');

        $assets = $this->assetService->getAssets($search, $category, $environment, $status);
        $categories = $this->environmentRepository->getAllCategories();
        $environments = $this->environmentRepository->getAllEnvironments();

        return $this->render('assets/index', [
            'pageTitle' => 'Catálogo Maestro de Activos | ControlAdso',
            'assets' => $assets,
            'categories' => $categories,
            'environments' => $environments,
            'search' => $search,
            'currentCategory' => $category,
            'currentEnvironment' => $environment,
            'currentStatus' => $status
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $this->requireAuth();
        $error = '';

        if ($request->isPost()) {
            try {
                $asset = $this->assetService->createAssetWithFactory($request->all(), $user);
                return $this->redirect("asset_detail.php?id=" . urlencode($asset->id) . "&msg=created");
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $environments = $this->environmentRepository->getAllEnvironments();
        $categories = $this->environmentRepository->getAllCategories();

        return $this->render('assets/create', [
            'pageTitle' => 'Registrar Activo Institucional SENA | ControlAdso',
            'environments' => $environments,
            'categories' => $categories,
            'error' => $error
        ]);
    }

    public function detail(Request $request): Response
    {
        $this->requireAuth();
        $id = $request->get('id', '');

        $asset = $this->assetService->getAssetById($id);
        if (!$asset) {
            return $this->redirect('assets.php?error=not_found');
        }

        $history = $this->assetService->getAssetHistory($asset->id);

        return $this->render('assets/detail', [
            'pageTitle' => "Hoja de Vida: {$asset->name} | ControlAdso",
            'asset' => $asset,
            'history' => $history,
            'msg' => $request->get('msg')
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = $this->requireAuth();
        $id = $request->get('id', '');

        $asset = $this->assetService->getAssetById($id);
        if (!$asset) {
            return $this->redirect('assets.php?error=not_found');
        }

        $error = '';
        if ($request->isPost()) {
            try {
                $this->assetService->updateAsset($id, $request->all(), $user);
                return $this->redirect("asset_detail.php?id=" . urlencode($id) . "&msg=updated");
            } catch (Exception $e) {
                $error = $e->getMessage();
            }
        }

        $environments = $this->environmentRepository->getAllEnvironments();
        $categories = $this->environmentRepository->getAllCategories();

        return $this->render('assets/edit', [
            'pageTitle' => "Editar Activo: {$asset->name} | ControlAdso",
            'asset' => $asset,
            'environments' => $environments,
            'categories' => $categories,
            'error' => $error
        ]);
    }

    public function delete(Request $request): Response
    {
        $user = $this->requireAuth();
        $id = $request->get('id', '');

        if ($request->isPost() && !empty($id)) {
            $this->assetService->deleteAsset($id, $user);
            return $this->redirect('assets.php?msg=deleted');
        }

        return $this->redirect('assets.php');
    }
}
