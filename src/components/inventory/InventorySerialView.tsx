import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SerialAsset, EnvironmentId, AssetPhysicalStatus } from '../../types';
import { EnvironmentAssignmentModal } from './EnvironmentAssignmentModal';
import { ImportInstitutionalModal } from './ImportInstitutionalModal';

interface InventorySerialViewProps {
  onNavigate: (view: string) => void;
}

export const InventorySerialView: React.FC<InventorySerialViewProps> = ({ onNavigate }) => {
  const { 
    assets, 
    selectedAsset, 
    setSelectedAsset, 
    openModal, 
    showToast,
    exportData,
    currentRole 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modales de Asignación y Carga
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [targetAssetsForModal, setTargetAssetsForModal] = useState<SerialAsset[]>([]);

  const filteredAssets = assets.filter(a => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      a.serialNumber.toLowerCase().includes(q) ||
      a.assetCode.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.placa && a.placa.toLowerCase().includes(q)) ||
      (a.serial && a.serial.toLowerCase().includes(q)) ||
      (a.modelo && a.modelo.toLowerCase().includes(q)) ||
      (a.consecutivo && a.consecutivo.toLowerCase().includes(q)) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(q));
    
    const matchesEnv = envFilter === 'all' || a.environmentId === envFilter;
    const matchesStatus = statusFilter === 'all' || a.physicalStatus === statusFilter;

    return matchesSearch && matchesEnv && matchesStatus;
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAssets.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: AssetPhysicalStatus) => {
    switch (status) {
      case 'operativo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-300/50 dark:border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Operativo en Uso
          </span>
        );
      case 'mesa_servicio':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-[11px] border border-blue-300/50 dark:border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            En Mesa de Servicio
          </span>
        );
      case 'con_dano':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-[11px] border border-rose-300/50 dark:border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Con Daño Físico
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
            Mantenimiento
          </span>
        );
    }
  };

  const activeFocusAsset = selectedAsset || assets[0];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
              MOD-INV-SER-2024
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Base de Datos de Activos Únicos
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Inventario Detallado por Serial Único
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Control individual de activos con número de serie, ambiente físico asignado, estado de daño y mesa de servicio.
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">upload_file</span>
            <span>Cargar Registro Institucional (TSV)</span>
          </button>
          <button
            onClick={() => {
              if (selectedIds.length > 0) {
                const sel = assets.filter(a => selectedIds.includes(a.id));
                setTargetAssetsForModal(sel);
              } else {
                setTargetAssetsForModal([activeFocusAsset]);
              }
              setIsAssignModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300/60 dark:border-blue-500/30 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 text-xs font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">meeting_room</span>
            <span>Asignar a Ambiente {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
          </button>
          <button
            onClick={() => exportData('excel', envFilter)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[17px] text-emerald-600">table_view</span>
            <span>Exportar Selección</span>
          </button>
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | El rol Consulta no puede transferir activos.', 'error');
              } else {
                openModal('movement');
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-blue-700 dark:text-cyan-300 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">sync_alt</span>
            <span>Transferir Serial</span>
          </button>
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | Solo administradores pueden registrar nuevos seriales.', 'error');
              } else {
                showToast('Iniciando catalogación de serial físico con generador QR...', 'info');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Registrar Serial / Activo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Serializados</span>
            <span className="material-symbols-outlined text-[20px] text-blue-600 dark:text-cyan-400">qr_code_2</span>
          </div>
          <div className="my-2">
            <span className="font-headline text-2xl font-bold text-slate-900 dark:text-white">1,482</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <span>+12 nuevos este ciclo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Operativos en Aula</span>
            <span className="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
          </div>
          <div className="my-2">
            <span className="font-headline text-2xl font-bold text-emerald-600 dark:text-emerald-400">1,421</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[95.8%] rounded-full"></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">En Mesa de Servicio</span>
            <span className="material-symbols-outlined text-[20px] text-blue-500">support_agent</span>
          </div>
          <div className="my-2">
            <span className="font-headline text-2xl font-bold text-blue-600 dark:text-blue-400">43</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            <span>8 en cola diagnóstico</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Con Daño Crítico</span>
            <span className="material-symbols-outlined text-[20px] text-rose-500">report_problem</span>
          </div>
          <div className="my-2">
            <span className="font-headline text-2xl font-bold text-rose-600 dark:text-rose-400">18</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
            <span>En Almacén de Daño</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              qr_code_scanner
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por Serial (ej. SN-8842-LAP), Placa o Nombre..."
              className="w-full h-10 pl-10 pr-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded text-slate-400 font-mono text-[9px] border border-slate-200 dark:border-white/10">
                Enter ↵
              </kbd>
            </div>
          </div>
          <button
            onClick={() => onNavigate('escanear')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">barcode_reader</span>
            <span>Lector / Cámara</span>
          </button>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Ambiente / Ubicación
            </label>
            <select
              value={envFilter}
              onChange={e => setEnvFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los Ambientes</option>
              <option value="amb1">Ambiente 1: Lab Robótica e IA</option>
              <option value="amb2">Ambiente 2: Aula Cómputo</option>
              <option value="amb3">Ambiente 3: Electrónica</option>
              <option value="service">Mesa de Servicio</option>
              <option value="damaged">Almacén de Daño</option>
              <option value="unassigned">Sin Asignar (Pendientes de Reubicación)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Estado Físico del Activo
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los Estados</option>
              <option value="operativo">Operativo en Uso</option>
              <option value="mesa_servicio">En Mesa de Servicio</option>
              <option value="con_dano">Con Daño Físico</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setEnvFilter('all');
                setStatusFilter('all');
                showToast('Filtros reiniciados');
              }}
              className="w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              <span>Limpiar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Table (8 cols) + Side Inspector (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Serial Items Table */}
        <div className="xl:col-span-8 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredAssets.length && filteredAssets.length > 0}
                  onChange={e => toggleSelectAll(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Seleccionar todos ({filteredAssets.length})</span>
              </label>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedIds.length} seleccionados
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={() => {
                    const sel = assets.filter(a => selectedIds.includes(a.id));
                    setTargetAssetsForModal(sel);
                    setIsAssignModalOpen(true);
                  }}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">meeting_room</span>
                  <span>Asignar {selectedIds.length} a Ambiente</span>
                </button>
              )}
              <button
                onClick={() => showToast('Imprimiendo etiquetas GS1-128 con código QR...', 'info', 'print')}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">qr_code</span>
                <span>Imprimir Etiquetas</span>
              </button>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="px-4 py-3">Placa & Serial</th>
                  <th className="px-4 py-3">Descripción & Modelo</th>
                  <th className="px-4 py-3">Ubicación / Ambiente</th>
                  <th className="px-4 py-3 text-center">Estado Físico</th>
                  <th className="px-4 py-3">Responsable & Puesto</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredAssets.map(asset => {
                  const isChecked = selectedIds.includes(asset.id);
                  const isFocused = activeFocusAsset.id === asset.id;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`cursor-pointer transition-colors ${
                        isFocused
                          ? 'bg-blue-50/80 dark:bg-blue-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-white/5'
                      }`}
                    >
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(asset.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                            <span className="material-symbols-outlined text-[18px]">qr_code</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-xs">
                              {asset.placa ? `Placa ${asset.placa}` : asset.assetCode}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                              SN: {asset.serial || asset.serialNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col min-w-[160px]">
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {asset.modelo ? `${asset.descripcion || asset.name} - ${asset.modelo}` : asset.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            {asset.centroCosto && (
                              <span className="font-mono px-1 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">
                                CC: {asset.centroCosto}
                              </span>
                            )}
                            {asset.consecutivo && (
                              <span className="font-mono text-slate-400">
                                #{asset.consecutivo}
                              </span>
                            )}
                            {asset.valorIngreso && (
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                {asset.valorIngreso}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        {asset.environmentId === 'unassigned' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium text-[11px] border border-amber-300/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>Sin Asignar</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                            <span className="material-symbols-outlined text-[13px] text-blue-600 dark:text-cyan-400">meeting_room</span>
                            <span className="truncate max-w-[130px]">{asset.environmentName.split(':')[0]}</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        {getStatusBadge(asset.physicalStatus)}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-white text-[11px]">
                            {asset.responsiblePerson}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {asset.station}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setTargetAssetsForModal([asset]);
                              setIsAssignModalOpen(true);
                            }}
                            title="Asignar a Ambiente"
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10"
                          >
                            <span className="material-symbols-outlined text-[17px]">meeting_room</span>
                          </button>
                          <button
                            onClick={() => setSelectedAsset(asset)}
                            title="Ver Trazabilidad"
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10"
                          >
                            <span className="material-symbols-outlined text-[17px]">history</span>
                          </button>
                          <button
                            onClick={() => {
                              if (currentRole === 'consulta') {
                                showToast('403 | El rol Consulta no tiene permisos para transferir.', 'error');
                              } else {
                                openModal('movement');
                              }
                            }}
                            title="Transferir a otro ambiente"
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/10"
                          >
                            <span className="material-symbols-outlined text-[17px]">sync_alt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-3 px-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Mostrando <strong>{filteredAssets.length}</strong> de <strong>{assets.length}</strong> activos registrados</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 rounded bg-blue-600 text-white font-mono font-bold text-xs">1</span>
            </div>
          </div>
        </div>

        {/* Lateral Inspector: Trazabilidad Inmutable */}
        <div className="xl:col-span-4 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs p-5 gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[20px]">timeline</span>
              <span className="font-headline font-bold text-sm text-slate-900 dark:text-white">Trazabilidad Inmutable</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300/50">
              AUDITADO OK
            </span>
          </div>

          {/* Asset in Focus Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              <img
                src={activeFocusAsset.photoUrl}
                alt={activeFocusAsset.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                  {activeFocusAsset.placa ? `Placa ${activeFocusAsset.placa}` : activeFocusAsset.assetCode}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  SN: {activeFocusAsset.serial || activeFocusAsset.serialNumber}
                </span>
              </div>
              <span className="font-semibold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                {activeFocusAsset.modelo || activeFocusAsset.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeFocusAsset.station} • {activeFocusAsset.environmentName}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Garantía hasta: {activeFocusAsset.warrantyUntil}
              </span>
            </div>
          </div>

          {/* Institutional Record Block */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Ficha Técnica Institucional (SENA)
              </span>
              {activeFocusAsset.valorIngreso && (
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {activeFocusAsset.valorIngreso}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-white/5">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Regional / Centro</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {activeFocusAsset.regional || '41'} • CC {activeFocusAsset.centroCosto || '952710'}
                </span>
              </div>
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-white/5">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Módulo / Consecutivo</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {activeFocusAsset.modulo || 'INVE'} • #{activeFocusAsset.consecutivo || '297419'}
                </span>
              </div>
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-white/5">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Fecha Adquisición</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {activeFocusAsset.fechaAdquisicion || activeFocusAsset.assignedDate}
                </span>
              </div>
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-white/5">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Tipo Elemento</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {activeFocusAsset.tipo || 'Devolutivo'}
                </span>
              </div>
            </div>

            {activeFocusAsset.descripcionActual && (
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {activeFocusAsset.descripcionActual}
              </div>
            )}

            <button
              onClick={() => {
                setTargetAssetsForModal([activeFocusAsset]);
                setIsAssignModalOpen(true);
              }}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">meeting_room</span>
              <span>Reasignar a un Ambiente Físico</span>
            </button>
          </div>

          {/* Timeline of events */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Historial de Eventos del Serial
            </span>

            <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              {activeFocusAsset.historyTimeline.length > 0 ? (
                activeFocusAsset.historyTimeline.map((item, idx) => (
                  <div key={item.id} className="relative group">
                    <span className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs ${
                      idx === 0 ? 'bg-blue-600 dark:bg-cyan-400' : 'bg-slate-400'
                    }`}></span>
                    <div className="flex flex-col text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white text-[11px]">
                          {item.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <span className="material-symbols-outlined text-[12px]">person</span>
                        <span>{item.author}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic py-2">
                  Alta inicial registrada en catálogo central. Sin incidencias reportadas.
                </div>
              )}
            </div>
          </div>

          {/* Quick Drawer Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
            <button
              onClick={() => showToast(`Descargando Ficha Técnica PDF para ${activeFocusAsset.serialNumber}...`, 'info', 'picture_as_pdf')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Descargar Hoja de Vida (PDF)</span>
            </button>
            <button
              onClick={() => showToast(`Editando especificaciones para ${activeFocusAsset.serialNumber}`, 'info', 'edit_square')}
              className="w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit_square</span>
              <span>Editar Especificaciones Técnicas</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modales de Asignación e Importación Institucional */}
      <EnvironmentAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setTargetAssetsForModal([]);
          setSelectedIds([]);
        }}
        targetAssets={targetAssetsForModal}
      />

      <ImportInstitutionalModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

    </div>
  );
};
