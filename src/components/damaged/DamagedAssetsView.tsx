import React from 'react';
import { useApp } from '../../context/AppContext';

interface DamagedAssetsViewProps {
  onNavigate: (view: string) => void;
}

export const DamagedAssetsView: React.FC<DamagedAssetsViewProps> = ({ onNavigate }) => {
  const { assets, showToast, currentRole, openModal } = useApp();

  const damagedAssets = assets.filter(a => a.physicalStatus === 'con_dano' || a.physicalStatus === 'mesa_servicio');

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold">
              ALMACEN-DANO-2025
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Gestión de Activos con Daño & Residuos RAEE
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Equipos con Daño Reportado & Mesa de Servicio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Registro de activos fuera de servicio pendientes de reparación técnica o desincorporación contable.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('mesa-de-servicio')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span>Ver Caso Activo en Mesa de Ayuda</span>
          </button>
        </div>
      </div>

      {/* Grid of Damaged Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {damagedAssets.map(item => (
          <div 
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-xs">
                  {item.serialNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.physicalStatus === 'con_dano'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300/50'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 border border-blue-300/50'
                }`}>
                  {item.physicalStatus === 'con_dano' ? 'DAÑO CRÍTICO' : 'EN DIAGNÓSTICO'}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-headline font-bold text-slate-900 dark:text-white text-sm truncate">
                    {item.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {item.assetCode}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {item.environmentName}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-white/5 italic">
                "{item.description}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Garantía: {item.warrantyUntil}</span>
              <button
                onClick={() => onNavigate('mesa-de-servicio')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-blue-600 dark:text-cyan-400 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Dictaminar</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
