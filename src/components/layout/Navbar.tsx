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
    theme, 
    toggleTheme, 
    openModal, 
    showToast 
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
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
          <span className="font-headline font-bold text-sm tracking-tight text-slate-900 dark:text-white hidden xs:inline">
            EduStock
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

      {/* Right side controls: Theme toggle, Notifications, RBAC live switcher, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Quick RBAC Switcher button (Critical for user to test Admin vs Consulta restrictions) */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-white/5 p-0.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              currentRole === 'admin'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Cambiar a Administrador (Acceso Total RW)"
          >
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            <span>Admin</span>
          </button>
          <button
            onClick={() => switchRole('consulta')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              currentRole === 'consulta'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Cambiar a Auditor / Consulta (Solo Lectura)"
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            <span>Consulta</span>
          </button>
        </div>

        {/* Supabase Database Quick Shortcut */}
        <button
          onClick={() => onNavigate('database')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold transition-all active:scale-95"
          title="Ver Base de Datos y Esquema Supabase"
        >
          <span className="material-symbols-outlined text-[16px]">database</span>
          <span>BD Supabase</span>
        </button>

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
        </div>

      </div>
    </header>
  );
};
