<?php
$pageTitle = 'Hoja de Vida de Activo';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$assetId = trim($_GET['id'] ?? '');

if (empty($assetId) && !empty($_GET['placa'])) {
    $assetId = 'ast-sena-' . trim($_GET['placa']);
}

$asset = null;
$history = [];

if ($db && !empty($assetId)) {
    try {
        $stmt = $db->prepare("SELECT * FROM assets WHERE id = ? OR placa = ? OR asset_code = ? LIMIT 1");
        $stmt->execute([$assetId, $assetId, $assetId]);
        $asset = $stmt->fetch();

        if ($asset) {
            $histStmt = $db->prepare("SELECT * FROM asset_history WHERE asset_id = ? ORDER BY created_at DESC");
            $histStmt->execute([$asset['id']]);
            $history = $histStmt->fetchAll();
        }
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

if (!$asset) {
    echo '<div class="max-w-xl mx-auto text-center py-16 space-y-4">
        <div class="w-16 h-16 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <i data-lucide="alert-triangle" class="w-8 h-8 text-amber-400"></i>
        </div>
        <h2 class="text-xl font-bold text-white">Activo no encontrado</h2>
        <p class="text-xs text-slate-400">No se localizó ningún activo con el identificador proporcionado.</p>
        <a href="assets.php" class="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold">&larr; Volver al inventario</a>
    </div>';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode("SENA_PLACA:" . $asset['placa'] . "|SERIAL:" . $asset['serial_number']);
?>

<div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div class="flex items-center space-x-3">
            <a href="assets.php" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </a>
            <div>
                <span class="text-xs font-bold font-mono text-emerald-400">PLACA: <?= htmlspecialchars($asset['placa']) ?></span>
                <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight"><?= htmlspecialchars($asset['name']) ?></h1>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition shadow">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Imprimir Ficha & Rótulo</span>
            </button>
            <a href="movement_create.php?asset_id=<?= urlencode($asset['id']) ?>" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow">
                <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                <span>Trasladar</span>
            </a>
            <a href="ticket_create.php?asset_id=<?= urlencode($asset['id']) ?>" class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow">
                <i data-lucide="wrench" class="w-4 h-4"></i>
                <span>Reportar Falla</span>
            </a>
        </div>
    </div>

    <!-- Layout Grid: Ficha Técnica + Rótulo QR -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Columna Izquierda: Información Detallada -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Ficha Técnica -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800 flex items-center justify-between">
                    <span>Ficha Técnica Institucional (SENA Regional 41)</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <?= htmlspecialchars($asset['status_label']) ?>
                    </span>
                </h2>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                    <div>
                        <span class="text-slate-500 block text-[11px]">Placa de Inventario</span>
                        <span class="font-mono font-bold text-white text-sm"><?= htmlspecialchars($asset['placa']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Serial Fabricante</span>
                        <span class="font-mono font-semibold text-slate-200"><?= htmlspecialchars($asset['serial_number']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Tipo de Elemento</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset['tipo']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Regional / Centro Costo</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset['regional']) ?> / <?= htmlspecialchars($asset['centro_costo']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Módulo / Consecutivo</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset['modulo']) ?> - <?= htmlspecialchars($asset['consecutivo']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Valor de Ingreso</span>
                        <span class="font-mono text-emerald-400 font-bold"><?= htmlspecialchars($asset['valor_ingreso'] ?: '$0,00') ?></span>
                    </div>
                    <div class="col-span-2 md:col-span-3">
                        <span class="text-slate-500 block text-[11px]">Ubicación Física Actual</span>
                        <span class="text-slate-200 font-semibold"><?= htmlspecialchars($asset['environment_name']) ?></span>
                        <span class="text-slate-400 ml-2">(<?= htmlspecialchars($asset['station']) ?>)</span>
                    </div>
                    <div class="col-span-2 md:col-span-3">
                        <span class="text-slate-500 block text-[11px]">Custodio / Responsable</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset['responsible_person']) ?></span>
                    </div>
                    <div class="col-span-2 md:col-span-3">
                        <span class="text-slate-500 block text-[11px]">Descripción Patrimonial Completa</span>
                        <p class="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed mt-1">
                            <?= htmlspecialchars($asset['descripcion_actual'] ?: $asset['description']) ?>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Trazabilidad e Historial Cronológico (Hoja de Vida) -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center justify-between">
                    <span class="flex items-center space-x-2">
                        <i data-lucide="history" class="w-4 h-4 text-emerald-400"></i>
                        <span>Hoja de Vida & Eventos de Trazabilidad</span>
                    </span>
                    <span class="text-[10px] text-slate-500"><?= count($history) ?> registro(s)</span>
                </h2>

                <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    <?php if (!empty($history)): ?>
                        <?php foreach ($history as $h): ?>
                            <div class="relative group">
                                <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/20"></div>
                                <div class="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-xs font-bold text-white"><?= htmlspecialchars($h['title']) ?></h3>
                                        <span class="text-[10px] text-slate-400 font-mono"><?= htmlspecialchars($h['date_str']) ?> <?= htmlspecialchars($h['time_str']) ?></span>
                                    </div>
                                    <p class="text-xs text-slate-300 mt-1"><?= htmlspecialchars($h['description']) ?></p>
                                    <div class="mt-2 flex items-center space-x-2 text-[10px] text-slate-500">
                                        <span>Registrado por: <strong><?= htmlspecialchars($h['author']) ?></strong></span>
                                        <span>•</span>
                                        <span class="uppercase font-mono text-emerald-400/80"><?= htmlspecialchars($h['event_type']) ?></span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-xs text-slate-500">No hay eventos adicionales en la hoja de vida.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Columna Derecha: Rótulo de Identificación QR Imprimible -->
        <div class="space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Rótulo Patrimonial Oficial</h3>
                
                <!-- Etiqueta física simulada -->
                <div class="bg-white text-slate-900 p-5 rounded-xl border-2 border-slate-300 shadow-md inline-block w-full max-w-[280px]">
                    <div class="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3">
                        <div class="text-left">
                            <span class="font-black text-xs block leading-none">SENA</span>
                            <span class="text-[8px] text-slate-600 block">CONTROL DE BIENES</span>
                        </div>
                        <span class="text-[8px] font-mono font-bold bg-slate-200 px-1 py-0.5 rounded">REG. 41</span>
                    </div>

                    <div class="my-3 flex justify-center">
                        <img src="<?= $qrUrl ?>" alt="QR Activo" class="w-36 h-36 border border-slate-200 rounded p-1">
                    </div>

                    <div class="space-y-0.5">
                        <span class="text-[9px] text-slate-500 font-bold block uppercase">Placa de Inventario</span>
                        <span class="font-mono font-black text-base tracking-wider block text-slate-950"><?= htmlspecialchars($asset['placa']) ?></span>
                        <span class="text-[8px] text-slate-600 font-mono block truncate">S/N: <?= htmlspecialchars($asset['serial_number']) ?></span>
                    </div>

                    <div class="mt-3 pt-2 border-t border-dashed border-slate-300 text-[8px] text-slate-500">
                        EduStock • ControlAdso Asset Tag
                    </div>
                </div>

                <p class="text-[11px] text-slate-400 mt-4 leading-relaxed">
                    Este código QR puede escanearse con cualquier teléfono inteligente o lector óptico para acceder instantáneamente a la hoja de vida del equipo.
                </p>

                <div class="mt-4 pt-4 border-t border-slate-800 flex justify-center space-x-2">
                    <button onclick="window.print()" class="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition">
                        <i data-lucide="tag" class="w-4 h-4"></i>
                        <span>Imprimir Rótulo Adhesivo</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
