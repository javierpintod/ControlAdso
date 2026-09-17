import re

with open('src/components/layout/Navbar.tsx', 'r') as f:
    content = f.read()

# Add switchUser to destructuring
content = content.replace("    switchRole,", "    switchRole,\n    switchUser,\n    usersList,")

# Replace user profile div
old_profile = """        {/* User profile with role badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-white/10">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Foto de perfil de usuario"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                currentRole === 'admin'
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300'
                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              }`}>
                {currentRole === 'admin' ? 'Admin RBAC' : 'Consulta RO'}
              </span>
            </div>
          </div>
          <button
            onClick={() => showToast('Sesión segura JWT validada con éxito. Token activo.', 'info', 'lock')}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            title="Cerrar sesión JWT segura"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>"""

new_profile = """        {/* User profile with role badge */}
        <div className="relative group flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-white/10 cursor-pointer">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-blue-500/30 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Foto de perfil de usuario"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                currentRole === 'admin'
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300'
                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              }`}>
                {currentRole === 'admin' ? 'Admin RBAC' : 'Consulta RO'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400 hidden xl:block">expand_more</span>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cambiar Usuario</span>
            </div>
            <div className="max-h-[250px] overflow-y-auto">
              {usersList.map(u => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full text-left px-3 py-2.5 flex flex-col gap-0.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-white/5 last:border-0 ${currentUser.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{u.name}</span>
                  <span className={`text-[10px] font-medium ${u.role === 'admin' ? 'text-blue-600 dark:text-cyan-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {u.roleTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>"""

content = content.replace(old_profile, new_profile)

with open('src/components/layout/Navbar.tsx', 'w') as f:
    f.write(content)
print("Success")
