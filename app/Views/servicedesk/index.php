<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="wrench" class="w-6 h-6 text-amber-400"></i>
                <span>Mesa de Ayuda & Soporte Técnico (SLA - MVC)</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
                Gestión técnica de fallas, tiempos de respuesta acordados y hoja de ruta de mantenimiento.
            </p>
        </div>
        <a href="ticket_create.php" class="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-amber-950">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Reportar Falla / Nuevo Ticket</span>
        </a>
    </div>

    <!-- Grid / Lista de Tickets -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <?php if (!empty($tickets)): ?>
            <?php foreach ($tickets as $tk):
                $priorityClass = match($tk['priority']) {
                    'critica' => 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                    'alta' => 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    'media' => 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    default => 'bg-slate-700/50 text-slate-300 border-slate-600'
                };
            ?>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-4 shadow-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="font-mono text-xs font-black text-white"><?= htmlspecialchars($tk['ticket_number']) ?></span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold border <?= $priorityClass ?>">
                                <?= htmlspecialchars($tk['priority_label']) ?>
                            </span>
                        </div>
                        <span class="text-xs font-bold text-amber-400 font-mono"><?= $tk['sla_hours_left'] ?>h restantes</span>
                    </div>

                    <div>
                        <h3 class="text-xs font-bold text-white"><?= htmlspecialchars($tk['title']) ?></h3>
                        <p class="text-[11px] text-slate-400 mt-1 line-clamp-2"><?= htmlspecialchars($tk['declared_symptom']) ?></p>
                    </div>

                    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] flex items-center justify-between">
                        <div>
                            <span class="text-slate-500 block text-[10px]">Elemento en Revisión</span>
                            <span class="font-semibold text-slate-200"><?= htmlspecialchars($tk['asset_name']) ?></span>
                        </div>
                        <div class="text-right">
                            <span class="text-slate-500 block text-[10px]">Ubicación</span>
                            <span class="text-slate-300"><?= htmlspecialchars($tk['current_custody_location']) ?></span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span class="text-[11px] text-slate-500">Técnico: <?= htmlspecialchars($tk['technician_name']) ?></span>
                        <a href="ticket_detail.php?id=<?= urlencode($tk['id']) ?>" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition">
                            Gestionar Caso &rarr;
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-span-2 py-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
                <i data-lucide="check-circle" class="w-8 h-8 mx-auto text-emerald-400 mb-2"></i>
                <p class="text-sm font-semibold text-slate-200">No hay tickets activos en este momento</p>
                <p class="text-xs text-slate-500 mt-1">Todos los equipos están operativos y disponibles.</p>
            </div>
        <?php endif; ?>
    </div>
</div>
