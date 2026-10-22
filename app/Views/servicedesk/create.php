<div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="life-buoy" class="w-6 h-6 text-amber-400"></i>
                <span>Abrir Ticket en Mesa de Ayuda (MVC)</span>
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
            <label class="block text-xs font-medium text-slate-300 mb-1">Título del Caso *</label>
            <input type="text" name="title" placeholder="Ej: Falla en fuente de poder / Pantalla parpadea" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
        </div>

        <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Activo Afectado *</label>
            <select name="asset_id" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
                <option value="">Seleccionar activo...</option>
                <?php if (!empty($assets)): foreach ($assets as $a): ?>
                    <option value="<?= htmlspecialchars($a->id) ?>" <?= ($selectedAssetId ?? '') === $a->id ? 'selected' : '' ?>>
                        Placa <?= htmlspecialchars($a->placa) ?> - <?= htmlspecialchars($a->name) ?> (<?= htmlspecialchars($a->environmentName) ?>)
                    </option>
                <?php endforeach; endif; ?>
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
