<?php
/**
 * Header común del Sistema
 * ControlAdso - EduStock Asset Manager (SENA)
 */

if (!defined('APP_INIT')) {
    define('APP_INIT', true);
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/auth.php';

requireAuth();

$currentUser = getCurrentUser();
$dbConnected = isDBConnected();

// Helper para marcar enlaces activos en el menú
function isNavActive(string $pageName): string {
    $script = basename($_SERVER['PHP_SELF']);
    return ($script === $pageName) 
        ? 'bg-emerald-600/15 text-emerald-400 font-semibold border-r-2 border-emerald-500' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium';
}
?>
<!DOCTYPE html>
<html lang="es" class="h-full bg-slate-950">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' : '' ?>ControlAdso - EduStock SENA</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Fuentes Google: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        sena: {
                            green: '#39A900',
                            dark: '#00324D',
                            light: '#E6F3E6'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; color: black !important; }
        }
    </style>
</head>
<body class="h-full text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">

    <!-- Banner si la base de datos no está conectada -->
    <?php if (!$dbConnected && basename($_SERVER['PHP_SELF']) !== 'install.php'): ?>
        <div class="bg-amber-600/90 text-white px-4 py-2 text-xs flex items-center justify-between no-print border-b border-amber-500">
            <div class="flex items-center space-x-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-200"></i>
                <span><strong>Aviso de Base de Datos:</strong> MySQL no está conectado o la base de datos aún no se ha aprovisionado.</span>
            </div>
            <a href="install.php" class="px-3 py-1 bg-white text-amber-900 font-semibold rounded-md shadow hover:bg-amber-100 transition">
                Abrir Instalador MySQL &rarr;
            </a>
        </div>
    <?php endif; ?>

    <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar Navigation -->
        <?php include __DIR__ . '/sidebar.php'; ?>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-900/60">
            <!-- Top Navbar -->
            <?php include __DIR__ . '/navbar.php'; ?>

            <!-- Page Body Container -->
            <main class="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
