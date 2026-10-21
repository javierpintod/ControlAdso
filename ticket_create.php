<?php
$pageTitle = 'Reportar Falla en Mesa de Ayuda';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$selectedAssetId = trim($_GET['asset_id'] ?? '');

$error = '';
$assets = [];

if ($db) {
    $assets = $db->query("SELECT id, placa, serial_number, name, environment_name FROM assets ORDER BY name ASC")->fetchAll();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $assetId = trim($_POST['asset_id'] ?? '');
    $priority = $_POST['priority'] ?? 'media';
    $declaredSymptom = trim($_POST['declared_symptom'] ?? '');
    $diagnosticNotes = trim($_POST['diagnostic_notes'] ?? '');
    $technician = trim($_POST['technician_name'] ?? 'Tec. Marcos Peña');

    if (empty($assetId) || empty($declaredSymptom)) {
        $error = 'Por favor selecciona el activo y describe el síntoma o falla.';
    } elseif (!$db) {
        $error = 'No hay conexión a MySQL.';
    } else {
        try {
            $aStmt = $db->prepare("SELECT * FROM assets WHERE id = ? LIMIT 1");
            $aStmt->execute([$assetId]);
            $asset = $aStmt->fetch();

            if (!$asset) throw new Exception("Activo no encontrado.");

            $ticketId = 'tk-sena-' . substr($asset['placa'], -5) . '-' . rand(100, 999);
            $ticketNumber = 'TK-SENA-' . substr($asset['placa'], -5);
            $folio = 'TKT-SENA-' . date('Y') . '-' . rand(10, 99);
            $title = "Ticket #{$ticketNumber} • {$asset['name']} / Falla Reportada";

            $slaHours = match($priority) {
                'critica' => 24,
                'alta' => 48,
                'media' => 72,
                default => 120
            };

            $priorityLabel = match($priority) {
                'critica' => 'Crítica (P1)',
                'alta' => 'Alta (P2)',
                'media' => 'Media (P3)',
                default => 'Baja (P4)'
            };

            // 1. Insertar Ticket
            $tStmt = $db->prepare("INSERT INTO service_desk_tickets (
                id, ticket_number, folio, title, asset_id, asset_name, asset_code, serial_number,
                priority, priority_label, status, status_label, sla_hours_left, total_sla_hours,
                origin_environment_id, origin_environment, environment_name, current_custody_location,
                received_by, reporter_name, reporter_date, declared_symptom, diagnostic_notes,
                technician_name, created_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, 'taller_diagnostico', 'En Taller / Diagnóstico', ?, ?,
                ?, ?, ?, 'Mesa de Servicio Técnico — Banco Central',
                ?, ?, ?, ?, ?,
                ?, NOW()
            )");

            $tStmt->execute([
                $ticketId, $ticketNumber, $folio, $title, $asset['id'], $asset['name'], $asset['placa'], $asset['serial_number'],
                $priority, $priorityLabel, $slaHours, $slaHours,
                $asset['environment_id'], $asset['environment_name'], $asset['environment_name'],
                $currentUser['name'], $currentUser['name'], date('d/m/Y H:i'), $declaredSymptom, $diagnosticNotes,
                $technician
            ]);

            // 2. Insertar primer paso en la línea de tiempo
            $stepStmt = $db->prepare("INSERT INTO ticket_timeline_steps (id, ticket_id, step_number, title, time_label, assigned_to, status, note) VALUES (?, ?, 1, 'Recepción y Apertura de Caso', ?, ?, 'completed', 'Caso registrado en mesa de ayuda.')");
            $stepStmt->execute([uniqid('step-'), $ticketId, date('d/m/Y H:i'), $currentUser['name']]);

            // 3. Actualizar estado del activo a mesa_servicio
            $uStmt = $db->prepare("UPDATE assets SET physical_status = 'mesa_servicio', status_label = 'En Mesa de Ayuda / Diagnóstico' WHERE id = ?");
            $uStmt->execute([$asset['id']]);

            // 4. Registrar en historial del activo
            $hStmt = $db->prepare("INSERT INTO asset_history (id, asset_id, title, date_str, time_str, description, author, event_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $hStmt->execute([
                uniqid('hist-'),
                $asset['id'],
                'Ingreso a Mesa de Ayuda Técnica',
                date('d/m/Y'),
                date('h:i A'),
                "Apertura de Ticket {$ticketNumber} por falla: {$declaredSymptom}",
                $currentUser['name'],
                'SERVICE_TICKET'
            ]);

            header("Location: ticket_detail.php?id=" . urlencode($ticketId));
            exit;
        } catch (Exception $e) {
            $error = 'Error al abrir el ticket: ' . $e->getMessage();
        }
    }
}
?>

<div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="life-buoy" class="w-6 h-6 text-amber-400"></i>
                <span>Abrir Ticket en Mesa de Ayuda</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">Ingreso de equipo para diagnóstico o reparación con compromiso SLA</p>
        </div>
        <a href="servicedesk.php" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
            &larr; Volver
        </a>
    </div>

    <?php if (!empty($error)): ?>
        <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <form method="POST" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Activo Afectado *</label>
            <select name="asset_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                <option value="">Seleccionar activo...</option>
                <?php foreach ($assets as $a): ?>
                    <option value="<?= htmlspecialchars($a['id']) ?>" <?= $selectedAssetId === $a['id'] ? 'selected' : '' ?>>
                        Placa <?= htmlspecialchars($a['placa']) ?> - <?= htmlspecialchars($a['name']) ?> (<?= htmlspecialchars($a['environment_name']) ?>)
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Nivel de Prioridad (SLA) *</label>
                <select name="priority" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                    <option value="critica">Crítica (P1 - 24 horas)</option>
                    <option value="alta">Alta (P2 - 48 horas)</option>
                    <option value="media" selected>Media (P3 - 72 horas)</option>
                    <option value="baja">Baja (P4 - 120 horas)</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Técnico Asignado</label>
                <input type="text" name="technician_name" value="Tec. Marcos Peña" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
            </div>
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Síntoma Declarado / Descripción de la Falla *</label>
            <textarea name="declared_symptom" rows="3" placeholder="Ej: El equipo no enciende; el ventilador gira brevemente y emite tres pitidos..." required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"></textarea>
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Notas Preliminares de Diagnóstico (Opcional)</label>
            <textarea name="diagnostic_notes" rows="2" placeholder="Ej: Se probó con otro adaptador de corriente y la falla persiste..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"></textarea>
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <a href="servicedesk.php" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancelar</a>
            <button type="submit" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-amber-950">
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>Crear Ticket y Radicar Caso</span>
            </button>
        </div>
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
