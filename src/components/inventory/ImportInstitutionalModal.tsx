import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnvironmentId } from '../../types';
import { parseTSVInventory, RawInventoryRow } from '../../data/institutionalAssets';

interface ImportInstitutionalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportInstitutionalModal: React.FC<ImportInstitutionalModalProps> = ({
  isOpen,
  onClose
}) => {
  const { importInstitutionalBatch, currentRole } = useApp();

  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<RawInventoryRow[]>([]);
  const [targetEnv, setTargetEnv] = useState<EnvironmentId>('unassigned');
  const [isParsed, setIsParsed] = useState(false);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    const rows = parseTSVInventory(rawText);
    setParsedRows(rows);
    setIsParsed(true);
  };

  const handleImport = () => {
    if (parsedRows.length === 0) return;
    importInstitutionalBatch(parsedRows, targetEnv === 'all' ? undefined : targetEnv);
    onClose();
  };

  const sampleTemplate = `41\t952710\tINVE\tPROBOOK 445R G6\t297419\tCOMPUTADOR PORTATIL\tTIPO ELEMENTO DEVOLUTIVO UNIDAD DE MEDIDA UNIDAD PROCESADOR AMD RYZEN 7\t4\t95271024071\t5CD0037S7T\t08/06/2020\t$1.766.042,14`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Importación de Registro Institucional de Activos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pega directamente la estructura de 12 columnas para asignar equipos a cada ambiente
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
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-cyan-400 shrink-0">info</span>
              <span>Columnas admitidas: <strong>Regional, Centro de Costo, Módulo, Modelo, Consecutivo, Descripción, Ficha Técnica, Tipo, Placa, Serial, Fecha, Valor</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setRawText(sampleTemplate)}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-cyan-300 font-mono text-[11px] font-semibold hover:bg-blue-50 shrink-0"
            >
              Cargar Fila de Ejemplo
            </button>
          </div>

          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pegar Texto Tabulado o CSV del Inventario
              </label>
              {parsedRows.length > 0 && (
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {parsedRows.length} filas detectadas
                </span>
              )}
            </div>
            <textarea
              rows={6}
              value={rawText}
              onChange={e => {
                setRawText(e.target.value);
                setIsParsed(false);
              }}
              placeholder="Pega aquí los registros copiados de Excel o Supabase..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleParse}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">rule</span>
                <span>Procesar y Validar Datos</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                Asignar de inmediato a:
              </label>
              <select
                value={targetEnv}
                onChange={e => setTargetEnv(e.target.value as EnvironmentId)}
                className="h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unassigned">Sin Asignar (Asignar manualmente luego)</option>
                <option value="amb1">Ambiente 1: Lab Robótica e IA</option>
                <option value="amb2">Ambiente 2: Aula Cómputo & Redes</option>
                <option value="amb3">Ambiente 3: Taller de Electrónica</option>
                <option value="service">Mesa de Servicio Técnico</option>
                <option value="damaged">Almacén de Daño</option>
              </select>
            </div>
          </div>

          {/* Preview Table */}
          {isParsed && parsedRows.length > 0 && (
            <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Vista Previa de Importación ({parsedRows.length} activos)</span>
                <span className="text-emerald-600 font-mono text-[11px]">Validación Correcta</span>
              </div>
              <div className="max-h-52 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 sticky top-0 font-semibold">
                    <tr>
                      <th className="p-2">Placa SENA</th>
                      <th className="p-2">Serial</th>
                      <th className="p-2">Modelo</th>
                      <th className="p-2">Descripción</th>
                      <th className="p-2">Centro Costo</th>
                      <th className="p-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {parsedRows.slice(0, 10).map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-2 font-mono font-bold text-blue-600 dark:text-cyan-400">{r.placa}</td>
                        <td className="p-2 font-mono text-slate-600 dark:text-slate-300">{r.serial}</td>
                        <td className="p-2 font-semibold text-slate-900 dark:text-white">{r.modelo}</td>
                        <td className="p-2 text-slate-500 truncate max-w-xs">{r.descripcion}</td>
                        <td className="p-2 font-mono text-slate-500">{r.centroCosto}</td>
                        <td className="p-2 font-mono text-slate-600 dark:text-slate-300">{r.valorIngreso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 10 && (
                <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-white/5">
                  ... y {parsedRows.length - 10} filas adicionales listas para incorporar
                </div>
              )}
            </div>
          )}

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
            disabled={parsedRows.length === 0 || currentRole === 'consulta'}
            onClick={handleImport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Importar e Incorporar {parsedRows.length} Activos</span>
          </button>
        </div>

      </div>
    </div>
  );
};
