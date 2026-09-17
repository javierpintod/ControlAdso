import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DiscrepancyModal: React.FC = () => {
  const { activeModal, closeModal, reportAuditDiscrepancy } = useApp();
  const [assetId, setAssetId] = useState('aud-5');
  const [reason, setReason] = useState('Traslado no documentado a otro recinto');
  const [notes, setNotes] = useState('No localizado en banco de trabajo asignado. Posible préstamo sin boleta.');

  if (activeModal !== 'discrepancy') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportAuditDiscrepancy(assetId, `${reason}: ${notes}`);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-2xl shadow-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <span className="material-symbols-outlined text-[24px]">report_problem</span>
            <h3 className="font-headline font-bold text-base">Reportar Novedad en Auditoría</h3>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Registrando discrepancia para activo en toma física in situ.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tipo de Incidencia / Hallazgo:
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option>Traslado no documentado a otro recinto</option>
              <option>Elemento con daño físico aparente</option>
              <option>Placa desprendida / Código QR ilegible</option>
              <option>Ausente sin justificación (Faltante crítico)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Observaciones del Auditor:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Detalle ubicación probable o persona observada..."
              className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-md"
            >
              Registrar en Acta
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
