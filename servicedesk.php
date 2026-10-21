<?php
$pageTitle = 'Mesa de Ayuda Técnica';
require_once __DIR__ . '/includes/header.php';

$db = getDB();

$statusFilter = trim($_GET['status'] ?? '');
$priorityFilter = trim($_GET['priority'] ?? '');

$tickets = [];

if ($db) {
    try {
        $sql = "SELECT * FROM service_desk_tickets WHERE 1=1";
        $params = [];

        if (!empty($statusFilter)) {
            $sql .= " AND status = ?";
            $params[] = $statusFilter;
        }

        if (!empty($priorityFilter)) {
            $sql .= " AND priority = ?";
            $params[] = $priorityFilter;
        }

        $sql .= " ORDER BY created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $tickets = $stmt->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="wrench" class="w-6 h-6 text-amber-400"></i>
                <span>Mesa de Ayuda & Soporte Técnico (SLA)</span>
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

    <!-- Filtros de Tickets -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <form method="GET" class="flex flex-wrap items-center gap-3">
            <select name="status" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                <option value="">Todos los Estados</option>
                <option value="taller_diagnostico" <?= $statusFilter === 'taller_diagnostico' ? 'selected' : '' ?>>En Taller / Diagnóstico</option>
                <option value="en_reparacion" <?= $statusFilter === 'en_reparacion' ? 'selected' : '' ?>>En Reparación Activa</option>
                <option value="espera_repuesto" <?= $statusFilter === 'espera_repuesto' ? 'selected' : '' ?>>En Espera de Repuesto</option>
                <option value="garantia_externa" <?= $statusFilter === 'garantia_externa' ? 'selected' : '' ?>>Garantía con Proveedor</option>
                <option value="resuelto" <?= $statusFilter === 'resuelto' ? 'selected' : '' ?>>Resuelto / Cerrado</option>
            </select>

            <select name="priority" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                <option value="">Todas las Prioridades</option>
                <option value="critica" <?= $priorityFilter === 'critica' ? 'selected' : '' ?>>Crítica (P1)</option>
                <option value="alta" <?= $priorityFilter === 'alta' ? 'selected' : '' ?>>Alta (P2)</option>
                <option value="media" <?= $priorityFilter === 'media' ? 'selected' : '' ?>>Media (P3)</option>
                <option value="baja" <?= $priorityFilter === 'baja' ? 'selected' : '' ?>>Baja (P4)</option>
            </select>

            <button type="submit" class="py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5">
                <i data-lucide="filter" class="w-3.5 h-3.5"></i>
                <span>Aplicar</span>
            </button>
            <?php if (!empty($statusFilter) || !empty($priorityFilter)): ?>
                <a href="servicedesk.php" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </a>
            <?php endif; ?>
        </form>
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
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border <?= $priorityClass ?>">
                                <?= htmlspecialchars($tk['priority_label']) ?>
                            </span>
                        </div>
                        <span class="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1">
                            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                            <span><?= $tk['sla_hours_left'] ?>h SLA restante</span>
                        </span>
                    </div>

                    <div>
                        <h3 class="text-sm font-bold text-white"><?= htmlspecialchars($tk['asset_name']) ?></h3>
                        <p class="text-xs text-slate-400 font-mono mt-0.5">Placa: <?= htmlspecialchars($tk['asset_code']) ?> • S/N: <?= htmlspecialchars($tk['serial_number']) ?></p>
                        <p class="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mt-2 leading-relaxed">
                            <?= htmlspecialchars($tk['declared_symptom']) ?>
                        </p>
                    </div>

                    <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                            <span class="text-slate-500 block text-[10px]">Técnico Asignado</span>
                            <span class="text-slate-200 font-medium"><?= htmlspecialchars($tk['technician_name'] ?: 'Sin asignar') ?></span>
                        </div>
                        <a href="ticket_detail.php?id=<?= urlencode($tk['id']) ?>" class="px-3 py-1.5 bg-slate-800 hover:bg-amber-600/20 text-slate-200 hover:text-amber-400 border border-slate-700 rounded-lg font-semibold transition flex items-center space-x-1.5">
                            <span>Gestionar Caso</span>
                            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <i data-lucide="check-circle-2" class="w-10 h-10 mx-auto text-emerald-400 mb-2"></i>
                <h3 class="text-sm font-bold text-white">No hay tickets pendientes con estos filtros</h3>
                <p class="text-xs text-slate-500 mt-1">Todos los equipos están operativos o los casos fueron resueltos.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
