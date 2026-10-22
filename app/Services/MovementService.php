<?php
declare(strict_types=1);

namespace App\Services;

use App\Repositories\Contracts\MovementRepositoryInterface;
use App\Repositories\Contracts\AssetRepositoryInterface;
use App\Repositories\Contracts\EnvironmentRepositoryInterface;
use InvalidArgumentException;

/**
 * Class MovementService
 * Lógica de negocio para traslados y actas digitales con criptografía SHA-256 (SRP).
 */
class MovementService
{
    private MovementRepositoryInterface $movementRepository;
    private AssetRepositoryInterface $assetRepository;
    private EnvironmentRepositoryInterface $environmentRepository;

    public function __construct(
        MovementRepositoryInterface $movementRepository,
        AssetRepositoryInterface $assetRepository,
        EnvironmentRepositoryInterface $environmentRepository
    ) {
        $this->movementRepository = $movementRepository;
        $this->assetRepository = $assetRepository;
        $this->environmentRepository = $environmentRepository;
    }

    public function getAllMovements(): array
    {
        return $this->movementRepository->getAll();
    }

    public function getMovementById(string $id): ?array
    {
        return $this->movementRepository->findById($id);
    }

    public function createTransfer(array $data, array $currentUser): array
    {
        $assetId = trim($data['asset_id'] ?? '');
        $destinationEnvId = trim($data['destination_environment_id'] ?? '');
        $notes = trim($data['notes'] ?? 'Traslado regular entre ambientes de formación');

        if (empty($assetId) || empty($destinationEnvId)) {
            throw new InvalidArgumentException("Debe seleccionar el activo y el ambiente destino.");
        }

        $asset = $this->assetRepository->findById($assetId);
        if (!$asset) {
            throw new InvalidArgumentException("El activo seleccionado no existe.");
        }

        $destEnv = $this->environmentRepository->findEnvironmentById($destinationEnvId);
        if (!$destEnv) {
            throw new InvalidArgumentException("El ambiente destino no es válido.");
        }

        $originEnvId = $asset->environmentId;
        $originEnvName = $asset->environmentName;
        $destinationEnvName = $destEnv['name'];

        $movementId = 'mov-' . uniqid();
        $folio = 'MOV-SENA-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5));
        $timestampStr = date('Y-m-d H:i:s');

        // Generar Hash Criptográfico SHA-256 inmutable para el Acta
        $rawStringToSign = "FOLIO:{$folio}|ASSET:{$asset->assetCode}|SERIAL:{$asset->serialNumber}|ORIGIN:{$originEnvId}|DEST:{$destinationEnvId}|DATE:{$timestampStr}|SIGNER:{$currentUser['email']}";
        $cryptoHash = hash('sha256', $rawStringToSign);
        $qrToken = 'qr_verif_' . substr($cryptoHash, 0, 16);

        $movementData = [
            'id' => $movementId,
            'folio' => $folio,
            'type' => 'TRANSFER',
            'product_name' => $asset->name,
            'asset_id' => $asset->id,
            'asset_code' => $asset->assetCode,
            'serial_number' => $asset->serialNumber,
            'origin_environment_id' => $originEnvId,
            'origin_environment_name' => $originEnvName,
            'destination_environment_id' => $destinationEnvId,
            'destination_environment_name' => $destinationEnvName,
            'quantity' => 1,
            'notes' => $notes,
            'user_id' => $currentUser['id'] ?? 'usr-admin',
            'user_name' => $currentUser['name'] ?? 'Administrador',
            'user_role' => $currentUser['role_title'] ?? 'Administrador',
            'user_email' => $currentUser['email'] ?? 'admin@edustock.edu',
            'timestamp_str' => $timestampStr,
            'crypto_hash' => $cryptoHash,
            'qr_verification_token' => $qrToken,
            'status' => 'COMPLETADO'
        ];

        // 1. Persistir movimiento
        $this->movementRepository->create($movementData);

        // 2. Actualizar ubicación del activo
        $asset->environmentId = $destinationEnvId;
        $asset->environmentName = $destinationEnvName;
        $this->assetRepository->update($asset);

        // 3. Registrar en historial del activo
        $this->assetRepository->addHistory([
            'asset_id' => $asset->id,
            'title' => 'Traslado de Custodia - Folio ' . $folio,
            'description' => "Traslado desde {$originEnvName} hacia {$destinationEnvName}. Firma SHA-256: " . substr($cryptoHash, 0, 16) . "...",
            'author' => $currentUser['name'] ?? 'Administrador',
            'event_type' => 'TRANSFER'
        ]);

        return $movementData;
    }
}
