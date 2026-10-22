import React from 'react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { 
    currentCampus, 
    currentUser, 
    currentRole, 
    switchRole,
    switchUser,
    usersList, 
    theme, 
    toggleTheme, 
    openModal, 
    showToast,
    institutionProfile,
    jwtToken,
    isJwtAuthenticated,
    logoutJwt,
    openJwtInspector
  } = useApp();

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/90 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Left side: Campus selector & Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0 mr-2">
        {/* Mobile menu logo for small screens */}
        <div 
          onClick={() => onNavigate('dashboard')} 
          className="lg:hidden flex items-center gap-2 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">{institutionProfile?.logoIcon || 'inventory_2'}</span>
          </div>
          <span className="font-headline font-bold text-sm tracking-tight text-slate-900 dark:text-white hidden xs:inline truncate max-w-[130px]">
            {institutionProfile?.systemName || 'EduStock'}
          </span>
        </div>

        {/* Campus Selector Button */}
        <button
          onClick={() => openModal('campus-select')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold transition-all shrink-0 active:scale-95"
          title="Cambiar Sede / Campus"
        >
          <span className="material-symbols-outlined text-[17px] text-blue-600 dark:text-cyan-400">account_balance</span>
          <span className="truncate max-w-[160px] sm:max-w-xs">{currentCampus.name}</span>
          <span className="material-symbols-outlined text-[15px] text-slate-400">expand_more</span>
        </button>

        {/* Search Bar with Keyboard shortcut */}
        <div className="relative flex items-center w-full max-w-xs md:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Buscar serial, placa o activo..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onNavigate('inventario');
                showToast(`Buscando activo "${(e.target as HTMLInputElement).value}"...`, 'info', 'search');
              }
            }}
            className="w-full h-9 pl-9 pr-14 bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded shadow-xs hidden sm:inline">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right side controls: Theme toggle, Notifications, JWT Auth controls, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        
        {/* Auth / Role controls */}
        {isJwtAuthenticated ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick RBAC Switcher for verified admins */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-white/5 p-0.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Modo Administrador (Escritura y Control)"
              >
                <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
                <span>Admin</span>
              </button>
              <button
                onClick={() => switchRole('consulta')}
                className={`px-2 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  currentRole === 'consulta'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Modo Consulta (Solo Lectura)"
              >
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                <span>Consulta</span>
              </button>
            </div>

            {/* Logout button */}
            <button
              onClick={logoutJwt}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all active:scale-95"
              title="Cerrar sesión de Administrador (Volver a Consulta)"
            >
              <span className="material-symbols-outlined text-[15px]">logout</span>
              <span className="hidden lg:inline">Salir</span>
            </button>
          </div>
        ) : (
          /* When in Consulta mode: Admin Login Button */
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
              title="Ingresar como Administrador"
            >
              <span className="material-symbols-outlined text-[16px]">vpn_key</span>
              <span>Acceso Admin</span>
            </button>
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Consulta Pública
            </span>
          </div>
        )}

        {/* Shortcuts for Admin Views when authenticated */}
        {isJwtAuthenticated && (
          <div className="hidden xl:flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('personalizacion')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-semibold transition-all active:scale-95"
              title="Personalizar Institución, Ambientes y Registros"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Ajustes</span>
            </button>
            <button
              onClick={() => onNavigate('database')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-all active:scale-95"
              title="Base de Datos Supabase"
            >
              <span className="material-symbols-outlined text-[15px]">database</span>
              <span>BD</span>
            </button>
          </div>
        )}

        {/* Theme Toggle Button (Light/Dark Mode) */}
        <button
          onClick={toggleTheme}
          aria-label="Alternar tema oscuro o claro"
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 flex items-center justify-center transition-colors"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => showToast('Tienes 4 alertas de stock mínimo y 1 reporte de daño reciente.', 'warning', 'notifications')}
          className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 flex items-center justify-center transition-colors"
          title="Notificaciones"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]"></span>
        </button>

        {/* User profile with role badge */}
        <div className="relative group flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-white/10 cursor-pointer">
          <div className={`w-8 h-8 rounded-xl overflow-hidden shadow-xs ${
            isJwtAuthenticated ? 'ring-2 ring-emerald-500' : 'ring-1 ring-slate-300 dark:ring-slate-600'
          }`}>
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
                isJwtAuthenticated && currentRole === 'admin'
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300'
                  : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              }`}>
                {isJwtAuthenticated && currentRole === 'admin' ? 'Admin' : 'Consulta'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400 hidden xl:block">expand_more</span>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Sesión de Usuario
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate block">
                {currentUser.email}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-b border-slate-100 dark:border-white/10 space-y-1">
              {isJwtAuthenticated ? (
                <button
                  onClick={logoutJwt}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Cerrar Sesión</span>
                </button>
              ) : (
                <button
                  onClick={() => openModal('login')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                  <span>Iniciar Sesión como Admin</span>
                </button>
              )}
            </div>

            {/* Switch User Directory */}
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Directorio de Usuarios
              </span>
            </div>
            <div className="max-h-[180px] overflow-y-auto p-1">
              {usersList.map(u => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex flex-col gap-0.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${currentUser.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center justify-between">
                    <span>{u.name}</span>
                    {u.role === 'admin' && (
                      <span className="text-[9px] font-mono px-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300">
                        JWT
                      </span>
                    )}
                  </span>
                  <span className={`text-[10px] font-medium ${u.role === 'admin' ? 'text-blue-600 dark:text-cyan-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {u.roleTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
