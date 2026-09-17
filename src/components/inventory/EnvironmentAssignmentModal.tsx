import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SerialAsset, EnvironmentId } from '../../types';

interface EnvironmentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAssets: SerialAsset[];
}

export const EnvironmentAssignmentModal: React.FC<EnvironmentAssignmentModalProps> = ({
  isOpen,
  onClose,
  targetAssets
}) => {
  const { assignAssetEnvironment, assignBatchAssets, currentRole } = useApp();

  const [selectedEnv, setSelectedEnv] = useState<EnvironmentId>('amb1');
  const [stationName, setStationName] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Ing. Lucía Vargas Méndez');
  const [assignmentNotes, setAssignmentNotes] = useState('Asignación oficial para formación académica ADSO.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || targetAssets.length === 0) return null;

  const isBatch = targetAssets.length > 1;

  const handleEnvironmentChange = (env: EnvironmentId) => {
    setSelectedEnv(env);
    switch (env) {
      case 'amb1':
        setResponsiblePerson('Ing. Lucía Vargas Méndez (Líder Lab Robótica e IA)');
        setStationName(isBatch ? 'Puesto Lab IA' : 'Estación de Trabajo #04');
        break;
      case 'amb2':
        setResponsiblePerson('Prof. Carlos Mendoza (Custodio Aula Redes)');
        setStationName(isBatch ? 'Puesto Alumno' : 'Puesto #12');
        break;
      case 'amb3':
        setResponsiblePerson('Prof. Alex Arana (Instructor Electrónica)');
        setStationName(isBatch ? 'Banco de Trabajo' : 'Banco #02');
        break;
      case 'service':
        setResponsiblePerson('Mesa de Ayuda Técnica');
        setStationName('Bahía de Diagnóstico');
        break;
      case 'damaged':
        setResponsiblePerson('Almacenista General');
        setStationName('Estantería de Cuarentena');
        break;
      case 'unassigned':
        setResponsiblePerson('Almacén Central');
        setStationName('Depósito General');
        break;
    }
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    try {
      if (isBatch) {
        const ids = targetAssets.map(a => a.id);
        assignBatchAssets(ids, selectedEnv, stationName, responsiblePerson, assignmentNotes);
      } else {
        assignAssetEnvironment(
          targetAssets[0].id,
          selectedEnv,
          stationName,
          responsiblePerson,
          assignmentNotes
        );
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">meeting_room</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                {isBatch ? `Asignación Masiva a Ambiente (${targetAssets.length} Activos)` : 'Asignar Activo a Ambiente Físico'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registro oficial de traslado, custodio y estación de trabajo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Summary of Assets being assigned */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isBatch ? 'Activos Seleccionados para Asignar' : 'Ficha del Activo a Reasignar'}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400">
                {targetAssets.length} {targetAssets.length === 1 ? 'equipo' : 'equipos'}
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 space-y-1">
              {targetAssets.map(asset => (
                <div key={asset.id} className="pt-1 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {asset.placa ? `Placa ${asset.placa}` : asset.assetCode}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      {asset.modelo || asset.name}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      (SN: {asset.serial || asset.serialNumber})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 shrink-0 ml-2 font-mono">
                    {asset.valorIngreso || asset.category}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Environment */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Ambiente de Destino <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'amb1', name: 'Ambiente 1', desc: 'Lab Robótica e IA', icon: 'precision_manufacturing', color: 'blue' },
                  { id: 'amb2', name: 'Ambiente 2', desc: 'Aula Cómputo & Redes', icon: 'computer', color: 'emerald' },
                  { id: 'amb3', name: 'Ambiente 3', desc: 'Taller Electrónica', icon: 'bolt', color: 'amber' },
                  { id: 'service', name: 'Mesa Técnica', desc: 'Diagnóstico / Taller', icon: 'build', color: 'purple' },
                  { id: 'damaged', name: 'Almacén Daño', desc: 'Baja / Cuarentena', icon: 'report_problem', color: 'rose' },
                  { id: 'unassigned', name: 'Sin Asignar', desc: 'Depósito Central', icon: 'inventory_2', color: 'slate' }
                ].map(env => (
                  <button
                    key={env.id}
                    type="button"
                    onClick={() => handleEnvironmentChange(env.id as EnvironmentId)}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      selectedEnv === env.id
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-cyan-400">
                        {env.icon}
                      </span>
                      {selectedEnv === env.id && (
                        <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-cyan-400">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {env.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {env.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Station / Puesto */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {isBatch ? 'Prefijo de Puesto / Estación' : 'Puesto / Estación Específica'}
              </label>
              <input
                type="text"
                value={stationName}
                onChange={e => setStationName(e.target.value)}
                placeholder={isBatch ? 'Ej: Puesto Alumno' : 'Ej: Estación de Trabajo #05'}
                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {isBatch ? 'Se numerará automáticamente (#1, #2, #3...)' : 'Identificador físico dentro del ambiente'}
              </span>
            </div>

            {/* Responsible Person */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Funcionario Custodio Responsable <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={responsiblePerson}
                onChange={e => setResponsiblePerson(e.target.value)}
                placeholder="Nombre del instructor o custodio"
                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Motivo u Observación de la Asignación
              </label>
              <textarea
                rows={2}
                value={assignmentNotes}
                onChange={e => setAssignmentNotes(e.target.value)}
                placeholder="Indique el proyecto formativo, orden de traslado o acta de entrega..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            disabled={isSubmitting || currentRole === 'consulta'}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            <span>Confirmar Asignación de Ambiente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
