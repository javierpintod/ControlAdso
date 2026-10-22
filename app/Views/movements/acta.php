<?php
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode("FOLIO:" . $movement['folio'] . "|HASH:" . $movement['crypto_hash']);
?>

<div class="max-w-4xl mx-auto space-y-6">
    <!-- Action Bar -->
    <div class="flex items-center justify-between no-print">
        <a href="movements.php" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Volver a Movimientos</span>
        </a>
        <button onclick="window.print()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-950">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Imprimir Acta Oficial</span>
        </button>
    </div>

    <!-- Documento Oficial Imprimible -->
    <div class="bg-white text-slate-900 rounded-2xl p-8 md:p-12 border border-slate-300 shadow-2xl space-y-8 font-sans">
        <!-- Encabezado Institucional -->
        <div class="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div class="flex items-center space-x-4">
                <div class="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
                    SENA
                </div>
                <div>
                    <h2 class="text-sm font-extrabold uppercase tracking-wide text-slate-950">Servicio Nacional de Aprendizaje</h2>
                    <p class="text-xs text-slate-700 font-semibold">Centro de Servicios y Gestión Empresarial • Regional Antioquia</p>
                    <p class="text-[10px] text-slate-500">Módulo de Control Patrimonial & Trazabilidad de Bienes (MVC)</p>
                </div>
            </div>
            <div class="text-right">
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Acta Oficial de Traslado</span>
                <span class="font-mono font-black text-lg text-emerald-800 block"><?= htmlspecialchars($movement['folio']) ?></span>
                <span class="text-[11px] text-slate-600 font-mono block"><?= htmlspecialchars($movement['timestamp_str']) ?></span>
            </div>
        </div>

        <!-- Tabla Resumen del Movimiento -->
        <div class="grid grid-cols-2 gap-4 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div>
                <span class="text-slate-500 font-semibold block text-[10px] uppercase">Ambiente de Origen</span>
                <span class="font-bold text-slate-900 text-sm"><?= htmlspecialchars($movement['origin_environment_name'] ?: 'Almacén Central') ?></span>
            </div>
            <div>
                <span class="text-slate-500 font-semibold block text-[10px] uppercase">Ambiente de Destino</span>
                <span class="font-bold text-emerald-700 text-sm"><?= htmlspecialchars($movement['destination_environment_name']) ?></span>
            </div>
            <div>
                <span class="text-slate-500 font-semibold block text-[10px] uppercase">Funcionario Autorizador</span>
                <span class="text-slate-900 font-medium"><?= htmlspecialchars($movement['user_name']) ?> (<?= htmlspecialchars($movement['user_role']) ?>)</span>
            </div>
            <div>
                <span class="text-slate-500 font-semibold block text-[10px] uppercase">Correo Institucional</span>
                <span class="text-slate-900 font-mono text-[11px]"><?= htmlspecialchars($movement['user_email']) ?></span>
            </div>
        </div>

        <!-- Detalle de Bienes Trasladados -->
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Detalle del Bien / Activo Devolutivo</h3>
            <table class="w-full text-left border border-slate-200 rounded-xl overflow-hidden text-xs">
                <thead class="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                    <tr>
                        <th class="py-2.5 px-3">Placa SENA</th>
                        <th class="py-2.5 px-3">Serial</th>
                        <th class="py-2.5 px-3">Descripción del Elemento</th>
                        <th class="py-2.5 px-3 text-center">Cant.</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    <tr>
                        <td class="py-3 px-3 font-mono font-bold text-slate-950"><?= htmlspecialchars($movement['asset_code'] ?: 'N/A') ?></td>
                        <td class="py-3 px-3 font-mono text-slate-700"><?= htmlspecialchars($movement['serial_number'] ?: 'N/A') ?></td>
                        <td class="py-3 px-3 font-semibold text-slate-900"><?= htmlspecialchars($movement['product_name']) ?></td>
                        <td class="py-3 px-3 text-center font-bold text-slate-900">1</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Observaciones -->
        <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Justificación del Traslado</h3>
            <p class="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                <?= nl2br(htmlspecialchars($movement['notes'] ?: 'Sin observaciones adicionales registradas.')) ?>
            </p>
        </div>

        <!-- Bloque Criptográfico SHA-256 & QR de Verificación -->
        <div class="border-2 border-emerald-900/30 rounded-xl p-4 bg-emerald-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="space-y-1.5">
                <div class="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs uppercase">
                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-700"></i>
                    <span>Sello Digital de Integridad Criptográfica (SHA-256)</span>
                </div>
                <p class="text-[10px] text-slate-600 max-w-md leading-relaxed">
                    Este documento ha sido sellado criptográficamente. Cualquier alteración en los datos invalida la correspondencia matemática de este hash.
                </p>
                <div class="bg-white p-2 rounded-lg border border-emerald-200 font-mono text-[9px] text-slate-800 break-all select-all">
                    <?= htmlspecialchars($movement['crypto_hash']) ?>
                </div>
            </div>
            <div class="shrink-0 text-center">
                <img src="<?= $qrUrl ?>" alt="QR Acta" class="w-24 h-24 border border-emerald-300 rounded p-1 bg-white">
                <span class="text-[8px] font-mono text-slate-500 mt-1 block">Validación Oficial</span>
            </div>
        </div>

        <!-- Firmas Oficiales -->
        <div class="pt-8 border-t border-slate-300 grid grid-cols-2 gap-12 text-center text-xs">
            <div class="space-y-1">
                <div class="border-b border-slate-400 pb-8"></div>
                <span class="font-bold text-slate-900 block"><?= htmlspecialchars($movement['user_name']) ?></span>
                <span class="text-[10px] text-slate-500 block">Custodio Emisor / Funcionario Entrega</span>
            </div>
            <div class="space-y-1">
                <div class="border-b border-slate-400 pb-8"></div>
                <span class="font-bold text-slate-900 block">Instructor / Encargado de Ambiente</span>
                <span class="text-[10px] text-slate-500 block">Custodio Receptor (<?= htmlspecialchars($movement['destination_environment_name']) ?>)</span>
            </div>
        </div>
    </div>
</div>
