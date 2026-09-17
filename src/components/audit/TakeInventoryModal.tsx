import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhysicalInventorySchedule, SerialAsset } from '../../types';

interface TakeInventoryModalProps {
  schedule: PhysicalInventorySchedule | null;
  onClose: () => void;
}

export const TakeInventoryModal: React.FC<TakeInventoryModalProps> = ({ schedule, onClose }) => {
  const { assets, completePhysicalInventory, currentUser, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');

  if (!schedule) return null;

  // Filter assets in this environment
  const envAssets = assets.filter(
    (a: SerialAsset) => a.environmentId === schedule.environmentId || 
      (schedule.environmentId === 'amb1' && (a.environmentName?.includes('Ambiente 1') || a.environmentName?.includes('Robótica'))) ||
      (schedule.environmentId === 'amb2' && (a.environmentName?.includes('Ambiente 2') || a.environmentName?.includes('Cómputo') || a.environmentName?.includes('Redes'))) ||
      (schedule.environmentId === 'amb3' && (a.environmentName?.includes('Ambiente 3') || a.environmentName?.includes('Electrónica'))) ||
      (schedule.environmentId === 'service' && (a.environmentName?.includes('Servicio') || a.environmentName?.includes('Mesa'))) ||
      (schedule.environmentId === 'damaged' && (a.environmentName?.includes('Dañados') || a.environmentName?.includes('Bajas')))
  );

  // Default to initial selection of all if not tracked
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(() => new Set());

  const toggleVerify = (id: string) => {
    setVerifiedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleVerifyAll = () => {
    const allIds = new Set(envAssets.map(a => a.id));
    setVerifiedIds(allIds);
    showToast(`Todos los ${envAssets.length} activos del ambiente marcados como verificados`, 'info', 'done_all');
  };

  const handleClearAll = () => {
    setVerifiedIds(new Set());
  };

  const filteredAssets = envAssets.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      (a.serialNumber || '').toLowerCase().includes(term) ||
      (a.assetCode || '').toLowerCase().includes(term) ||
      (a.placa || '').toLowerCase().includes(term) ||
      (a.serial || '').toLowerCase().includes(term) ||
      (a.name || '').toLowerCase().includes(term) ||
      (a.station || '').toLowerCase().includes(term)
    );
  });

  const verifiedCount = verifiedIds.size;
  const totalCount = envAssets.length > 0 ? envAssets.length : schedule.totalItems;
  const progressPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifiedCount === 0 && totalCount > 0) {
      if (!window.confirm('No has verificado ningún activo. ¿Deseas certificar la toma física con 0 activos verificados?')) {
        return;
      }
    }

    completePhysicalInventory(
      schedule.id,
      verifiedCount,
      notes || `Toma física presencial realizada para el turno ${schedule.shiftLabel}. ${verifiedCount}/${totalCount} activos cotejados por ${currentUser.name || schedule.instructorName}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center border border-blue-500/20 shrink-0">
              <span className="material-symbols-outlined text-2xl">checklist_rtl</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                  {schedule.shiftLabel}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Plazo límite: {schedule.deadlineTime}
                </span>
              </div>
              <h2 className="font-headline font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                Toma Física: {schedule.environmentName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Instructor & Shift Info Banner */}
        <div className="px-6 py-3 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[18px]">person_check</span>
            <span>
              <strong>Instructor Asignado:</strong> {schedule.instructorName} ({schedule.instructorEmail})
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span><strong>Registrando como:</strong> {currentUser.name}</span>
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 dark:border-cyan-400 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white shrink-0">
              {progressPct}%
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                {verifiedCount} de {totalCount} Activos Verificados
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalCount - verifiedCount > 0 ? `${totalCount - verifiedCount} bienes pendientes de cotejo` : '¡Todos los bienes cotejados!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleVerifyAll}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              <span>Marcar Todos OK</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Desmarcar
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por placa, serial, modelo o puesto de trabajo..."
              className="w-full h-9 pl-9 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Assets List */}
        <div className="flex-1 overflow-y-auto max-h-[340px] divide-y divide-slate-100 dark:divide-white/5">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No se encontraron activos para los criterios especificados.
            </div>
          ) : (
            filteredAssets.map(asset => {
              const isChecked = verifiedIds.has(asset.id);
              return (
                <div
                  key={asset.id}
                  onClick={() => toggleVerify(asset.id)}
                  className={`p-3.5 px-5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100/50'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                          {asset.serial || asset.serialNumber}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          Placa: {asset.placa || asset.assetCode}
                        </span>
                        {asset.station && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-medium">
                            {asset.station}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                        {asset.modelo || asset.descripcion || asset.name}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                        <span>Resp: {asset.responsiblePerson || 'Instructor a cargo'}</span>
                        {asset.valorIngreso && <span>Valor: {asset.valorIngreso}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isChecked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        Verificado
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Notes & Footer */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones de la Toma Física (Opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej. Todos los equipos se encuentran en sus estaciones operativas sin novedad."
              className="w-full h-10 px-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Firmar y Certificar Toma Física</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
