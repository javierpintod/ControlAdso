<div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="arrow-left-right" class="w-6 h-6 text-emerald-400"></i>
                <span>Registrar Traslado de Activo (MVC)</span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">Generación de acta de remisión y firma criptográfica SHA-256</p>
        </div>
        <a href="movements.php" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
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
            <label class="block text-xs font-medium text-slate-300 mb-1">Activo Institucional a Trasladar *</label>
            <select name="asset_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                <option value="">Seleccionar activo...</option>
                <?php if (!empty($assets)): foreach ($assets as $a): ?>
                    <option value="<?= htmlspecialchars($a->id) ?>" <?= ($selectedAssetId ?? '') === $a->id ? 'selected' : '' ?>>
                        Placa <?= htmlspecialchars($a->placa) ?> - <?= htmlspecialchars($a->name) ?> (Ubicación: <?= htmlspecialchars($a->environmentName) ?>)
                    </option>
                <?php endforeach; endif; ?>
            </select>
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Ambiente Destino *</label>
            <select name="destination_environment_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                <option value="">Seleccionar ambiente destino...</option>
                <?php if (!empty($environments)): foreach ($environments as $env): ?>
                    <option value="<?= htmlspecialchars($env['id']) ?>"><?= htmlspecialchars($env['name']) ?></option>
                <?php endforeach; endif; ?>
            </select>
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Motivo / Justificación del Traslado</label>
            <textarea name="notes" rows="3" placeholder="Ej: Reasignación temporal para prácticas de desarrollo ADSO Ficha 2670142..." required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"></textarea>
        </div>

        <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span class="font-bold text-slate-300 block flex items-center space-x-1.5">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                <span>Garantía de Integridad Criptográfica</span>
            </span>
            <p class="text-slate-400 text-[11px] leading-relaxed">
                Al confirmar el traslado, el sistema calculará de forma automática un hash SHA-256 de 64 caracteres enlazando el folio, la placa del activo, el custodio actual y la marca temporal.
            </p>
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <a href="movements.php" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Cancelar</a>
            <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-950">
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Firmar y Emitir Acta Oficial</span>
            </button>
        </div>
    </form>
</div>
