<?php
$pageTitle = 'Sesión de Auditoría In Situ';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$sessionId = trim($_GET['id'] ?? '');

$session = null;
$items = [];

if ($db && !empty($sessionId)) {
    // Actualizar estado de un ítem
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_item'])) {
        $itemId = trim($_POST['item_id'] ?? '');
        $status = $_POST['status'] ?? 'pending';
        $note = trim($_POST['discrepancy_note'] ?? '');

        $uStmt = $db->prepare("UPDATE audit_items SET status = ?, discrepancy_note = ?, verified_at = ?, verified_by = ? WHERE id = ?");
        $uStmt->execute([
            $status, 
            $note, 
            date('h:i A'), 
            $currentUser['name'], 
            $itemId
        ]);

        // Recalcular conteos de la sesión
        $db->query("UPDATE audit_sessions SET 
            verified_count = (SELECT COUNT(*) FROM audit_items WHERE session_id = '{$sessionId}' AND status = 'verified'),
            pending_count = (SELECT COUNT(*) FROM audit_items WHERE session_id = '{$sessionId}' AND status = 'pending'),
            mismatch_count = (SELECT COUNT(*) FROM audit_items WHERE session_id = '{$sessionId}' AND status = 'mismatch')
            WHERE id = '{$sessionId}'");
    }

    $stmt = $db->prepare("SELECT * FROM audit_sessions WHERE id = ? LIMIT 1");
    $stmt->execute([$sessionId]);
    $session = $stmt->fetch();

    if ($session) {
        $iStmt = $db->prepare("SELECT * FROM audit_items WHERE session_id = ? ORDER BY station ASC, name ASC");
        $iStmt->execute([$sessionId]);
        $items = $iStmt->fetchAll();
    }
}

if (!$session) {
    echo '<div class="p-12 text-center text-slate-400"><p class="text-white font-bold">Sesión de auditoría no encontrada.</p><a href="audits.php" class="text-emerald-400 text-xs">Volver</a></div>';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

$total = $session['total_items'] ?: 1;
$pct = round(($session['verified_count'] / $total) * 100);
?>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
            <a href="audits.php" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </a>
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Toma Física In Situ</span>
                <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight"><?= htmlspecialchars($session['environment_name']) ?></h1>
                <p class="text-xs text-slate-400"><?= htmlspecialchars($session['building']) ?> • Auditor: <?= htmlspecialchars($session['auditor_name']) ?></p>
            </div>
        </div>

        <!-- Tarjeta de Progreso -->
        <div class="flex items-center space-x-4 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
            <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold block">Progreso de Cotejo</span>
                <span class="text-white font-black text-sm"><?= $session['verified_count'] ?> / <?= $session['total_items'] ?> (<?= $pct ?>%)</span>
            </div>
            <div class="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: <?= $pct ?>%"></div>
            </div>
        </div>
    </div>

    <!-- Lista de Cotejo -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Lista de Bienes a Cotejar</span>
            <span class="font-mono"><?= count($items) ?> Elementos en ambiente</span>
        </div>

        <div class="divide-y divide-slate-800">
            <?php foreach ($items as $it): 
                $statusColor = match($it['status']) {
                    'verified' => 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
                    'mismatch' => 'border-rose-500/40 bg-rose-950/20 text-rose-300',
                    default => 'border-slate-800 bg-slate-950/40 text-slate-300'
                };
            ?>
                <div class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 <?= $statusColor ?> transition">
                    <div class="space-y-1">
                        <div class="flex items-center space-x-2">
                            <span class="font-mono font-bold text-white text-xs">PLACA: <?= htmlspecialchars($it['asset_code']) ?></span>
                            <span class="text-[10px] text-slate-400 font-mono">S/N: <?= htmlspecialchars($it['serial_number']) ?></span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"><?= htmlspecialchars($it['station']) ?></span>
                        </div>
                        <h4 class="text-xs font-semibold text-white"><?= htmlspecialchars($it['name']) ?></h4>
                        <?php if (!empty($it['discrepancy_note'])): ?>
                            <p class="text-[11px] text-rose-300 bg-rose-950/50 px-2 py-1 rounded border border-rose-800">
                                Discrepancia: <?= htmlspecialchars($it['discrepancy_note']) ?>
                            </p>
                        <?php endif; ?>
                    </div>

                    <!-- Botones de Cotejo Rápido -->
                    <form method="POST" class="flex items-center space-x-2 shrink-0">
                        <input type="hidden" name="update_item" value="1">
                        <input type="hidden" name="item_id" value="<?= htmlspecialchars($it['id']) ?>">

                        <button type="submit" name="status" value="verified" class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 <?= $it['status'] === 'verified' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-emerald-600/30 text-emerald-400' ?>">
                            <i data-lucide="check" class="w-3.5 h-3.5"></i>
                            <span>Presente</span>
                        </button>

                        <button type="submit" name="status" value="mismatch" onclick="let note = prompt('Describe la discrepancia o motivo:', '<?= htmlspecialchars($it['discrepancy_note'] ?: '') ?>'); if (note !== null) { this.form.discrepancy_note.value = note; return true; } return false;" class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 <?= $it['status'] === 'mismatch' ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-rose-600/30 text-rose-400' ?>">
                            <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                            <span>Discrepancia</span>
                        </button>

                        <input type="hidden" name="discrepancy_note" value="<?= htmlspecialchars($it['discrepancy_note'] ?: '') ?>">
                    </form>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
