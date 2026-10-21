<?php
/**
 * Menú Lateral / Barra de Navegación
 * ControlAdso - EduStock Asset Manager
 */
?>
<aside class="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 no-print">
    <!-- Brand / Logo -->
    <div class="h-16 px-6 flex items-center space-x-3 border-b border-slate-800/80">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
            <i data-lucide="boxes" class="w-5 h-5"></i>
        </div>
        <div>
            <div class="flex items-center space-x-1.5">
                <span class="font-extrabold text-base tracking-tight text-white">ControlAdso</span>
                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PHP</span>
            </div>
            <p class="text-[10px] text-slate-400 tracking-wider uppercase font-medium">EduStock • SENA</p>
        </div>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div class="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Gestión Patrimonial
        </div>

        <a href="index.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('index.php') ?>">
            <i data-lucide="layout-dashboard" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Dashboard Principal</span>
        </a>

        <a href="assets.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('assets.php') || isNavActive('asset_create.php') || isNavActive('asset_detail.php') || isNavActive('asset_edit.php') ?>">
            <i data-lucide="package" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Inventario de Activos</span>
        </a>

        <a href="movements.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('movements.php') || isNavActive('movement_create.php') || isNavActive('movement_acta.php') ?>">
            <i data-lucide="arrow-left-right" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Movimientos & Actas</span>
        </a>

        <a href="servicedesk.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('servicedesk.php') || isNavActive('ticket_create.php') || isNavActive('ticket_detail.php') ?>">
            <i data-lucide="wrench" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Mesa de Ayuda (SLA)</span>
        </a>

        <a href="audits.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('audits.php') || isNavActive('audit_session.php') ?>">
            <i data-lucide="clipboard-check" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Auditorías In Situ</span>
        </a>

        <div class="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Infraestructura
        </div>

        <a href="environments.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('environments.php') ?>">
            <i data-lucide="building-2" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Ambientes & Sedes</span>
        </a>

        <a href="categories.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('categories.php') ?>">
            <i data-lucide="tags" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Familias & Categorías</span>
        </a>

        <a href="scanner.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('scanner.php') ?>">
            <i data-lucide="qr-code" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Escáner QR / Barras</span>
        </a>

        <a href="reports.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('reports.php') ?>">
            <i data-lucide="file-spreadsheet" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Reportes e Impresión</span>
        </a>

        <div class="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Administración
        </div>

        <a href="users.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('users.php') ?>">
            <i data-lucide="users" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Directorio de Usuarios</span>
        </a>

        <a href="install.php" class="flex items-center px-3 py-2.5 rounded-lg text-xs transition <?= isNavActive('install.php') ?>">
            <i data-lucide="database" class="w-4 h-4 mr-3 shrink-0"></i>
            <span>Estado Base de Datos</span>
        </a>
    </nav>

    <!-- Footer Profile Summary -->
    <div class="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div class="flex items-center space-x-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <img src="<?= htmlspecialchars($currentUser['avatar_url']) ?>" alt="Avatar" class="w-8 h-8 rounded-full ring-1 ring-emerald-500/40 object-cover">
            <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-white truncate"><?= htmlspecialchars($currentUser['name']) ?></p>
                <p class="text-[10px] text-emerald-400 capitalize truncate"><?= htmlspecialchars($currentUser['role']) ?></p>
            </div>
            <a href="logout.php" title="Cerrar sesión" class="text-slate-400 hover:text-rose-400 transition p-1">
                <i data-lucide="log-out" class="w-4 h-4"></i>
            </a>
        </div>
    </div>
</aside>
