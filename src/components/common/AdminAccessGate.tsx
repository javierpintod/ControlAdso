import React from 'react';
import { useApp } from '../../context/AppContext';

interface AdminAccessGateProps {
  moduleName: string;
  moduleDescription: string;
  moduleIcon: string;
  onNavigate: (view: string) => void;
}

export const AdminAccessGate: React.FC<AdminAccessGateProps> = ({
  moduleName,
  moduleDescription,
  moduleIcon,
  onNavigate,
}) => {
  const { openModal } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4 py-8 text-center animate-fade-in">
      
      {/* Icon Shield */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center ring-8 ring-blue-500/5 shadow-inner">
          <span className="material-symbols-outlined text-[42px]">{moduleIcon}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">vpn_key</span>
          REQUIERE TOKEN JWT DE ADMINISTRADOR
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold">
          Rol actual: Consulta (RO)
        </span>
      </div>

      {/* Titles */}
      <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
        Acceso Restringido: {moduleName}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
        {moduleDescription}
      </p>

      {/* Informative Box */}
      <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-left w-full space-y-2.5">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5">
            info
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Modo de Consulta activo:</strong> Puedes consultar libremente el Dashboard, Inventario por Serial, Escanear activos, Estados de equipos y Reportes sin iniciar sesión.
          </p>
        </div>
        <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
          <span className="material-symbols-outlined text-[20px] text-amber-500 shrink-0 mt-0.5">
            verified_user
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Para ver y gestionar este módulo administrativo o realizar cambios de escritura (RW), ingresa con tus credenciales institucionales para emitir un <strong>Token JWT firmado</strong>.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          onClick={() => openModal('login')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          <span>Iniciar Sesión como Administrador (JWT)</span>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver al Dashboard de Consulta</span>
        </button>
      </div>

    </div>
  );
};
