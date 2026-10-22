<!DOCTYPE html>
<html lang="es" class="h-full bg-slate-950">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'Iniciar Sesión • ControlAdso SENA') ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="h-full flex items-center justify-center p-4 bg-slate-950 text-slate-100 antialiased">
    <div class="max-w-md w-full space-y-6">
        <!-- Logo Institucional -->
        <div class="text-center space-y-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-950">
                <i data-lucide="boxes" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">ControlAdso</h1>
            <p class="text-xs text-slate-400">Sistema de Trazabilidad Patrimonial & Ambientes • SENA (MVC)</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <i data-lucide="alert-circle" class="w-4 h-4 text-rose-400 shrink-0"></i>
                <span><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <!-- Formulario de Login -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">
            <form method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico Institucional</label>
                    <input 
                        type="email" 
                        name="email" 
                        required 
                        class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    >
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="text-xs font-semibold text-slate-300">Contraseña</label>
                    </div>
                    <input 
                        type="password" 
                        name="password" 
                        required 
                        class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    >
                </div>

                <button 
                    type="submit" 
                    class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950"
                >
                    Ingresar al Sistema
                </button>
            </form>
        </div>

        <div class="text-center text-[11px] text-slate-500 space-y-1">
            <p>Arquitectura MVC • Patrón Fábrica Abstracta • JWT RFC 7519</p>
            <p>Regional Antioquia • Centro de Servicios y Gestión Empresarial</p>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    </script>
</body>
</html>
