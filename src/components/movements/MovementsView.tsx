import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MovementType } from '../../types';

interface MovementsViewProps {
  onNavigate: (view: string) => void;
}

export const MovementsView: React.FC<MovementsViewProps> = ({ onNavigate }) => {
  const { movements, openModal, showToast, currentRole } = useApp();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = movements.filter(m => {
    const matchesType = filterType === 'ALL' || m.type === filterType;
    const matchesSearch = 
      m.folio.toLowerCase().includes(search.toLowerCase()) ||
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.userName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
              LOG-CUSTODIA-2025
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Bitácora de Trazabilidad Criptográfica
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Movimientos y Actas de Custodia Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Registro inmutable de traslados, ingresos y salidas con hash SHA-256 y token QR.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (currentRole === 'consulta') {
                showToast('403 | El rol Consulta no puede registrar movimientos.', 'error');
              } else {
                openModal('movement');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            <span>Nuevo Movimiento de Stock</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por folio (#ACT-TRF...), activo o custodio..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="TRANSFER">Transferencias Inter-Ambientes</option>
            <option value="IN">Ingreso / Alta de Stock</option>
            <option value="OUT">Salida / Baja / Daño</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                <th className="px-5 py-3">Folio Oficial</th>
                <th className="px-4 py-3">Tipo Movimiento</th>
                <th className="px-4 py-3">Activo / Serial</th>
                <th className="px-4 py-3">Origen → Destino</th>
                <th className="px-4 py-3">Custodio Responsable</th>
                <th className="px-4 py-3">Fecha / Hora</th>
                <th className="px-5 py-3 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {m.folio}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.type === 'TRANSFER'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300'
                        : m.type === 'IN'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                    }`}>
                      {m.type === 'TRANSFER' ? 'Transferencia' : m.type === 'IN' ? 'Ingreso' : 'Salida/Baja'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white">{m.productName}</span>
                      <span className="font-mono text-[10px] text-slate-400">Cant: {m.quantity} ud</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <span>{m.originEnvironmentName}</span>
                      <span className="material-symbols-outlined text-[13px] text-blue-600 dark:text-cyan-400">arrow_forward</span>
                      <span className="font-semibold">{m.destinationEnvironmentName}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{m.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.userRole}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                    {m.timestamp}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        showToast(`Cargando acta oficial ${m.folio}...`, 'info');
                        openModal('transfer-voucher');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px] text-blue-600 dark:text-cyan-400">verified</span>
                      <span>Ver Acta</span>
                    </button>
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
