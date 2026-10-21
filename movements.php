<?php
$pageTitle = 'Movimientos y Actas de Custodia';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$movements = [];

if ($db) {
    try {
        $movements = $db->query("SELECT * FROM inventory_movements ORDER BY created_at DESC")->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="arrow-left-right" class="w-6 h-6 text-emerald-400"></i>
                <span>Movimientos & Actas de Custodia Digital</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
                Trazabilidad inmutable de traslados con firma criptográfica SHA-256 según normatividad SENA.
            </p>
        </div>
        <a href="movement_create.php" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-emerald-950">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Registrar Traslado de Activo</span>
        </a>
    </div>

    <!-- Tabla de Movimientos -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="py-3.5 px-4">Folio Oficial</th>
                        <th class="py-3.5 px-4">Activo / Elemento</th>
                        <th class="py-3.5 px-4">Ruta (Origen &rarr; Destino)</th>
                        <th class="py-3.5 px-4">Responsable</th>
                        <th class="py-3.5 px-4">Fecha & Hora</th>
                        <th class="py-3.5 px-4">Firma SHA-256</th>
                        <th class="py-3.5 px-4 text-right">Acta</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-xs text-slate-300">
                    <?php if (!empty($movements)): ?>
                        <?php foreach ($movements as $mov): ?>
                            <tr class="hover:bg-slate-800/50 transition">
                                <td class="py-3.5 px-4 font-mono font-bold text-white">
                                    <div class="flex items-center space-x-1.5">
                                        <i data-lucide="file-check-2" class="w-4 h-4 text-emerald-400"></i>
                                        <span><?= htmlspecialchars($mov['folio']) ?></span>
                                    </div>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="font-bold text-white block truncate max-w-xs"><?= htmlspecialchars($mov['product_name']) ?></span>
                                    <span class="text-[10px] text-slate-400 font-mono block">Placa: <?= htmlspecialchars($mov['asset_code'] ?: 'N/A') ?></span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <div class="space-y-0.5">
                                        <span class="text-[11px] text-slate-400 block truncate max-w-xs">De: <?= htmlspecialchars($mov['origin_environment_name'] ?: 'Almacén Central') ?></span>
                                        <span class="text-[11px] text-emerald-400 font-semibold block truncate max-w-xs">&rarr; A: <?= htmlspecialchars($mov['destination_environment_name']) ?></span>
                                    </div>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="text-slate-200 font-medium block"><?= htmlspecialchars($mov['user_name']) ?></span>
                                    <span class="text-[10px] text-slate-400 block"><?= htmlspecialchars($mov['user_role']) ?></span>
                                </td>
                                <td class="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                                    <?= htmlspecialchars($mov['timestamp_str']) ?>
                                </td>
                                <td class="py-3.5 px-4 font-mono text-[10px]">
                                    <span class="bg-purple-950/60 border border-purple-800/60 text-purple-300 px-2 py-1 rounded inline-block truncate max-w-[120px]" title="<?= htmlspecialchars($mov['crypto_hash']) ?>">
                                        <?= substr($mov['crypto_hash'], 0, 8) ?>...<?= substr($mov['crypto_hash'], -8) ?>
                                    </span>
                                </td>
                                <td class="py-3.5 px-4 text-right">
                                    <a href="movement_acta.php?id=<?= urlencode($mov['id']) ?>" class="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600/20 text-slate-200 hover:text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition">
                                        <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                                        <span>Ver Acta</span>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="7" class="py-12 text-center text-slate-400">
                                <i data-lucide="arrow-left-right" class="w-8 h-8 mx-auto text-slate-600 mb-2"></i>
                                <p class="text-sm font-semibold text-slate-300">No hay movimientos registrados</p>
                                <p class="text-xs text-slate-500 mt-1">Registra el primer traslado de custodia entre ambientes.</p>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
