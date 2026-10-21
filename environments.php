<?php
$pageTitle = 'Ambientes y Sedes de Aprendizaje';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$environments = [];
$campuses = [];

if ($db) {
    try {
        $campuses = $db->query("SELECT * FROM campuses ORDER BY name ASC")->fetchAll();
        $environments = $db->query("
            SELECT e.*, 
            (SELECT COUNT(*) FROM assets a WHERE a.environment_id = e.id) as current_assets
            FROM environments e 
            ORDER BY e.name ASC
        ")->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <div>
        <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <i data-lucide="building-2" class="w-6 h-6 text-emerald-400"></i>
            <span>Sedes & Ambientes de Formación</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
            Infraestructura física del SENA, laboratorios de desarrollo y control de aforo por ambiente.
        </p>
    </div>

    <!-- Grid de Ambientes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($environments as $env): 
            $curr = $env['current_assets'] ?? $env['assigned_count'];
            $cap = $env['total_capacity'] ?: 35;
            $pct = min(100, round(($curr / $cap) * 100));
        ?>
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                            <i data-lucide="<?= htmlspecialchars($env['icon'] ?: 'monitor') ?>" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <?= $pct ?>% Aforo
                        </span>
                    </div>

                    <h3 class="text-base font-bold text-white"><?= htmlspecialchars($env['name']) ?></h3>
                    <p class="text-xs text-slate-400 mt-0.5"><?= htmlspecialchars($env['building']) ?> • <?= htmlspecialchars($env['floor']) ?></p>

                    <div class="mt-4 pt-4 border-t border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-slate-400">Equipos Asignados:</span>
                            <span class="font-bold text-white"><?= $curr ?> / <?= $cap ?></span>
                        </div>
                        <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full" style="width: <?= $pct ?>%"></div>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <a href="assets.php?env=<?= urlencode($env['id']) ?>" class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center space-x-1">
                        <span>Ver Activos (<?= $curr ?>)</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </a>
                    <a href="audits.php" class="text-xs text-slate-400 hover:text-white transition">
                        Auditar &rarr;
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
