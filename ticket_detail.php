<?php
$pageTitle = 'Detalle de Caso Técnico';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$ticketId = trim($_GET['id'] ?? '');

$ticket = null;
$steps = [];
$notes = [];
$error = '';
$msg = '';

if ($db && !empty($ticketId)) {
    // Si se envió una nueva nota técnica
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['new_note'])) {
        $content = trim($_POST['content'] ?? '');
        if (!empty($content)) {
            $nStmt = $db->prepare("INSERT INTO ticket_notes (id, ticket_id, author, author_initials, content, time_ago) VALUES (?, ?, ?, ?, ?, ?)");
            $initials = strtoupper(substr($currentUser['name'], 0, 2));
            $nStmt->execute([uniqid('note-'), $ticketId, $currentUser['name'], $initials, $content, 'Justo ahora']);
            $msg = 'Nota técnica añadida.';
        }
    }

    // Si se cambió el estado del ticket
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_status'])) {
        $newStatus = $_POST['new_status'] ?? '';
        $statusLabel = match($newStatus) {
            'taller_diagnostico' => 'En Taller / Diagnóstico',
            'en_reparacion' => 'En Reparación Activa',
            'espera_repuesto' => 'En Espera de Repuesto',
            'resuelto' => 'Resuelto / Cerrado',
            default => 'Garantía con Proveedor'
        };

        $uStmt = $db->prepare("UPDATE service_desk_tickets SET status = ?, status_label = ? WHERE id = ?");
        $uStmt->execute([$newStatus, $statusLabel, $ticketId]);

        // Si se resolvió, devolver activo a operativo
        if ($newStatus === 'resuelto') {
            $tStmt = $db->prepare("SELECT asset_id FROM service_desk_tickets WHERE id = ?");
            $tStmt->execute([$ticketId]);
            $aid = $tStmt->fetchColumn();
            if ($aid) {
                $db->prepare("UPDATE assets SET physical_status = 'operativo', status_label = 'Operativo en Uso' WHERE id = ?")->execute([$aid]);
                $db->prepare("INSERT INTO asset_history (id, asset_id, title, date_str, time_str, description, author, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                   ->execute([uniqid('hist-'), $aid, 'Caso de Soporte Resuelto', date('d/m/Y'), date('h:i A'), 'El activo completó su ciclo de reparación y vuelve a estar operativo.', $currentUser['name'], 'REPAIR_COMPLETED']);
            }
        }
        $msg = 'Estado del caso actualizado.';
    }

    // Cargar datos
    $stmt = $db->prepare("SELECT * FROM service_desk_tickets WHERE id = ? OR ticket_number = ? LIMIT 1");
    $stmt->execute([$ticketId, $ticketId]);
    $ticket = $stmt->fetch();

    if ($ticket) {
        $ticketId = $ticket['id'];
        $steps = $db->prepare("SELECT * FROM ticket_timeline_steps WHERE ticket_id = ? ORDER BY step_number ASC");
        $steps->execute([$ticketId]);
        $steps = $steps->fetchAll();

        $notes = $db->prepare("SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at DESC");
        $notes->execute([$ticketId]);
        $notes = $notes->fetchAll();
    }
}

if (!$ticket) {
    echo '<div class="p-12 text-center text-slate-400"><p class="text-white font-bold">Ticket no encontrado.</p><a href="servicedesk.php" class="text-amber-400 text-xs">Volver</a></div>';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}
?>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
            <a href="servicedesk.php" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </a>
            <div>
                <span class="text-xs font-bold font-mono text-amber-400"><?= htmlspecialchars($ticket['ticket_number']) ?></span>
                <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight"><?= htmlspecialchars($ticket['title']) ?></h1>
            </div>
        </div>

        <!-- Selector de Estado del Ticket -->
        <form method="POST" class="flex items-center space-x-2">
            <input type="hidden" name="change_status" value="1">
            <select name="new_status" class="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                <option value="taller_diagnostico" <?= $ticket['status'] === 'taller_diagnostico' ? 'selected' : '' ?>>En Taller / Diagnóstico</option>
                <option value="en_reparacion" <?= $ticket['status'] === 'en_reparacion' ? 'selected' : '' ?>>En Reparación Activa</option>
                <option value="espera_repuesto" <?= $ticket['status'] === 'espera_repuesto' ? 'selected' : '' ?>>En Espera de Repuesto</option>
                <option value="garantia_externa" <?= $ticket['status'] === 'garantia_externa' ? 'selected' : '' ?>>Garantía Externa</option>
                <option value="resuelto" <?= $ticket['status'] === 'resuelto' ? 'selected' : '' ?>>Resuelto / Cerrado</option>
            </select>
            <button type="submit" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition">
                Actualizar Estado
            </button>
        </form>
    </div>

    <?php if (!empty($msg)): ?>
        <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
            <?= htmlspecialchars($msg) ?>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Ficha del Ticket y Síntoma -->
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Datos del Activo & Caso</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <?= htmlspecialchars($ticket['status_label']) ?>
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <span class="text-slate-500 block text-[10px]">Elemento</span>
                        <span class="text-white font-bold text-sm"><?= htmlspecialchars($ticket['asset_name']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[10px]">Placa SENA / Serial</span>
                        <span class="font-mono text-slate-200"><?= htmlspecialchars($ticket['asset_code']) ?> • <?= htmlspecialchars($ticket['serial_number']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[10px]">Ambiente de Origen</span>
                        <span class="text-slate-300 font-medium"><?= htmlspecialchars($ticket['origin_environment']) ?></span>
                    </div>
                    <div>
                        <span class="text-slate-500 block text-[10px]">Custodia Actual</span>
                        <span class="text-slate-300 font-medium"><?= htmlspecialchars($ticket['current_custody_location']) ?></span>
                    </div>
                </div>

                <div>
                    <span class="text-slate-500 block text-[10px] uppercase font-bold mb-1">Falla Reportada</span>
                    <p class="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                        <?= htmlspecialchars($ticket['declared_symptom']) ?>
                    </p>
                </div>

                <?php if (!empty($ticket['diagnostic_notes'])): ?>
                    <div>
                        <span class="text-slate-500 block text-[10px] uppercase font-bold mb-1">Notas del Diagnóstico</span>
                        <p class="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                            <?= htmlspecialchars($ticket['diagnostic_notes']) ?>
                        </p>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Bitácora de Notas Técnicas -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Bitácora & Avances Técnicos</h3>

                <form method="POST" class="space-y-3">
                    <input type="hidden" name="new_note" value="1">
                    <textarea name="content" rows="2" placeholder="Agregar nota técnica, repuestos cotizados o avance..." required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"></textarea>
                    <div class="flex justify-end">
                        <button type="submit" class="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition">
                            Publicar Nota
                        </button>
                    </div>
                </form>

                <div class="divide-y divide-slate-800 pt-2">
                    <?php if (!empty($notes)): ?>
                        <?php foreach ($notes as $n): ?>
                            <div class="py-3 space-y-1">
                                <div class="flex items-center justify-between text-xs">
                                    <span class="font-bold text-white"><?= htmlspecialchars($n['author']) ?></span>
                                    <span class="text-[10px] text-slate-500 font-mono"><?= htmlspecialchars($n['time_ago'] ?: $n['created_at']) ?></span>
                                </div>
                                <p class="text-xs text-slate-300 leading-relaxed"><?= htmlspecialchars($n['content']) ?></p>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p class="text-xs text-slate-500 py-3">No hay notas registradas para este ticket.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- SLA y Pasos del Flujo -->
        <div class="space-y-6">
            <!-- Indicador SLA -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl space-y-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Acuerdo de Nivel de Servicio (SLA)</span>
                <div class="text-4xl font-black text-amber-400 font-mono"><?= $ticket['sla_hours_left'] ?>h</div>
                <span class="text-[11px] text-slate-400 block">Tiempo restante de un total de <?= $ticket['total_sla_hours'] ?> horas</span>
                <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <?php $pct = min(100, round(($ticket['sla_hours_left'] / ($ticket['total_sla_hours'] ?: 48)) * 100)); ?>
                    <div class="bg-amber-400 h-2 rounded-full" style="width: <?= $pct ?>%"></div>
                </div>
            </div>

            <!-- Pasos del Flujo -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Flujo de Mantenimiento</span>
                <div class="space-y-3">
                    <?php if (!empty($steps)): ?>
                        <?php foreach ($steps as $s): ?>
                            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs">
                                <div class="w-5 h-5 rounded-full <?= $s['status'] === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : ($s['status'] === 'current' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500') ?> flex items-center justify-center shrink-0 mt-0.5">
                                    <i data-lucide="<?= $s['status'] === 'completed' ? 'check' : 'clock' ?>" class="w-3 h-3"></i>
                                </div>
                                <div>
                                    <span class="font-bold text-white block"><?= htmlspecialchars($s['title']) ?></span>
                                    <span class="text-[10px] text-slate-400 block"><?= htmlspecialchars($s['time_label']) ?> • <?= htmlspecialchars($s['assigned_to']) ?></span>
                                    <?php if (!empty($s['note'])): ?>
                                        <p class="text-[11px] text-slate-300 mt-1"><?= htmlspecialchars($s['note']) ?></p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                            Recepción inicial completada.
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
