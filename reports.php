<?php
$pageTitle = 'Reportes e Impresión Oficial';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$reportType = $_GET['type'] ?? 'inventory';

$assets = [];
$totalVal = 0;

if ($db) {
    try {
        if ($reportType === 'damaged') {
            $stmt = $db->query("SELECT * FROM assets WHERE physical_status IN ('mesa_servicio', 'con_dano', 'mantenimiento') ORDER BY environment_name, name ASC");
        } else {
            $stmt = $db->query("SELECT * FROM assets ORDER BY environment_name, name ASC");
        }
        $assets = $stmt->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="file-spreadsheet" class="w-6 h-6 text-emerald-400"></i>
                <span>Centro de Reportes & Exportación Oficial</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">Generación de informes consolidados de inventario para auditoría SENA.</p>
        </div>

        <div class="flex items-center space-x-3">
            <div class="bg-slate-900 border border-slate-700 rounded-xl p-1 flex space-x-1 text-xs">
                <a href="reports.php?type=inventory" class="px-3 py-1.5 rounded-lg font-semibold transition <?= $reportType === 'inventory' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                    Inventario General
                </a>
                <a href="reports.php?type=damaged" class="px-3 py-1.5 rounded-lg font-semibold transition <?= $reportType === 'damaged' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white' ?>">
                    Mesa & Daño RAEE
                </a>
            </div>

            <button onclick="window.print()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-950">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Imprimir Reporte</span>
            </button>
        </div>
    </div>

    <!-- Documento Imprimible del Reporte -->
    <div class="bg-white text-slate-900 rounded-2xl p-8 md:p-10 border border-slate-300 shadow-xl space-y-6 font-sans">
        <div class="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
                <h2 class="text-base font-black uppercase text-slate-950">Servicio Nacional de Aprendizaje — SENA</h2>
                <p class="text-xs font-semibold text-slate-700">Centro de Servicios y Gestión Empresarial • Regional Antioquia (41)</p>
                <p class="text-[11px] text-slate-500">Módulo INVE • Centro de Costo 952710</p>
            </div>
            <div class="text-right">
                <span class="text-xs font-black uppercase text-slate-900 block">
                    <?= $reportType === 'damaged' ? 'INFORME DE NOVEDADES & MANTENIMIENTO' : 'INVENTARIO INSTITUCIONAL VALORIZADO' ?>
                </span>
                <span class="text-[11px] font-mono text-slate-600 block">Fecha de emisión: <?= date('d/m/Y H:i') ?></span>
                <span class="text-[10px] text-slate-500 font-mono block">Auditor: <?= htmlspecialchars($currentUser['name']) ?></span>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="border-b-2 border-slate-300 bg-slate-100 text-[10px] font-black uppercase text-slate-700">
                        <th class="py-2.5 px-3">Placa SENA</th>
                        <th class="py-2.5 px-3">Serial</th>
                        <th class="py-2.5 px-3">Descripción del Elemento</th>
                        <th class="py-2.5 px-3">Ambiente Actual</th>
                        <th class="py-2.5 px-3">Estado Físico</th>
                        <th class="py-2.5 px-3 text-right">Valor Ingreso</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    <?php foreach ($assets as $a): ?>
                        <tr class="hover:bg-slate-50 transition">
                            <td class="py-2.5 px-3 font-mono font-bold text-slate-950"><?= htmlspecialchars($a['placa']) ?></td>
                            <td class="py-2.5 px-3 font-mono text-slate-600 text-[11px]"><?= htmlspecialchars($a['serial_number']) ?></td>
                            <td class="py-2.5 px-3 font-semibold text-slate-900"><?= htmlspecialchars($a['name']) ?></td>
                            <td class="py-2.5 px-3 text-slate-700"><?= htmlspecialchars($a['environment_name']) ?></td>
                            <td class="py-2.5 px-3 font-medium text-slate-800"><?= htmlspecialchars($a['status_label']) ?></td>
                            <td class="py-2.5 px-3 font-mono text-right text-slate-900"><?= htmlspecialchars($a['valor_ingreso'] ?: '$0,00') ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Total de Elementos Reportados: <?= count($assets) ?> bienes</span>
            <span>Certificación de inventario físico y documental según manual de bienes SENA.</span>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
