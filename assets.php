<?php
$pageTitle = 'Inventario de Activos';
require_once __DIR__ . '/includes/header.php';

$db = getDB();

$q = trim($_GET['q'] ?? '');
$envFilter = trim($_GET['env'] ?? '');
$statusFilter = trim($_GET['status'] ?? '');
$catFilter = trim($_GET['cat'] ?? '');

$assets = [];
$environments = [];
$categories = [];

if ($db) {
    try {
        $environments = $db->query("SELECT id, name FROM environments ORDER BY name ASC")->fetchAll();
        $categories = $db->query("SELECT id, name FROM product_categories ORDER BY name ASC")->fetchAll();

        $sql = "SELECT * FROM assets WHERE 1=1";
        $params = [];

        if (!empty($q)) {
            $sql .= " AND (placa LIKE ? OR serial_number LIKE ? OR name LIKE ? OR modelo LIKE ? OR asset_code LIKE ?)";
            $wildcard = "%{$q}%";
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
            $params[] = $wildcard;
        }

        if (!empty($envFilter)) {
            $sql .= " AND environment_id = ?";
            $params[] = $envFilter;
        }

        if (!empty($statusFilter)) {
            $sql .= " AND physical_status = ?";
            $params[] = $statusFilter;
        }

        if (!empty($catFilter)) {
            $sql .= " AND category_id = ?";
            $params[] = $catFilter;
        }

        $sql .= " ORDER BY created_at DESC LIMIT 100";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $assets = $stmt->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <!-- Header de Sección -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="package" class="w-6 h-6 text-emerald-400"></i>
                <span>Inventario y Hoja de Vida de Activos</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">
                Catálogo institucional serializado con placas SENA, centro de costos y custodia activa.
            </p>
        </div>
        <div class="flex items-center space-x-3">
            <a href="reports.php" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition shadow">
                <i data-lucide="printer" class="w-4 h-4 text-slate-400"></i>
                <span>Exportar / Imprimir</span>
            </a>
            <a href="asset_create.php" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-emerald-950">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Registrar Activo</span>
            </a>
        </div>
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <form method="GET" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <!-- Búsqueda por texto -->
            <div class="lg:col-span-2">
                <div class="relative">
                    <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                    <input 
                        type="text" 
                        name="q" 
                        value="<?= htmlspecialchars($q) ?>" 
                        placeholder="Buscar por placa, serial, nombre o modelo..." 
                        class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    >
                </div>
            </div>

            <!-- Filtro Ambiente -->
            <div>
                <select name="env" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Todos los Ambientes</option>
                    <?php foreach ($environments as $env): ?>
                        <option value="<?= htmlspecialchars($env['id']) ?>" <?= $envFilter === $env['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($env['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <!-- Filtro Estado Físico -->
            <div>
                <select name="status" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <option value="">Todos los Estados</option>
                    <option value="operativo" <?= $statusFilter === 'operativo' ? 'selected' : '' ?>>Operativo en Uso</option>
                    <option value="mesa_servicio" <?= $statusFilter === 'mesa_servicio' ? 'selected' : '' ?>>Mesa de Servicio</option>
                    <option value="con_dano" <?= $statusFilter === 'con_dano' ? 'selected' : '' ?>>Con Daño / RAEE</option>
                    <option value="mantenimiento" <?= $statusFilter === 'mantenimiento' ? 'selected' : '' ?>>Mantenimiento</option>
                    <option value="decomisado" <?= $statusFilter === 'decomisado' ? 'selected' : '' ?>>Decomisado / Baja</option>
                </select>
            </div>

            <!-- Botones de Acción -->
            <div class="flex items-center space-x-2">
                <button type="submit" class="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5">
                    <i data-lucide="filter" class="w-3.5 h-3.5"></i>
                    <span>Filtrar</span>
                </button>
                <?php if (!empty($q) || !empty($envFilter) || !empty($statusFilter) || !empty($catFilter)): ?>
                    <a href="assets.php" title="Limpiar filtros" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </a>
                <?php endif; ?>
            </div>
        </form>
    </div>

    <!-- Tabla de Activos -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-800 bg-slate-950/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th class="py-3.5 px-4">Placa & Serial</th>
                        <th class="py-3.5 px-4">Activo / Descripción</th>
                        <th class="py-3.5 px-4">Ambiente & Ubicación</th>
                        <th class="py-3.5 px-4">Estado Físico</th>
                        <th class="py-3.5 px-4">Responsable</th>
                        <th class="py-3.5 px-4">Valor Ingreso</th>
                        <th class="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-xs text-slate-300">
                    <?php if (!empty($assets)): ?>
                        <?php foreach ($assets as $asset): 
                            $statusBadge = match($asset['physical_status']) {
                                'operativo' => 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                                'mesa_servicio' => 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                                'con_dano' => 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                                'mantenimiento' => 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                                default => 'bg-slate-700/50 text-slate-300 border-slate-600'
                            };
                        ?>
                            <tr class="hover:bg-slate-800/50 transition group">
                                <td class="py-3.5 px-4 font-mono">
                                    <span class="text-white font-bold block"><?= htmlspecialchars($asset['placa'] ?: $asset['asset_code']) ?></span>
                                    <span class="text-[10px] text-slate-400 block"><?= htmlspecialchars($asset['serial_number'] ?: $asset['serial']) ?></span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <a href="asset_detail.php?id=<?= urlencode($asset['id']) ?>" class="font-bold text-white hover:text-emerald-400 transition block truncate max-w-xs">
                                        <?= htmlspecialchars($asset['name']) ?>
                                    </a>
                                    <span class="text-[11px] text-slate-400 block truncate max-w-xs">
                                        <?= htmlspecialchars($asset['descripcion_actual'] ?: $asset['description']) ?>
                                    </span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="text-slate-200 font-medium block"><?= htmlspecialchars($asset['environment_name'] ?: $asset['environment_id']) ?></span>
                                    <span class="text-[10px] text-slate-400 block"><?= htmlspecialchars($asset['station']) ?></span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border <?= $statusBadge ?>">
                                        <?= htmlspecialchars($asset['status_label'] ?: ucfirst($asset['physical_status'])) ?>
                                    </span>
                                </td>
                                <td class="py-3.5 px-4">
                                    <span class="text-slate-300 block truncate max-w-[140px]"><?= htmlspecialchars($asset['responsible_person']) ?></span>
                                    <span class="text-[10px] text-slate-400 block">CC: <?= htmlspecialchars($asset['centro_costo']) ?></span>
                                </td>
                                <td class="py-3.5 px-4 font-mono font-medium text-slate-300">
                                    <?= htmlspecialchars($asset['valor_ingreso'] ?: '$0,00') ?>
                                </td>
                                <td class="py-3.5 px-4 text-right">
                                    <div class="flex items-center justify-end space-x-1.5 opacity-90 group-hover:opacity-100 transition">
                                        <a href="asset_detail.php?id=<?= urlencode($asset['id']) ?>" title="Ver Hoja de Vida & QR" class="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 transition">
                                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                                        </a>
                                        <a href="movement_create.php?asset_id=<?= urlencode($asset['id']) ?>" title="Generar Traslado de Ambiente" class="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 transition">
                                            <i data-lucide="arrow-left-right" class="w-3.5 h-3.5"></i>
                                        </a>
                                        <a href="ticket_create.php?asset_id=<?= urlencode($asset['id']) ?>" title="Reportar en Mesa de Ayuda" class="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/20 text-slate-300 hover:text-amber-400 transition">
                                            <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                                        </a>
                                        <a href="asset_edit.php?id=<?= urlencode($asset['id']) ?>" title="Editar Activo" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition">
                                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                        </a>
                                        <?php if ($currentUser['role'] === 'admin'): ?>
                                            <a href="asset_delete.php?id=<?= urlencode($asset['id']) ?>" onclick="return confirm('¿Seguro que deseas dar de baja o eliminar este activo?');" title="Eliminar Activo" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 transition">
                                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="7" class="py-12 text-center text-slate-400">
                                <div class="max-w-sm mx-auto space-y-3">
                                    <div class="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                                        <i data-lucide="inbox" class="w-6 h-6"></i>
                                    </div>
                                    <p class="text-sm font-semibold text-slate-300">No se encontraron activos</p>
                                    <p class="text-xs text-slate-500">Prueba ajustando los filtros de búsqueda o registra un nuevo activo en el sistema.</p>
                                </div>
                            </td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <div class="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Mostrando <?= count($assets) ?> activo(s)</span>
            <span class="font-mono">Regional 41 • SENA</span>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
