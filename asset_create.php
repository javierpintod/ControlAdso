<?php
$pageTitle = 'Registrar Nuevo Activo';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$error = '';
$success = '';

require_once __DIR__ . '/factories/AssetFactoryProducer.php';
require_once __DIR__ . '/src/repositories/AssetRepository.php';

$environments = [];
$categories = [];

if ($db) {
    $environments = $db->query("SELECT id, name FROM environments ORDER BY name ASC")->fetchAll();
    $categories = $db->query("SELECT id, name FROM product_categories ORDER BY name ASC")->fetchAll();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $placa = trim($_POST['placa'] ?? '');
    $serial = trim($_POST['serial'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $modelo = trim($_POST['modelo'] ?? '');
    $descripcionActual = trim($_POST['descripcion_actual'] ?? '');
    $categoryId = trim($_POST['category_id'] ?? '');
    $environmentId = trim($_POST['environment_id'] ?? '');
    $station = trim($_POST['station'] ?? 'Estación Principal');
    $responsible = trim($_POST['responsible_person'] ?? 'Prof. Carlos Mendoza');
    $valorIngreso = trim($_POST['valor_ingreso'] ?? '$0,00');
    $physicalStatus = $_POST['physical_status'] ?? 'operativo';

    if (empty($placa) || empty($descripcion) || empty($environmentId)) {
        $error = 'Por favor completa los campos obligatorios: Placa, Descripción y Ambiente.';
    } elseif (!$db) {
        $error = 'No hay conexión a la base de datos MySQL.';
    } else {
        try {
            // Obtener nombre del ambiente y categoría
            $envStmt = $db->prepare("SELECT name FROM environments WHERE id = ?");
            $envStmt->execute([$environmentId]);
            $envName = $envStmt->fetchColumn() ?: $environmentId;

            $catStmt = $db->prepare("SELECT name FROM product_categories WHERE id = ?");
            $catStmt->execute([$categoryId]);
            $catName = $catStmt->fetchColumn() ?: 'General';

            // =========================================================================
            // APLICACIÓN DEL PATRÓN FÁBRICA ABSTRACTA (Abstract Factory Pattern)
            // =========================================================================
            // 1. El productor resuelve la fábrica concreta según la categoría seleccionada
            $factory = AssetFactoryProducer::getFactory($categoryId);

            // 2. La fábrica concreta valida y construye el producto (ComputeAsset, InfrastructureAsset, etc.)
            $asset = $factory->createAsset([
                'placa' => $placa,
                'serial' => $serial,
                'descripcion' => $descripcion,
                'modelo' => $modelo,
                'descripcion_actual' => !empty($descripcionActual) ? $descripcionActual : $descripcion,
                'category_id' => $categoryId,
                'category_name' => $catName,
                'environment_id' => $environmentId,
                'environment_name' => $envName,
                'station' => $station,
                'physical_status' => $physicalStatus,
                'responsible_person' => $responsible,
                'valor_ingreso' => $valorIngreso
            ]);

            $assetRepository = new AssetRepository($db);
            $assetRepository->create($asset, $descripcion, $modelo, $valorIngreso);

            $assetId = $asset->getId();

            $assetRepository->logHistoryCreation($asset, $factory->getFamilyName(), $currentUser['name']);

            header("Location: asset_detail.php?id=" . urlencode($assetId) . "&msg=created");
            exit;
        } catch (Exception $e) {
            $error = 'Error en Fábrica Abstracta al registrar el activo: ' . $e->getMessage();
        }
    }
}
?>

<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="plus-circle" class="w-6 h-6 text-emerald-400"></i>
                <span>Registrar Activo Institucional SENA</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">Incorporación patrimonial con asignación a ambiente y código de barras</p>
        </div>
        <a href="assets.php" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
            &larr; Volver al inventario
        </a>
    </div>

    <!-- Indicador de Patrón de Diseño: Fábrica Abstracta -->
    <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-500/30 shadow-lg">
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Patrón GoF: Fábrica Abstracta
                </span>
                <span class="text-xs font-semibold text-slate-200">Motor de Creación Polimórfica de Activos</span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono">AssetFactoryProducer</span>
        </div>
        <p class="text-[11px] text-slate-400 mb-3">
            El sistema selecciona dinámicamente la fábrica especializada según la familia del activo, calculando garantías, ciclos de mantenimiento y atributos institucionales del SENA sin acoplamiento a clases concretas.
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <p class="font-bold text-emerald-400">ITEquipmentFactory</p>
                <p class="text-slate-400">Laptops, CPUs y AIOs</p>
                <span class="text-[9px] text-emerald-500 font-semibold">Garantía: 3 años</span>
            </div>
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <p class="font-bold text-cyan-400">InfrastructureFactory</p>
                <p class="text-slate-400">Aires y Racks HVAC</p>
                <span class="text-[9px] text-cyan-500 font-semibold">Garantía: 5 años</span>
            </div>
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <p class="font-bold text-purple-400">RoboticsFactory</p>
                <p class="text-slate-400">Robótica, VR e IoT</p>
                <span class="text-[9px] text-purple-500 font-semibold">Garantía: 2 años</span>
            </div>
            <div class="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <p class="font-bold text-amber-400">FurnitureFactory</p>
                <p class="text-slate-400">Mobiliario y Enseres</p>
                <span class="text-[9px] text-amber-500 font-semibold">Garantía: 1 año</span>
            </div>
        </div>
    </div>

    <?php if (!empty($error)): ?>
        <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-rose-400"></i>
            <span><?= htmlspecialchars($error) ?></span>
        </div>
    <?php endif; ?>

    <form method="POST" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <!-- Bloque 1: Identificación SENA -->
        <div>
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800">
                1. Datos de Identificación Institucional
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Número de Placa SENA *</label>
                    <input type="text" name="placa" placeholder="Ej: 95271025501" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Serial de Fábrica (S/N)</label>
                    <input type="text" name="serial" placeholder="Ej: 5CD0037S7T" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Valor de Ingreso (COP)</label>
                    <input type="text" name="valor_ingreso" placeholder="Ej: $2.500.000,00" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono">
                </div>
            </div>
        </div>

        <!-- Bloque 2: Características Técnicas -->
        <div>
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800">
                2. Especificaciones del Elemento
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Descripción / Tipo de Elemento *</label>
                    <input type="text" name="descripcion" placeholder="Ej: COMPUTADOR PORTATIL, CPU, AIRE ACONDICIONADO" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Modelo Comercial</label>
                    <input type="text" name="modelo" placeholder="Ej: PROBOOK 445R G6, OPTIPLEX 7470" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-slate-300 mb-1">Descripción Técnica Detallada</label>
                    <textarea name="descripcion_actual" rows="3" placeholder="PROCESADOR AMD RYZEN 7, DISCO DURO 512 GB SSD, MEMORIA RAM 16 GB, PANTALLA 14 PULGADAS..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"></textarea>
                </div>
            </div>
        </div>

        <!-- Bloque 3: Ubicación y Custodia -->
        <div>
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800">
                3. Ubicación, Categoría & Estado Físico
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Ambiente de Aprendizaje *</label>
                    <select name="environment_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <option value="">Seleccionar ambiente...</option>
                        <?php foreach ($environments as $env): ?>
                            <option value="<?= htmlspecialchars($env['id']) ?>"><?= htmlspecialchars($env['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Categoría Patrimonial</label>
                    <select name="category_id" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <option value="">Seleccionar categoría...</option>
                        <?php foreach ($categories as $cat): ?>
                            <option value="<?= htmlspecialchars($cat['id']) ?>"><?= htmlspecialchars($cat['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Estación / Puesto Físico</label>
                    <input type="text" name="station" placeholder="Ej: Estación de Cómputo #05" value="Estación #01" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Estado Físico Inicial</label>
                    <select name="physical_status" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <option value="operativo" selected>Operativo en Uso</option>
                        <option value="mesa_servicio">Mesa de Servicio (Requiere Revisión)</option>
                        <option value="mantenimiento">Mantenimiento Preventivo</option>
                        <option value="con_dano">Con Daño Físico / Depósito</option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-slate-300 mb-1">Instructor / Custodio Responsable</label>
                    <input type="text" name="responsible_person" value="Prof. Carlos Mendoza" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>
            </div>
        </div>

        <div class="pt-6 border-t border-slate-800 flex items-center justify-end space-x-3">
            <a href="assets.php" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition">
                Cancelar
            </a>
            <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950 flex items-center space-x-2">
                <i data-lucide="save" class="w-4 h-4"></i>
                <span>Guardar y Generar Código QR</span>
            </button>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
