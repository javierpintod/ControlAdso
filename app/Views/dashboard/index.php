<!-- Banner Institucional SENA -->
<div class="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-900/60 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-xl">
    <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <i data-lucide="shield-check" class="w-64 h-64 text-emerald-400"></i>
    </div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
            <div class="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>SENA • Centro de Servicios y Gestión Empresarial</span>
                <span>•</span>
                <span>Regional Antioquia</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                ControlAdso — Gestión de Activos & Ambientes (MVC)
            </h1>
            <p class="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
                Arquitectura Modelo-Vista-Controlador con principios SOLID, inyección de dependencias IoC, persistencia desacoplada y Fábrica Abstracta.
            </p>
        </div>
        <div class="flex items-center space-x-3 shrink-0">
            <a href="scanner.php" class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center space-x-2 transition shadow">
                <i data-lucide="scan" class="w-4 h-4 text-emerald-400"></i>
                <span>Escanear Activo</span>
            </a>
            <a href="movement_create.php" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-emerald-950">
                <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                <span>Nuevo Traslado</span>
            </a>
        </div>
    </div>
</div>

<!-- Grid de Indicadores Clave (KPIs) -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <!-- Total Activos -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400">Total Activos</span>
            <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <i data-lucide="boxes" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
            <span class="text-2xl md:text-3xl font-black text-white"><?= $metrics['total'] ?? 0 ?></span>
            <span class="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Placas SENA</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">Inventario registrado en módulos</p>
    </div>

    <!-- Activos Operativos -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400">Operativos en Uso</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
            <span class="text-2xl md:text-3xl font-black text-emerald-400"><?= $metrics['operativos'] ?? 0 ?></span>
            <span class="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full"><?= $metrics['operational_rate'] ?? 0 ?>% OK</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">Disponibles en ambientes de formación</p>
    </div>

    <!-- Mesa de Servicio -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400">En Mesa de Servicio</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <i data-lucide="wrench" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
            <span class="text-2xl md:text-3xl font-black text-amber-400"><?= $metrics['mesa'] ?? 0 ?></span>
            <span class="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Diagnóstico</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">Mantenimiento y diagnóstico técnico</p>
    </div>

    <!-- Equipos con Daño -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400">Con Daño / Depósito</span>
            <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <i data-lucide="alert-octagon" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-4 flex items-baseline justify-between">
            <span class="text-2xl md:text-3xl font-black text-rose-400"><?= $metrics['dano'] ?? 0 ?></span>
            <span class="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">Almacén RAEE</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">Pendientes de baja o disposición</p>
    </div>
</div>

<!-- Sección Central: Ambientes y Actividad -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
    <!-- Ambientes de Aprendizaje -->
    <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-base font-bold text-white">Ambientes de Aprendizaje & Ocupación</h2>
                <p class="text-xs text-slate-400">Distribución de activos en sedes y laboratorios</p>
            </div>
            <a href="environments.php" class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center space-x-1">
                <span>Ver todos</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>

        <div class="space-y-4">
            <?php if (!empty($environments)): ?>
                <?php foreach ($environments as $env):
                    $curr = $env['assigned_count'] ?? 0;
                    $cap = $env['total_capacity'] ?: 35;
                    $pct = min(100, round(($curr / $cap) * 100));
                ?>
                    <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                                    <i data-lucide="<?= htmlspecialchars($env['icon'] ?: 'monitor') ?>" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h3 class="text-xs font-bold text-white"><?= htmlspecialchars($env['name']) ?></h3>
                                    <p class="text-[11px] text-slate-400"><?= htmlspecialchars($env['building']) ?> • <?= htmlspecialchars($env['floor']) ?></p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-extrabold text-white"><?= $curr ?></span>
                                <span class="text-[11px] text-slate-400">/ <?= $cap ?></span>
                                <span class="text-[10px] ml-2 px-1.5 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400"><?= $pct ?>%</span>
                            </div>
                        </div>
                        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full" style="width: <?= $pct ?>%"></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="text-center py-8 text-slate-400 text-xs">
                    <p>No se encontraron ambientes registrados.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Accesos Rápidos y Trazabilidad Cripto -->
    <div class="space-y-6">
        <!-- Tarjeta de Verificación Cripto -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <i data-lucide="fingerprint" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-xs font-bold text-white">Seguridad Criptográfica SHA-256</h3>
                    <p class="text-[11px] text-slate-400">Actas con firma digital inmutable</p>
                </div>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
                Cada movimiento y acta de custodia genera un hash SHA-256 de 64 caracteres calculado al vuelo, garantizando no repudio y conformidad con las normas de control de bienes SENA.
            </p>
            <div class="mt-4 pt-4 border-t border-slate-800">
                <a href="movements.php" class="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>Consultar Historial de Actas</span>
                </a>
            </div>
        </div>

        <!-- Acciones Directas -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-2 gap-3">
                <a href="asset_create.php" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition group">
                    <i data-lucide="plus-circle" class="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition"></i>
                    <p class="text-xs font-bold text-white">Nuevo Activo</p>
                    <p class="text-[10px] text-slate-400">Fábrica Abstracta</p>
                </a>
                <a href="ticket_create.php" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition group">
                    <i data-lucide="life-buoy" class="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition"></i>
                    <p class="text-xs font-bold text-white">Reportar Falla</p>
                    <p class="text-[10px] text-slate-400">Mesa de soporte</p>
                </a>
                <a href="audits.php" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-left transition group">
                    <i data-lucide="check-square" class="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition"></i>
                    <p class="text-xs font-bold text-white">Toma Física</p>
                    <p class="text-[10px] text-slate-400">Auditoría in situ</p>
                </a>
                <a href="reports.php" class="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 text-left transition group">
                    <i data-lucide="printer" class="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition"></i>
                    <p class="text-xs font-bold text-white">Imprimir Acta</p>
                    <p class="text-[10px] text-slate-400">Reporte oficial</p>
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Últimos Movimientos y Tickets -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Últimos Traslados -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h3 class="text-sm font-bold text-white">Últimos Traslados & Movimientos</h3>
                <p class="text-xs text-slate-400">Cadena de custodia registrada</p>
            </div>
            <a href="movements.php" class="text-xs font-semibold text-emerald-400 hover:underline">Ver todo</a>
        </div>
        <div class="divide-y divide-slate-800">
            <?php if (!empty($recentMovements)): ?>
                <?php foreach ($recentMovements as $mov): ?>
                    <div class="py-3 flex items-center justify-between">
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="font-mono text-[11px] font-bold text-white"><?= htmlspecialchars($mov['folio']) ?></span>
                                <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold"><?= htmlspecialchars($mov['type']) ?></span>
                            </div>
                            <p class="text-xs text-slate-300 font-medium mt-0.5"><?= htmlspecialchars($mov['product_name']) ?></p>
                            <p class="text-[11px] text-slate-400">
                                <?= htmlspecialchars($mov['origin_environment_name'] ?: 'Origen externo') ?> &rarr; <span class="text-emerald-400"><?= htmlspecialchars($mov['destination_environment_name']) ?></span>
                            </p>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] font-mono text-slate-400 block"><?= htmlspecialchars($mov['timestamp_str']) ?></span>
                            <a href="movement_acta.php?id=<?= urlencode($mov['id']) ?>" class="text-[11px] text-emerald-400 hover:underline mt-1 inline-block">Ver Acta &rarr;</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="py-4 text-xs text-slate-400 text-center">No hay traslados registrados.</p>
            <?php endif; ?>
        </div>
    </div>

    <!-- Casos Abiertos Mesa de Ayuda -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h3 class="text-sm font-bold text-white">Mesa de Ayuda Técnica (SLA)</h3>
                <p class="text-xs text-slate-400">Casos activos y tiempos de respuesta</p>
            </div>
            <a href="servicedesk.php" class="text-xs font-semibold text-amber-400 hover:underline">Ver todo</a>
        </div>
        <div class="divide-y divide-slate-800">
            <?php if (!empty($recentTickets)): ?>
                <?php foreach ($recentTickets as $tk):
                    $priorityColor = $tk['priority'] === 'critica' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                ?>
                    <div class="py-3 flex items-center justify-between">
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="font-mono text-[11px] font-bold text-white"><?= htmlspecialchars($tk['ticket_number']) ?></span>
                                <span class="text-[10px] px-1.5 py-0.5 rounded border font-semibold <?= $priorityColor ?>"><?= htmlspecialchars($tk['priority_label']) ?></span>
                            </div>
                            <p class="text-xs text-slate-300 font-medium mt-0.5"><?= htmlspecialchars($tk['asset_name']) ?></p>
                            <p class="text-[11px] text-slate-400 truncate max-w-xs"><?= htmlspecialchars($tk['declared_symptom']) ?></p>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-bold text-amber-400 block"><?= $tk['sla_hours_left'] ?>h restantes</span>
                            <a href="ticket_detail.php?id=<?= urlencode($tk['id']) ?>" class="text-[11px] text-slate-400 hover:text-white mt-1 inline-block">Gestionar &rarr;</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="py-4 text-xs text-slate-400 text-center">No hay tickets activos en este momento.</p>
            <?php endif; ?>
        </div>
    </div>
</div>
