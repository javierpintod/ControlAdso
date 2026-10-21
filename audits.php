<?php
$pageTitle = 'Auditorías Físicas In Situ';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$sessions = [];
$environments = [];

if ($db) {
    try {
        $sessions = $db->query("SELECT * FROM audit_sessions ORDER BY created_at DESC")->fetchAll();
        $environments = $db->query("SELECT id, name FROM environments ORDER BY name ASC")->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

// Iniciar nueva sesión de auditoría
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['new_audit'])) {
    $envId = trim($_POST['environment_id'] ?? '');
    if (!empty($envId) && $db) {
        try {
            $eStmt = $db->prepare("SELECT name, building FROM environments WHERE id = ?");
            $eStmt->execute([$envId]);
            $env = $eStmt->fetch();

            $sessionId = 'audit-sena-' . uniqid();
            $assets = $db->prepare("SELECT * FROM assets WHERE environment_id = ?");
            $assets->execute([$envId]);
            $assetList = $assets->fetchAll();

            $total = count($assetList);

            $insStmt = $db->prepare("INSERT INTO audit_sessions (id, is_active, environment_id, environment_name, building, total_items, verified_count, pending_count, mismatch_count, started_at, auditor_name) VALUES (?, 1, ?, ?, ?, ?, 0, ?, 0, ?, ?)");
            $insStmt->execute([
                $sessionId, $envId, $env['name'], $env['building'], $total, $total, date('Y-m-d H:i A'), $currentUser['name']
            ]);

            // Crear items de cotejo
            $itemStmt = $db->prepare("INSERT INTO audit_items (id, session_id, asset_id, serial_number, asset_code, name, station, sheet_number, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'HOJA-01', 'General', 'pending')");
            foreach ($assetList as $a) {
                $itemStmt->execute([
                    uniqid('item-'), $sessionId, $a['id'], $a['serial_number'], $a['placa'], $a['name'], $a['station']
                ]);
            }

            header("Location: audit_session.php?id=" . urlencode($sessionId));
            exit;
        } catch (Exception $e) {
            $error = $e->getMessage();
        }
    }
}
?>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="clipboard-check" class="w-6 h-6 text-emerald-400"></i>
                <span>Auditoría Física In Situ & Cotejo de Bienes</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
                Toma física por ambientes de formación con verificación de activos presentes vs faltantes.
            </p>
        </div>
    </div>

    <!-- Lanzar Nueva Auditoría -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800">
            Iniciar Nueva Sesión de Toma Física
        </h2>
        <form method="POST" class="flex flex-col md:flex-row items-center gap-4">
            <input type="hidden" name="new_audit" value="1">
            <div class="flex-1 w-full">
                <select name="environment_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Seleccionar ambiente para auditar...</option>
                    <?php foreach ($environments as $env): ?>
                        <option value="<?= htmlspecialchars($env['id']) ?>"><?= htmlspecialchars($env['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <button type="submit" class="w-full md:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 shrink-0">
                <i data-lucide="play" class="w-4 h-4"></i>
                <span>Comenzar Auditoría In Situ</span>
            </button>
        </form>
    </div>

    <!-- Historial de Auditorías -->
    <div class="space-y-4">
        <h2 class="text-sm font-bold text-white">Sesiones de Auditoría Registradas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <?php if (!empty($sessions)): ?>
                <?php foreach ($sessions as $s): 
                    $total = $s['total_items'] ?: 1;
                    $pct = round(($s['verified_count'] / $total) * 100);
                ?>
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-4 shadow-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-white"><?= htmlspecialchars($s['environment_name']) ?></h3>
                                <p class="text-xs text-slate-400"><?= htmlspecialchars($s['building']) ?> • Auditor: <?= htmlspecialchars($s['auditor_name']) ?></p>
                            </div>
                            <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <?= $pct ?>% Cotejado
                            </span>
                        </div>

                        <div class="grid grid-cols-3 gap-2 text-center text-xs">
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <span class="text-emerald-400 font-bold text-base block"><?= $s['verified_count'] ?></span>
                                <span class="text-[10px] text-slate-400">Verificados</span>
                            </div>
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <span class="text-amber-400 font-bold text-base block"><?= $s['pending_count'] ?></span>
                                <span class="text-[10px] text-slate-400">Pendientes</span>
                            </div>
                            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <span class="text-rose-400 font-bold text-base block"><?= $s['mismatch_count'] ?></span>
                                <span class="text-[10px] text-slate-400">Discrepancias</span>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <span class="text-[10px] text-slate-500 font-mono"><?= htmlspecialchars($s['started_at']) ?></span>
                            <a href="audit_session.php?id=<?= urlencode($s['id']) ?>" class="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5">
                                <span>Continuar Cotejo</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-span-2 p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                    No hay sesiones de auditoría previas. Selecciona un ambiente arriba para comenzar.
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
