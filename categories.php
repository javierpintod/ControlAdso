<?php
$pageTitle = 'Familias y Categorías Patrimoniales';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$categories = [];

if ($db) {
    try {
        $categories = $db->query("
            SELECT c.*, 
            (SELECT COUNT(*) FROM assets a WHERE a.category_id = c.id) as current_total,
            (SELECT COUNT(*) FROM assets a WHERE a.category_id = c.id AND a.physical_status = 'operativo') as current_operativo
            FROM product_categories c 
            ORDER BY c.name ASC
        ")->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <div>
        <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <i data-lucide="tags" class="w-6 h-6 text-emerald-400"></i>
            <span>Familias & Categorías de Activos</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
            Clasificación patrimonial, operatividad y distribución de equipos según catálogo SENA.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($categories as $cat): 
            $total = $cat['current_total'] ?? $cat['total'];
            $operativo = $cat['current_operativo'] ?? $total;
            $rate = $total > 0 ? round(($operativo / $total) * 100, 1) : 100;
        ?>
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <?= htmlspecialchars($cat['code']) ?>
                        </span>
                        <span class="text-xs font-bold text-slate-300"><?= $rate ?>% Operatividad</span>
                    </div>

                    <h3 class="text-base font-bold text-white"><?= htmlspecialchars($cat['name']) ?></h3>
                    <p class="text-xs text-slate-400 mt-1 leading-relaxed"><?= htmlspecialchars($cat['description']) ?></p>

                    <div class="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span class="text-slate-400">Total en Inventario:</span>
                        <span class="text-white font-extrabold text-sm"><?= $total ?> activos</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-800">
                    <a href="assets.php?cat=<?= urlencode($cat['id']) ?>" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition">
                        <span>Ver Activos de esta Categoría</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
