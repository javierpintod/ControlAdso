<div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <i data-lucide="edit-3" class="w-6 h-6 text-emerald-400"></i>
                <span>Editar Activo: <?= htmlspecialchars($asset->name) ?></span>
            </h1>
            <p class="text-xs text-slate-400 mt-1">Placa SENA: <span class="font-mono text-emerald-400"><?= htmlspecialchars($asset->placa) ?></span></p>
        </div>
        <a href="asset_detail.php?id=<?= urlencode($asset->id) ?>" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
            &larr; Volver al detalle
        </a>
    </div>

    <?php if (!empty($error)): ?>
        <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <i data-lucide="alert-circle" class="w-4 h-4 shrink-0 text-rose-400"></i>
            <span><?= htmlspecialchars($error) ?></span>
        </div>
    <?php endif; ?>

    <form method="POST" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        <div>
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800">
                1. Información General y Modelo
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Nombre Comercial</label>
                    <input type="text" name="name" value="<?= htmlspecialchars($asset->name) ?>" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Modelo</label>
                    <input type="text" name="modelo" value="<?= htmlspecialchars($asset->modelo) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-slate-300 mb-1">Descripción Técnica</label>
                    <textarea name="descripcion_actual" rows="3" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"><?= htmlspecialchars($asset->descripcionActual) ?></textarea>
                </div>
            </div>
        </div>

        <div>
            <h2 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 pb-2 border-b border-slate-800">
                2. Ubicación, Estado y Custodia
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Ambiente de Aprendizaje</label>
                    <select name="environment_id" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <?php if (!empty($environments)): foreach ($environments as $env): ?>
                            <option value="<?= htmlspecialchars($env['id']) ?>" <?= $asset->environmentId === $env['id'] ? 'selected' : '' ?>>
                                <?= htmlspecialchars($env['name']) ?>
                            </option>
                        <?php endforeach; endif; ?>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Categoría</label>
                    <select name="category_id" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <?php if (!empty($categories)): foreach ($categories as $cat): ?>
                            <option value="<?= htmlspecialchars($cat['id']) ?>" <?= $asset->categoryId === $cat['id'] ? 'selected' : '' ?>>
                                <?= htmlspecialchars($cat['name']) ?>
                            </option>
                        <?php endforeach; endif; ?>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Estación / Puesto Físico</label>
                    <input type="text" name="station" value="<?= htmlspecialchars($asset->station) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-300 mb-1">Estado Físico</label>
                    <select name="physical_status" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                        <option value="operativo" <?= $asset->physicalStatus === 'operativo' ? 'selected' : '' ?>>Operativo en Uso</option>
                        <option value="mesa_servicio" <?= $asset->physicalStatus === 'mesa_servicio' ? 'selected' : '' ?>>Mesa de Servicio</option>
                        <option value="mantenimiento" <?= $asset->physicalStatus === 'mantenimiento' ? 'selected' : '' ?>>Mantenimiento</option>
                        <option value="con_dano" <?= $asset->physicalStatus === 'con_dano' ? 'selected' : '' ?>>Con Daño Físico / Depósito</option>
                        <option value="decomisado" <?= $asset->physicalStatus === 'decomisado' ? 'selected' : '' ?>>Decomisado / Baja</option>
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-xs font-medium text-slate-300 mb-1">Custodio Responsable</label>
                    <input type="text" name="responsible_person" value="<?= htmlspecialchars($asset->responsiblePerson) ?>" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
                </div>
            </div>
        </div>

        <div class="pt-6 border-t border-slate-800 flex items-center justify-end space-x-3">
            <a href="asset_detail.php?id=<?= urlencode($asset->id) ?>" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition">
                Cancelar
            </a>
            <button type="submit" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950 flex items-center space-x-2">
                <i data-lucide="check" class="w-4 h-4"></i>
                <span>Guardar Cambios</span>
            </button>
        </div>
    </form>
</div>
