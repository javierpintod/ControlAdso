<?php
declare(strict_types=1);

/**
 * Interface AssetInterface
 * Contrato base para todos los activos/elementos almacenables en el sistema.
 * Parte de la implementación del Patrón de Diseño FÁBRICA ABSTRACTA (Abstract Factory).
 */
interface AssetInterface
{
    public function getId(): string;
    public function getSerialNumber(): string;
    public function getAssetCode(): string;
    public function getName(): string;
    public function getDescription(): string;
    public function getCategoryId(): string;
    public function getCategoryName(): string;
    public function getEnvironmentId(): string;
    public function getEnvironmentName(): string;
    public function getStation(): string;
    public function getPhysicalStatus(): string;
    public function getStatusLabel(): string;
    public function getResponsiblePerson(): string;
    public function getAssignedDate(): string;
    public function getWarrantyUntil(): string;
    public function getBarcode(): string;
    public function getQrToken(): string;
    public function getRegional(): string;
    public function getCentroCosto(): string;
    public function getModulo(): string;
    public function getModelo(): string;
    public function getConsecutivo(): string;
    public function getDescripcion(): string;
    public function getDescripcionActual(): string;
    public function getTipo(): string;
    public function getPlaca(): string;
    public function getSerial(): string;
    public function getFechaAdquisicion(): string;
    public function getValorIngreso(): string;

    /**
     * Devuelve el nombre de la familia a la que pertenece el producto
     */
    public function getFamily(): string;

    /**
     * Devuelve especificaciones técnicas y atributos particulares de su familia
     */
    public function getTechnicalSpecs(): array;

    /**
     * Exporta los datos en formato de arreglo listo para inserción en base de datos
     */
    public function toArray(): array;
}
