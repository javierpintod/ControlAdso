import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnvironmentId } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    categories, 
    movements, 
    activeEnvironmentTab, 
    setActiveEnvironmentTab, 
    openModal, 
    showToast,
    exportData,
    currentRole
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(categoryFilter.toLowerCase()) ||
    c.code.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const envTabs: { id: EnvironmentId; label: string; count: number; icon: string }[] = [
    { id: 'all', label: 'Todos los Ambientes', count: 1482, icon: 'domain' },
    { id: 'amb1', label: 'Ambiente 1: Lab Robótica & IA', count: 490, icon: 'precision_manufacturing' },
    { id: 'amb2', label: 'Ambiente 2: Aula Cómputo & Redes', count: 520, icon: 'lan' },
    { id: 'amb3', label: 'Ambiente 3: Taller de Electrónica', count: 408, icon: 'memory' },
    { id: 'service', label: 'Mesa de Servicio', count: 38, icon: 'support_agent' },
    { id: 'damaged', label: 'Almacén de Dañados', count: 26, icon: 'warning' }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyan-300/80">
              Módulo Central de Operaciones
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight mt-1">
            Dashboard de Control de Inventario & Ambientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visibilidad centralizada de existencias, estado operativo y trazabilidad física en tiempo real.
          </p>
        </div>

        {/* Quick Actions Button Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Export Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setShowExportMenu(prev => !prev)}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <span className="material-symbols-outlined text-[17px] text-blue-600 dark:text-cyan-400">file_download</span>
              <span>Exportar Reporte</span>
              <span className="material-symbols-outlined text-[15px] text-slate-400">expand_more</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl z-30 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportData('pdf', activeEnvironmentTab);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-[17px] text-rose-500">picture_as_pdf</span>
                  <span>Reporte Formal (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportData('excel', activeEnvironmentTab);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-[17px] text-emerald-500">table_view</span>
                  <span>Matriz Detallada (Excel/CSV)</span>
                </button>
              </div>
            )}
          </div>

          {/* Movement Button */}
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | El rol Consulta (solo lectura) no tiene permiso para registrar movimientos.', 'error', 'lock');
              } else {
                openModal('movement');
              }
            }}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-blue-700 dark:text-cyan-300 font-semibold text-xs rounded-xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">sync_alt</span>
            <span>Registrar Movimiento</span>
          </button>

          {/* New Product Button */}
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | Solo los administradores pueden dar de alta nuevos productos y catálogos.', 'error', 'lock');
              } else {
                onNavigate('inventario');
                showToast('Abriendo catálogo general de activos para catalogación...', 'info', 'add_circle');
              }
            }}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>Nuevo Producto</span>
          </button>

        </div>
      </div>

      {/* Row of 5 Key Metrics (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Total Activos */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Activos
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/60 dark:border-emerald-500/30">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> +12
            </span>
          </div>
          <div className="my-2.5 flex items-baseline justify-between">
            <span className="font-headline text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              1,482
            </span>
            <span className="font-mono text-xs text-slate-400">Unidades</span>
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400"></span>
            <span>100% trazables con serial único</span>
          </div>
        </div>

        {/* Card 2: Operativos en Ambientes */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Operativos
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/60 dark:border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 95.7%
            </span>
          </div>
          <div className="my-2.5 flex items-baseline justify-between">
            <span className="font-headline text-2xl lg:text-3xl font-bold text-emerald-700 dark:text-emerald-300 tracking-tight">
              1,418
            </span>
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400/80">Activos</span>
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Ambientes 1, 2 y 3</span>
          </div>
        </div>

        {/* Card 3: Mesa de Servicio */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mesa Servicio
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-300/60 dark:border-blue-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> 2.5%
            </span>
          </div>
          <div className="my-2.5 flex items-baseline justify-between">
            <span className="font-headline text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">
              38
            </span>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400/80">En revisión</span>
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Diagnóstico y mantención</span>
          </div>
        </div>

        {/* Card 4: Reportados con Daño */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Con Daño / Bajas
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-300/60 dark:border-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 1.8%
            </span>
          </div>
          <div className="my-2.5 flex items-baseline justify-between">
            <span className="font-headline text-2xl lg:text-3xl font-bold text-rose-700 dark:text-rose-300 tracking-tight">
              26
            </span>
            <span className="font-mono text-xs text-rose-600 dark:text-rose-400/80">Averiados</span>
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Pendientes de dictamen</span>
          </div>
        </div>

        {/* Card 5: Alertas Stock Mínimo */}
        <div className="col-span-2 sm:col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Alertas Stock
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-300/60 dark:border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> Crítico
            </span>
          </div>
          <div className="my-2.5 flex items-baseline justify-between">
            <span className="font-headline text-2xl lg:text-3xl font-bold text-amber-700 dark:text-amber-300 tracking-tight">
              4
            </span>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400/80">Líneas</span>
          </div>
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Bajo umbral de seguridad</span>
          </div>
        </div>

      </div>

      {/* Segmented Environment Switcher / Tabs */}
      <div className="w-full overflow-x-auto pb-1">
        <nav className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 gap-1 min-w-max">
          {envTabs.map(tab => {
            const isActive = activeEnvironmentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveEnvironmentTab(tab.id);
                  showToast(`Filtro cambiado a: ${tab.label} (${tab.count} activos)`, 'info');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs dark:shadow-[0_2px_12px_rgba(37,99,235,0.4)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] text-blue-600 dark:text-cyan-400">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded-full font-mono text-[10px] ${
                  isActive
                    ? 'bg-slate-100 dark:bg-white/20 text-slate-800 dark:text-white'
                    : 'bg-slate-200/60 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Layout (65% / 35% Asymmetric Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Categories Matrix & Stock Distribution (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Categories Table Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            
            {/* Table Header with Search */}
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                    Existencias por Categoría & Distribución Física
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-[11px] font-bold">
                    {filteredCategories.length} Familias Activas
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cómputo en tiempo real según transacciones con seriales escaneados y validados.
                </p>
              </div>

              {/* Filter search */}
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-[16px]">filter_list</span>
                <input
                  type="text"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  placeholder="Filtrar categoría..."
                  className="w-44 h-8 pl-8 pr-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Table Body */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-white/5">
                    <th className="py-3 px-5">Categoría Principal</th>
                    <th className="py-3 px-2">Cód. Catálogo</th>
                    <th className="py-3 px-2 text-right">Amb. 1</th>
                    <th className="py-3 px-2 text-right">Amb. 2</th>
                    <th className="py-3 px-2 text-right">Amb. 3</th>
                    <th className="py-3 px-2 text-right">Mesa</th>
                    <th className="py-3 px-2 text-right">Daño</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-center">Estado Operativo</th>
                    <th className="py-3 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredCategories.map(cat => (
                    <tr 
                      key={cat.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-300">
                            <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-white truncate text-xs">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[170px]">
                              {cat.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {cat.code}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                        {cat.amb1}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                        {cat.amb2}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                        {cat.amb3}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-semibold text-blue-600 dark:text-cyan-400">
                        {cat.mesa}
                      </td>
                      <td className="py-3.5 px-2 text-right font-mono font-semibold text-rose-600 dark:text-rose-400">
                        {cat.dano}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {cat.total}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cat.operationalPercentage > 95
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {cat.operationalPercentage}% OK
                          </span>
                          <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                            <div className="bg-emerald-500 h-full" style={{ width: `${cat.operationalPercentage}%` }}></div>
                            <div className="bg-blue-500 h-full" style={{ width: '3%' }}></div>
                            <div className="bg-rose-500 h-full" style={{ width: '2%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              onNavigate('inventario');
                              showToast(`Filtrando inventario por ${cat.name}...`, 'info');
                            }}
                            title="Escanear y Ver Seriales"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
                          </button>
                          <button
                            onClick={() => {
                              if (currentRole === 'consulta') {
                                showToast('403 | El rol Consulta no tiene permisos para transferir.', 'error');
                              } else {
                                openModal('movement');
                              }
                            }}
                            title="Mover o transferir"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">move_up</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3.5 px-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>Mostrando <strong className="text-slate-800 dark:text-slate-200">{filteredCategories.length}</strong> familias registradas</span>
                <span>•</span>
                <span>Total agrupado: <strong className="text-blue-600 dark:text-cyan-300 font-mono">1,482 activos</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Cálculo de sumatorias verificado en servidor</span>
              </div>
            </div>
          </div>

          {/* Quick Alert Notification Panel */}
          <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-300/70 dark:border-amber-500/30 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
              <span className="material-symbols-outlined text-[24px]">inventory</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h3 className="font-headline font-bold text-slate-900 dark:text-white text-sm">
                  Atención Requerida: Umbral Crítico en Sensores y Kits Arduino
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                  Acción Recomendada
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                El Taller de Electrónica (Ambiente 3) tiene 7 unidades catalogadas como no utilizables pendientes de reposición. El inventario remanente de sensores de ultrasonido HC-SR04 está en 14 unidades (Umbral mínimo del campus: 25 unidades).
              </p>
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <button
                  type="button"
                  onClick={() => showToast('Generando orden de adquisición y reposición...', 'success', 'shopping_cart_checkout')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Generar Orden de Reposición
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('mesa-de-servicio')}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-medium text-xs transition-colors"
                >
                  Consultar Dictamen Técnico
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Audit Log & Health Status (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Immutable Audit Activity Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 px-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
                  <h3 className="font-headline font-bold text-slate-900 dark:text-white text-sm">Últimos Movimientos</h3>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5">Bitácora de auditoría en vivo</span>
              </div>
              <button
                onClick={() => showToast('Actualizando log de trazabilidad con MariaDB...', 'info', 'refresh')}
                title="Refrescar auditoría"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>

            {/* Timeline Entries */}
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5 px-5 py-1">
              {movements.slice(0, 3).map((mov, idx) => (
                <div key={mov.id} className="py-3.5 flex items-start gap-3 group">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    mov.type === 'TRANSFER'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400'
                      : mov.type === 'OUT'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {mov.type === 'TRANSFER' ? 'swap_horiz' : mov.type === 'OUT' ? 'report_problem' : 'add_box'}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {mov.type === 'TRANSFER' ? 'Transferencia Aprobada' : mov.type === 'OUT' ? 'Salida por Daño Crítico' : 'Alta de Activos'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{mov.timestamp.split(' ')[1] || 'Reciente'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                      <strong className="text-slate-900 dark:text-white font-medium">{mov.productName}</strong> ({mov.originEnvironmentName} → {mov.destinationEnvironmentName}).
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-[10px]">
                      <span className="material-symbols-outlined text-[13px]">person</span>
                      <span>{mov.userName}</span>
                      <span>•</span>
                      <span className="font-mono text-blue-600 dark:text-cyan-400 font-semibold">{mov.folio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom button */}
            <div className="p-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => onNavigate('movimientos')}
                className="w-full py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-blue-600 dark:text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>Ver Toda la Bitácora de Auditoría</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Critical Asset Health Card with SVG Donut */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-headline font-bold text-slate-900 dark:text-white text-sm">
                  Salud de Equipos Críticos
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">Estado de disponibilidad general</span>
              </div>
              <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[22px]">health_and_safety</span>
            </div>

            {/* SVG Donut */}
            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="11" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="11" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="10.8" 
                    strokeLinecap="round" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#3b82f6" 
                    strokeWidth="11" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="244.9" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-headline text-2xl font-bold text-slate-900 dark:text-white">95.7%</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Operatividad</span>
                </div>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mb-1"></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Operativos</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">1,418</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mb-1"></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Mesa Serv.</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">38</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mb-1"></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Con Daño</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">26</span>
              </div>
            </div>

            {/* Server Pill */}
            <div className="p-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-cyan-400">cloud_done</span>
                <span>GoDaddy MySQL Shared</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                Sync OK
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
