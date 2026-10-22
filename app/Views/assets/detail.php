<?php
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode("SENA_PLACA:" . $asset->placa . "|SERIAL:" . $asset->serialNumber);
?>

<div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div class="flex items-center space-x-3">
            <a href="assets.php" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </a>
            <div>
                <span class="text-xs font-bold font-mono text-emerald-400">PLACA: <?= htmlspecialchars($asset->placa) ?></span>
                <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight"><?= htmlspecialchars($asset->name) ?></h1>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition shadow">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Imprimir Ficha & Rótulo</span>
            </button>
            <a href="movement_create.php?asset_id=<?= urlencode($asset->id) ?>" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow">
                <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                <span>Trasladar</span>
            </a>
            <a href="ticket_create.php?asset_id=<?= urlencode($asset->id) ?>" class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow">
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
                        <?= htmlspecialchars($asset->statusLabel) ?>
                    </span>
                </h2>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                    <div>
                        <span class="text-slate-500 block text-[11px]">Placa de Inventario</span>
                        <span class="font-mono font-bold text-white text-sm"><?= htmlspecialchars($asset->placa) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Serial Fabricante</span>
                        <span class="font-mono font-semibold text-slate-200"><?= htmlspecialchars($asset->serialNumber) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Tipo de Elemento</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset->tipo) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Regional / Centro Costo</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset->regional) ?> / <?= htmlspecialchars($asset->centroCosto) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Módulo / Consecutivo</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset->modulo) ?> - <?= htmlspecialchars($asset->consecutivo) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[11px]">Valor de Ingreso</span>
                        <span class="font-mono text-emerald-400 font-bold"><?= htmlspecialchars($asset->valorIngreso ?: '$0,00') ?></span>
                    </div>
                    <div class="col-span-2 md:col-span-3">
                        <span class="text-slate-500 block text-[11px]">Ubicación Física Actual</span>
                        <span class="text-slate-200 font-semibold"><?= htmlspecialchars($asset->environmentName) ?></span>
                        <span class="text-slate-400 ml-2">(<?= htmlspecialchars($asset->station) ?>)</span>
                    </div>
                    <div class="col-span-2 md:col-span-3">
                        <span class="text-slate-500 block text-[11px]">Custodio / Responsable</span>
                        <span class="text-slate-200 font-medium"><?= htmlspecialchars($asset->responsiblePerson) ?></span>
                    </div>
                    <div class="col-span-2 md:col-span-3">
                        <span class="text-slate-500 block text-[11px]">Descripción Patrimonial Completa</span>
                        <p class="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed mt-1">
                            <?= htmlspecialchars($asset->descripcionActual ?: $asset->description) ?>
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
                    <span class="text-[10px] text-slate-500"><?= count($history ?? []) ?> registro(s)</span>
                </h2>

                <div class="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    <?php if (!empty($history)): ?>
                        <?php foreach ($history as $event): ?>
                            <div class="relative">
                                <div class="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-emerald-500"></div>
                                <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="font-bold text-white"><?= htmlspecialchars($event['title']) ?></span>
                                        <span class="font-mono text-[10px] text-slate-400"><?= htmlspecialchars($event['date_str']) ?> <?= htmlspecialchars($event['time_str']) ?></span>
                                    </div>
                                    <p class="text-xs text-slate-300 mt-1"><?= htmlspecialchars($event['description']) ?></p>
                                    <span class="text-[10px] text-slate-500 mt-2 block">Registrado por: <?= htmlspecialchars($event['author']) ?></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-xs text-slate-500">No hay eventos registrados en la hoja de vida de este activo.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Columna Derecha: Rótulo de Identificación Patrimonial QR -->
        <div class="space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center sticky top-6">
                <div class="border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 bg-slate-950/80">
                    <div class="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                        <i data-lucide="shield" class="w-4 h-4"></i>
                        <span>SENA • Patrimonio</span>
                    </div>

                    <img src="<?= htmlspecialchars($qrUrl) ?>" alt="Código QR SENA" class="w-40 h-40 mx-auto rounded-xl p-2 bg-white shadow-md my-4">

                    <p class="font-mono text-lg font-black text-white tracking-widest"><?= htmlspecialchars($asset->placa) ?></p>
                    <p class="text-[11px] text-slate-400 mt-1"><?= htmlspecialchars($asset->name) ?></p>

                    <div class="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                        <p>Centro de Servicios y Gestión Empresarial</p>
                        <p class="font-mono text-[9px] text-slate-400">REGIONAL 41 • MÓDULO INVE</p>
                    </div>
                </div>

                <div class="mt-6 flex flex-col space-y-2 no-print">
                    <a href="asset_edit.php?id=<?= urlencode($asset->id) ?>" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                        <span>Modificar Datos</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
