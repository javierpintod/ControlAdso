import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditItem } from '../../types';

interface AuditViewProps {
  onNavigate: (view: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ onNavigate }) => {
  const { 
    auditItems, 
    verifyAssetInAudit, 
    openModal, 
    finalizeAuditSession, 
    showToast,
    currentRole 
  } = useApp();

  const [scanInput, setScanInput] = useState('');

  const total = auditItems.length;
  const verifiedCount = auditItems.filter((item: AuditItem) => item.status === 'verified').length;
  const discrepancyCount = auditItems.filter((item: AuditItem) => item.status === 'mismatch').length;
  const pendingCount = total - verifiedCount;
  const progressPercent = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const found = auditItems.find(
      (i: AuditItem) => i.serialNumber.toLowerCase() === scanInput.trim().toLowerCase() ||
           i.assetCode.toLowerCase() === scanInput.trim().toLowerCase()
    );

    if (found) {
      verifyAssetInAudit(found.serialNumber, found.station);
      setScanInput('');
      showToast(`¡Activo verificado in situ! ${found.name}`, 'success', 'verified');
    } else {
      showToast(`Serial ${scanInput} no hallado en la nómina de cotejo del ambiente.`, 'warning', 'search_off');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
              AUDIT-SESS-2025-01
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Auditoría Física In Situ Activa
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Cotejo Físico de Activos • Ambiente 1 (Lab Robótica)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Escaneo y verificación de seriales y puestos de trabajo contra el libro mayor institucional.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal('scanner')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Escanear con Cámara Óptica</span>
          </button>
          
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | El rol Consulta no tiene autorización para firmar actas.', 'error');
              } else {
                finalizeAuditSession();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Finalizar Acta Digital</span>
          </button>
        </div>
      </div>

      {/* Audit Progress Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-headline font-bold text-base text-slate-900 dark:text-white">
              Progreso de Verificación In Situ
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
              {progressPercent}% Completado
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {verifiedCount} Verificados
            </span>
            <span className="text-amber-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {pendingCount} Pendientes
            </span>
            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {discrepancyCount} Discrepancias
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div 
            style={{ width: `${progressPercent}%` }} 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500 shadow-sm"
          ></div>
        </div>
      </div>

      {/* Manual Quick Scan Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              barcode_reader
            </span>
            <input
              type="text"
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              placeholder="Ingresar o pistolear serial (ej. SN-8842-LAP) o código de activo..."
              className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">search_check</span>
            <span>Verificar Activo</span>
          </button>
        </form>
      </div>

      {/* Items Checklist Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 px-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
            Nómina de Activos Asignados al Ambiente
          </h2>
          <span className="text-xs text-slate-400">Total: {total} unidades a cotejar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                <th className="px-5 py-3">Estado Cotejo</th>
                <th className="px-4 py-3">Serial & Placa</th>
                <th className="px-4 py-3">Descripción del Activo</th>
                <th className="px-4 py-3">Puesto Asignado</th>
                <th className="px-4 py-3">Verificado Por</th>
                <th className="px-5 py-3 text-right">Acción In Situ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {auditItems.map((item: AuditItem) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    {item.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Verificado
                      </span>
                    ) : item.status === 'mismatch' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        Novedad
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                        Pendiente
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-xs">
                        {item.serialNumber}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {item.assetCode}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </td>

                  <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300">
                    {item.station}
                  </td>

                  <td className="px-4 py-3.5">
                    {item.verifiedBy ? (
                      <div className="flex flex-col">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                          {item.verifiedBy}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{item.verifiedAt}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Sin auditar</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    {item.status !== 'verified' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            verifyAssetInAudit(item.serialNumber, item.station);
                            showToast(`Activo ${item.serialNumber} confirmado`, 'success', 'check_circle');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                        >
                          Confirmar Puesto
                        </button>
                        <button
                          onClick={() => openModal('discrepancy', item)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Reportar novedad"
                        >
                          <span className="material-symbols-outlined text-[17px]">report_problem</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        Auditado OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
