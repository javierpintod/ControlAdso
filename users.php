<?php
$pageTitle = 'Directorio de Usuarios y Roles';
require_once __DIR__ . '/includes/header.php';

$db = getDB();
$users = [];

if ($db) {
    try {
        $users = $db->query("SELECT * FROM user_profiles ORDER BY name ASC")->fetchAll();
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<div class="space-y-6">
    <div>
        <h1 class="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <i data-lucide="users" class="w-6 h-6 text-emerald-400"></i>
            <span>Directorio de Usuarios & Roles RBAC</span>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
            Control de acceso basado en roles (Administrador General, Técnico Mesa de Servicio, Auditor Consulta).
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <?php foreach ($users as $u): 
            $roleColor = match($u['role']) {
                'admin' => 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                'tecnico' => 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                default => 'bg-purple-500/10 text-purple-400 border-purple-500/30'
            };
        ?>
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition space-y-4 shadow-xl">
                <div class="flex items-center space-x-4">
                    <img src="<?= htmlspecialchars($u['avatar_url'] ?: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80') ?>" alt="Avatar" class="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700">
                    <div>
                        <h3 class="text-sm font-bold text-white"><?= htmlspecialchars($u['name']) ?></h3>
                        <p class="text-[11px] text-slate-400"><?= htmlspecialchars($u['email']) ?></p>
                        <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border <?= $roleColor ?>">
                            <?= htmlspecialchars($u['role_title']) ?>
                        </span>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-800 text-xs space-y-1.5 text-slate-400">
                    <div class="flex justify-between">
                        <span>Ambientes Autorizados:</span>
                        <span class="text-slate-200 font-medium truncate max-w-[140px]"><?= htmlspecialchars($u['authorized_environments'] ?: 'Todos') ?></span>
                    </div>
                    <div class="flex justify-between">
                        <span>Último Acceso:</span>
                        <span class="text-slate-300 font-mono text-[11px]"><?= htmlspecialchars($u['last_login'] ?: 'Hoy') ?></span>
                    </div>
                </div>

                <div class="pt-2">
                    <a href="?switch_role=<?= urlencode($u['role']) ?>" class="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition">
                        <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-400"></i>
                        <span>Activar este Perfil</span>
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
