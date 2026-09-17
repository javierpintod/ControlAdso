import React from 'react';
import { useApp } from '../../context/AppContext';

interface ReportsViewProps {
  onNavigate: (view: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onNavigate }) => {
  const { currentCampus, categories, movements, assets, showToast } = useApp();

  const handlePrint = () => {
    showToast('Preparando informe formal para impresión o guardado en PDF...', 'info', 'print');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
      
      {/* Screen Controls Header (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
              DOC-AUD-2025
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Módulo de Reportes Ejecutivos & Auditoría
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Informe Oficial de Inventario Patrimonial
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Vista previa del documento oficial foliado listo para impresión o exportación digital PDF.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimir / Exportar a PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 Letter Aesthetic) */}
      <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl p-8 sm:p-12 shadow-md flex flex-col gap-8">
        
        {/* Document Header */}
        <div className="flex items-start justify-between border-b pb-6 border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              <span className="material-symbols-outlined text-[28px]">account_balance</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg leading-none">
                EduStock • Gestión de Activos Académicos
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentCampus.name}
              </span>
              <span className="font-mono text-[11px] text-slate-400">NIT: 899.999.034-1 • Dirección de Tecnologías</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs font-bold text-blue-700 dark:text-cyan-300">
              ACTA #INF-2025-0894
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fecha de Emisión: 17 de Septiembre de 2025
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Certificación Criptográfica SHA-256 OK
            </span>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/5 text-xs text-center">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold">Total Existencias</span>
            <p className="font-headline font-bold text-xl text-slate-900 dark:text-white mt-0.5">1,482</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold">Operatividad</span>
            <p className="font-headline font-bold text-xl text-emerald-600 dark:text-emerald-400 mt-0.5">95.7%</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold">Mesa de Servicio</span>
            <p className="font-headline font-bold text-xl text-blue-600 dark:text-blue-400 mt-0.5">38</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-semibold">Daño / RAEE</span>
            <p className="font-headline font-bold text-xl text-rose-600 dark:text-rose-400 mt-0.5">26</p>
          </div>
        </div>

        {/* Categories Distribution Table */}
        <div className="flex flex-col gap-2">
          <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            1. Desglose Patrimonial por Familias y Ambientes Físicos
          </h3>
          <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-white/10">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                <th className="p-2.5 border border-slate-200 dark:border-white/10">Familia / Categoría</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10">Código</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10 text-right">Amb. 1</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10 text-right">Amb. 2</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10 text-right">Amb. 3</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10 text-right">Mesa</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10 text-right">Daño</th>
                <th className="p-2.5 border border-slate-200 dark:border-white/10 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td className="p-2 border border-slate-200 dark:border-white/10 font-semibold">{c.name}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 font-mono text-[11px]">{c.code}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 text-right font-mono">{c.amb1}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 text-right font-mono">{c.amb2}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 text-right font-mono">{c.amb3}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 text-right font-mono">{c.mesa}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 text-right font-mono">{c.dano}</td>
                  <td className="p-2 border border-slate-200 dark:border-white/10 text-right font-mono font-bold">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legal Signatures */}
        <div className="pt-12 grid grid-cols-2 gap-12 text-xs text-center border-t border-slate-200 dark:border-white/10">
          <div className="flex flex-col items-center">
            <div className="w-48 border-b border-slate-400 mb-2"></div>
            <span className="font-bold">Ing. Carlos Mendoza</span>
            <span className="text-slate-500 text-[11px]">Administrador General de Inventarios (RBAC)</span>
            <span className="font-mono text-[10px] text-slate-400 mt-1">Hash SHA-256: 7f8a9b1c2d3e4f5a</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-48 border-b border-slate-400 mb-2"></div>
            <span className="font-bold">Dra. Carmen Morales</span>
            <span className="text-slate-500 text-[11px]">Auditora Externa de Control Patrimonial</span>
            <span className="font-mono text-[10px] text-slate-400 mt-1">Registro Profesional: COL-AUD-9921</span>
          </div>
        </div>

      </div>

    </div>
  );
};
