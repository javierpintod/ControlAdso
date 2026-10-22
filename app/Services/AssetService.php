<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\Asset;
use App\Repositories\Contracts\AssetRepositoryInterface;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use AssetFactoryProducer;
use InvalidArgumentException;

require_once __DIR__ . '/../../factories/AssetFactoryProducer.php';

/**
 * Class AssetService
 * Capa de Lógica de Negocio y Dominio para Activos.
 * Aplica SOLID SRP, DIP e integra el patrón Fábrica Abstracta.
 */
class AssetService
{
    private AssetRepositoryInterface $assetRepository;
    private EnvironmentRepositoryInterface $environmentRepository;

    public function __construct(
        AssetRepositoryInterface $assetRepository,
        EnvironmentRepositoryInterface $environmentRepository
    ) {
        $this->assetRepository = $assetRepository;
        $this->environmentRepository = $environmentRepository;
    }

    /**
     * Obtiene el listado de activos con filtros aplicados
     *
     * @return Asset[]
     */
    public function getAssets(?string $search = null, ?string $categoryId = null, ?string $environmentId = null, ?string $status = null): array
    {
        return $this->assetRepository->getAll($search, $categoryId, $environmentId, $status);
    }

    public function getAssetById(string $id): ?Asset
    {
        return $this->assetRepository->findById($id);
    }

    /**
     * Crea un nuevo activo utilizando la Fábrica Abstracta correspondiente
     */
    public function createAssetWithFactory(array $data, array $currentUser): Asset
    {
        $placa = trim($data['placa'] ?? '');
        $descripcion = trim($data['descripcion'] ?? '');
        $categoryId = trim($data['category_id'] ?? '');
        $environmentId = trim($data['environment_id'] ?? '');

        if (empty($placa) || empty($descripcion) || empty($environmentId)) {
            throw new InvalidArgumentException("Los campos Placa, Descripción y Ambiente son obligatorios.");
        }

        // Obtener nombres de ambiente y categoría
        $env = $this->environmentRepository->findEnvironmentById($environmentId);
        $cat = $this->environmentRepository->findCategoryById($categoryId);

        $envName = $env['name'] ?? $environmentId;
        $catName = $cat['name'] ?? 'General';

        // 1. Invocar la Fábrica Abstracta correspondiente
        $factory = AssetFactoryProducer::getFactory($categoryId);

        // 2. Construir producto polimórfico especializado (ComputeAsset, InfrastructureAsset, etc.)
        $assetProduct = $factory->createAsset([
            'placa' => $placa,
            'serial' => $data['serial'] ?? '',
            'descripcion' => $descripcion,
            'modelo' => $data['modelo'] ?? 'N/A',
            'descripcion_actual' => !empty($data['descripcion_actual']) ? $data['descripcion_actual'] : $descripcion,
            'category_id' => $categoryId,
            'category_name' => $catName,
            'environment_id' => $environmentId,
            'environment_name' => $envName,
            'station' => $data['station'] ?? 'Estación Principal',
            'physical_status' => $data['physical_status'] ?? 'operativo',
            'responsible_person' => $data['responsible_person'] ?? 'Responsable Institucional',
            'valor_ingreso' => $data['valor_ingreso'] ?? '$0,00'
        ]);

        // 3. Mapear a la entidad del Modelo MVC
        $asset = new Asset($assetProduct->toArray());

        // 4. Persistir mediante el repositorio
        $this->assetRepository->save($asset);

        // 5. Registrar en la bitácora histórica
        $this->assetRepository->addHistory([
            'asset_id' => $asset->id,
            'title' => 'Alta de Activo en Inventario SENA (' . $factory->getFamilyName() . ')',
            'description' => "Ingreso patrimonial procesado por " . get_class($factory) . " bajo el módulo INVE con placa {$placa} en {$envName}. Garantía hasta {$asset->warrantyUntil}.",
            'author' => $currentUser['name'] ?? 'Administrador',
            'event_type' => 'INVENTORY_IN'
        ]);

        return $asset;
    }

    public function updateAsset(string $id, array $data, array $currentUser): bool
    {
        $asset = $this->assetRepository->findById($id);
        if (!$asset) {
            throw new InvalidArgumentException("El activo con ID {$id} no fue encontrado.");
        }

        $asset->name = trim($data['name'] ?? $asset->name);
        $asset->modelo = trim($data['modelo'] ?? $asset->modelo);
        $asset->descripcion = trim($data['descripcion'] ?? $asset->descripcion);
        $asset->descripcionActual = trim($data['descripcion_actual'] ?? $asset->descripcionActual);
        $asset->description = $asset->descripcionActual;
        $asset->station = trim($data['station'] ?? $asset->station);
        $asset->physicalStatus = trim($data['physical_status'] ?? $asset->physicalStatus);
        $asset->responsiblePerson = trim($data['responsible_person'] ?? $asset->responsiblePerson);
        $asset->valorIngreso = trim($data['valor_ingreso'] ?? $asset->valorIngreso);

        if (!empty($data['environment_id'])) {
            $asset->environmentId = $data['environment_id'];
            $env = $this->environmentRepository->findEnvironmentById($asset->environmentId);
            $asset->environmentName = $env['name'] ?? $asset->environmentId;
        }

        if (!empty($data['category_id'])) {
            $asset->categoryId = $data['category_id'];
            $cat = $this->environmentRepository->findCategoryById($asset->categoryId);
            $asset->categoryName = $cat['name'] ?? $asset->categoryId;
        }

        $updated = $this->assetRepository->update($asset);

        if ($updated) {
            $this->assetRepository->addHistory([
                'asset_id' => $asset->id,
                'title' => 'Actualización de Ficha Técnica',
                'description' => "Modificación de datos generales y estado ({$asset->physicalStatus}) por {$currentUser['name']}.",
                'author' => $currentUser['name'] ?? 'Administrador',
                'event_type' => 'UPDATE'
            ]);
        }

        return $updated;
    }

    public function deleteAsset(string $id, array $currentUser): bool
    {
        $asset = $this->assetRepository->findById($id);
        if (!$asset) {
            return false;
        }

        return $this->assetRepository->delete($id);
    }

    public function getAssetHistory(string $assetId): array
    {
        return $this->assetRepository->getHistory($assetId);
    }

    public function getDashboardMetrics(): array
    {
        $total = $this->assetRepository->count();
        $operativos = $this->assetRepository->countByStatus('operativo');
        $mesa = $this->assetRepository->countByStatus('mesa_servicio');
        $dano = $this->assetRepository->countByStatus('con_dano');
        $mantenimiento = $this->assetRepository->countByStatus('mantenimiento');

        $operationalRate = $total > 0 ? round(($operativos / $total) * 100, 1) : 0;

        return [
            'total' => $total,
            'operativos' => $operativos,
            'mesa' => $mesa,
            'dano' => $dano,
            'mantenimiento' => $mantenimiento,
            'operational_rate' => $operationalRate
        ];
    }
}
