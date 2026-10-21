<?php
$pageTitle = 'Editar Activo';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$assetId = trim($_GET['id'] ?? '');
$error = '';
$asset = null;

$environments = [];
$categories = [];

if ($db && !empty($assetId)) {
    $environments = $db->query("SELECT id, name FROM environments ORDER BY name ASC")->fetchAll();
    $categories = $db->query("SELECT id, name FROM product_categories ORDER BY name ASC")->fetchAll();

    $stmt = $db->prepare("SELECT * FROM assets WHERE id = ? LIMIT 1");
    $stmt->execute([$assetId]);
    $asset = $stmt->fetch();
}

if (!$asset) {
    echo '<div class="p-8 text-center"><p class="text-white font-bold">Activo no encontrado.</p><a href="assets.php" class="text-emerald-400 text-xs">Volver</a></div>';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $modelo = trim($_POST['modelo'] ?? '');
    $descripcionActual = trim($_POST['descripcion_actual'] ?? '');
    $environmentId = trim($_POST['environment_id'] ?? '');
    $station = trim($_POST['station'] ?? '');
    $responsible = trim($_POST['responsible_person'] ?? '');
    $physicalStatus = $_POST['physical_status'] ?? 'operativo';
    $valorIngreso = trim($_POST['valor_ingreso'] ?? '');

    try {
        $envStmt = $db->prepare("SELECT name FROM environments WHERE id = ?");
        $envStmt->execute([$environmentId]);
        $envName = $envStmt->fetchColumn() ?: $environmentId;

        $statusLabel = match($physicalStatus) {
            'operativo' => 'Operativo en Uso',
            'mesa_servicio' => 'En Mesa de Ayuda / Diagnóstico',
            'con_dano' => 'Con Daño Físico / Depósito',
            'mantenimiento' => 'En Mantenimiento Preventivo',
            default => 'Decomisado / Baja'
        };

        // Si cambió de ambiente o estado, agregar nota histórica
        if ($asset['environment_id'] !== $environmentId || $asset['physical_status'] !== $physicalStatus) {
            $hStmt = $db->prepare("INSERT INTO asset_history (id, asset_id, title, date_str, time_str, description, author, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $hStmt->execute([
                uniqid('hist-'),
                $asset['id'],
                'Modificación de Estado / Asignación',
                date('d/m/Y'),
                date('h:i A'),
                "Actualización manual de datos: Ambiente anterior [{$asset['environment_name']}] -> [{$envName}], Estado anterior [{$asset['physical_status']}] -> [{$physicalStatus}].",
                $currentUser['name'],
                'UPDATE'
            ]);
        }

        $uStmt = $db->prepare("UPDATE assets SET 
            name = ?, descripcion = ?, modelo = ?, descripcion_actual = ?,
            environment_id = ?, environment_name = ?, station = ?,
            responsible_person = ?, physical_status = ?, status_label = ?, valor_ingreso = ?
            WHERE id = ?");

        $uStmt->execute([
            $name, $descripcion, $modelo, $descripcionActual,
            $environmentId, $envName, $station,
            $responsible, $physicalStatus, $statusLabel, $valorIngreso,
            $asset['id']
        ]);

        header("Location: asset_detail.php?id=" . urlencode($asset['id']) . "&msg=updated");
        exit;
    } catch (Exception $e) {
        $error = 'Error al actualizar: ' . $e->getMessage();
    }
}
?>

<div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="edit-3" class="w-6 h-6 text-emerald-400"></i>
                <span>Editar Activo: <?= htmlspecialchars($asset['placa']) ?></span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">Actualizar características, ubicación o responsable</p>
        </div>
        <a href="asset_detail.php?id=<?= urlencode($asset['id']) ?>" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
            &larr; Volver al detalle
        </a>
    </div>

    <?php if (!empty($error)): ?>
        <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form method="POST" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Nombre Comercial del Activo</label>
                <input type="text" name="name" value="<?= htmlspecialchars($asset['name']) ?>" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Modelo</label>
                <input type="text" name="modelo" value="<?= htmlspecialchars($asset['modelo']) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Descripción Corta</label>
            <input type="text" name="descripcion" value="<?= htmlspecialchars($asset['descripcion']) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Descripción Técnica Completa</label>
            <textarea name="descripcion_actual" rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"><?= htmlspecialchars($asset['descripcion_actual']) ?></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Ambiente de Aprendizaje</label>
                <select name="environment_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <?php foreach ($environments as $env): ?>
                        <option value="<?= htmlspecialchars($env['id']) ?>" <?= $asset['environment_id'] === $env['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($env['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Estado Físico</label>
                <select name="physical_status" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                    <option value="operativo" <?= $asset['physical_status'] === 'operativo' ? 'selected' : '' ?>>Operativo en Uso</option>
                    <option value="mesa_servicio" <?= $asset['physical_status'] === 'mesa_servicio' ? 'selected' : '' ?>>Mesa de Servicio</option>
                    <option value="con_dano" <?= $asset['physical_status'] === 'con_dano' ? 'selected' : '' ?>>Con Daño / Depósito</option>
                    <option value="mantenimiento" <?= $asset['physical_status'] === 'mantenimiento' ? 'selected' : '' ?>>Mantenimiento Preventivo</option>
                    <option value="decomisado" <?= $asset['physical_status'] === 'decomisado' ? 'selected' : '' ?>>Decomisado / Baja</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Estación / Puesto</label>
                <input type="text" name="station" value="<?= htmlspecialchars($asset['station']) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Valor Ingreso (COP)</label>
                <input type="text" name="valor_ingreso" value="<?= htmlspecialchars($asset['valor_ingreso']) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono">
            </div>
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Custodio / Responsable</label>
            <input type="text" name="responsible_person" value="<?= htmlspecialchars($asset['responsible_person']) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <a href="asset_detail.php?id=<?= urlencode($asset['id']) ?>" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancelar</a>
            <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2">
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Guardar Cambios</span>
            </button>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
