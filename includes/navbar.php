<?php
/**
 * Barra Superior / Navbar
 * ControlAdso - EduStock Asset Manager
 */
?>
<header class="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 no-print">
    <!-- Search Bar -->
    <div class="flex-1 max-w-md">
        <form action="assets.php" method="GET" class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input 
                type="text" 
                name="q" 
                placeholder="Buscar por placa SENA, serial o modelo..." 
                value="<?= htmlspecialchars($_GET['q'] ?? '') ?>"
                class="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            >
        </form>
    </div>

    <!-- Actions & Role Switcher -->
    <div class="flex items-center space-x-3">
        <!-- JWT Session Indicator -->
        <div class="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-950/40 border border-purple-700/50 text-purple-300" title="Autenticación basada en JSON Web Token (HS256)">
            <i data-lucide="key-round" class="w-3 h-3 text-purple-400"></i>
            <span>JWT Auth</span>
        </div>

        <!-- Database Singleton Status Pill -->
        <a href="install.php" class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border <?= $dbConnected ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400' : 'bg-amber-950/40 border-amber-700/50 text-amber-400' ?>" title="Conexión única administrada con Patrón Singleton">
            <span class="w-2 h-2 rounded-full <?= $dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400' ?>"></span>
            <span>PDO Singleton: <?= $dbConnected ? 'Online' : 'Offline' ?></span>
        </a>

        <!-- Current User Role -->
        <div class="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
            <i data-lucide="shield" class="w-3.5 h-3.5 text-emerald-400"></i>
            <span class="capitalize font-semibold"><?= htmlspecialchars($currentUser['role']) ?></span>
        </div>

        <!-- Quick Action Button -->
        <a href="asset_create.php" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center space-x-1.5 transition shadow-sm shadow-emerald-950">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span class="hidden sm:inline">Nuevo Activo</span>
        </a>
    </div>
</header>
