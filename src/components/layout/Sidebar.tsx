import React from 'react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { ticket, categories, assets } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard General',
      icon: 'dashboard',
      badge: null
    },
    {
      id: 'inventario',
      label: 'Inventario por Serial',
      icon: 'qr_code_scanner',
      badge: null
    },
    {
      id: 'mesa-de-servicio',
      label: 'Mesa de Servicio',
      icon: 'support_agent',
      badge: { count: 3, color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/30' }
    },
    {
      id: 'equipos-con-dano',
      label: 'Equipos con Daño',
      icon: 'build_circle',
      badge: { count: 5, color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/30' }
    },
    {
      id: 'movimientos',
      label: 'Movimientos y Transferencias',
      icon: 'sync_alt',
      badge: null
    },
    {
      id: 'auditoria',
      label: 'Toma Física / Auditoría',
      icon: 'assignment_turned_in',
      badge: { count: '75%', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30' }
    },
    {
      id: 'escanear',
      label: 'Escanear Activo / QR',
      icon: 'center_focus_strong',
      badge: null
    },
    {
      id: 'usuarios',
      label: 'Usuarios y Permisos',
      icon: 'manage_accounts',
      badge: null
    },
    {
      id: 'reportes',
      label: 'Reportes y Auditoría',
      icon: 'assignment',
      badge: null
    },
    {
      id: 'database',
      label: 'Base de Datos (Supabase)',
      icon: 'database',
      badge: { count: 'SQL', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30' }
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-white/10 z-50 hidden lg:flex flex-col justify-between select-none shadow-sm transition-colors">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="h-16 px-6 flex items-center gap-3.5 border-b border-slate-100 dark:border-white/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-lg text-slate-900 dark:text-white leading-none tracking-tight">
              EduStock
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-cyan-300/80 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
              Inventario Ambientes
            </span>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Gestión & Auditoría
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md dark:shadow-[0_4px_20px_rgba(6,182,212,0.25)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-cyan-300'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="text-xs tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 border text-[10px] font-bold rounded-full min-w-[20px] ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badge.color
                  }`}>
                    {item.badge.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Server Live Status Card matching documentation */}
      <div className="p-4 mx-3 mb-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Servidor Activo
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5 leading-tight">
          GoDaddy Shared cPanel
        </p>
        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
          PHP 8.2 & Laravel 11
        </p>
        <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-slate-200/70 dark:border-white/10 text-[11px]">
          <span className="text-slate-400">Versión EduStock</span>
          <span className="font-mono font-semibold text-blue-600 dark:text-cyan-300">v1.2.0</span>
        </div>
      </div>
    </aside>
  );
};
