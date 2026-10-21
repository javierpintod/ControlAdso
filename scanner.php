<?php
$pageTitle = 'Escáner QR & Código de Barras';
require_once __DIR__ . '/includes/header.php';

$searchError = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = trim($_POST['scanned_code'] ?? '');
    if (!empty($code)) {
        $db = getDB();
        if ($db) {
            $stmt = $db->prepare("SELECT id FROM assets WHERE placa = ? OR serial_number = ? OR asset_code = ? OR barcode = ? LIMIT 1");
            $stmt->execute([$code, $code, $code, $code]);
            $foundId = $stmt->fetchColumn();

            if ($foundId) {
                header("Location: asset_detail.php?id=" . urlencode($foundId));
                exit;
            } else {
                $searchError = "No se encontró ningún activo con el código '{$code}'.";
            }
        }
    }
}
?>

<!-- Biblioteca HTML5 QR Scanner -->
<script src="https://unpkg.com/html5-qrcode"></script>

<div class="max-w-xl mx-auto space-y-6">
    <div class="text-center space-y-1">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <i data-lucide="scan" class="w-6 h-6"></i>
        </div>
        <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight">Lector Óptico QR & Código de Barras</h1>
        <p class="text-xs text-slate-400">Escanea con la cámara de tu equipo o ingresa manualmente el número de placa SENA.</p>
    </div>

    <?php if (!empty($searchError)): ?>
        <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <i data-lucide="alert-circle" class="w-4 h-4 text-rose-400 shrink-0"></i>
            <span><?= htmlspecialchars($searchError) ?></span>
        </div>
    <?php endif; ?>

    <!-- Entrada Manual Rápida -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Búsqueda Rápida por Código</h2>
        <form method="POST" id="scanForm" class="flex gap-2">
            <input 
                type="text" 
                id="scanned_code" 
                name="scanned_code" 
                placeholder="Ingresa la placa SENA (ej. 95271024071) o serial..." 
                required 
                autofocus
                class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            >
            <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950 flex items-center space-x-1.5 shrink-0">
                <i data-lucide="search" class="w-4 h-4"></i>
                <span>Localizar</span>
            </button>
        </form>
    </div>

    <!-- Visor de Cámara en Vivo -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                <i data-lucide="camera" class="w-4 h-4"></i>
                <span>Escáner Óptico en Tiempo Real</span>
            </h2>
            <span class="text-[10px] text-slate-400">Cámara Web / Móvil</span>
        </div>

        <div id="reader" class="overflow-hidden rounded-xl bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center text-slate-500 text-xs">
            <span>Iniciando sensor de cámara...</span>
        </div>

        <p class="text-[11px] text-slate-400 text-center leading-relaxed">
            Apunta la cámara al rótulo patrimonial del activo para abrir automáticamente su hoja de vida y bitácora técnica.
        </p>
    </div>
</div>

<script>
    function onScanSuccess(decodedText, decodedResult) {
        // Si el QR tiene formato SENA_PLACA:XYZ o similar
        let cleanText = decodedText;
        if (cleanText.includes('PLACA:')) {
            let match = cleanText.match(/PLACA:([0-9a-zA-Z_-]+)/);
            if (match && match[1]) cleanText = match[1];
        }
        
        document.getElementById('scanned_code').value = cleanText;
        document.getElementById('scanForm').submit();
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (typeof Html5QrcodeScanner !== 'undefined') {
            let html5QrcodeScanner = new Html5QrcodeScanner(
                "reader", 
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );
            html5QrcodeScanner.render(onScanSuccess);
        }
    });
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
