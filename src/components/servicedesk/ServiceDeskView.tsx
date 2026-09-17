import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketResolutionType } from '../../types';

interface ServiceDeskViewProps {
  onNavigate: (view: string) => void;
}

export const ServiceDeskView: React.FC<ServiceDeskViewProps> = ({ onNavigate }) => {
  const { 
    ticket, 
    resolveServiceDeskTicket, 
    openModal, 
    currentRole, 
    showToast 
  } = useApp();

  const [selectedResolution, setSelectedResolution] = useState<TicketResolutionType>('BAJA');
  const [resolutionNotes, setResolutionNotes] = useState(
    'Se aprueba la baja definitiva del activo por inviabilidad económica de reparación según dictamen técnico #DT-2025-089. El equipo se transfiere al Almacén de Desechos / RAEE.'
  );

  const handleExecuteResolution = () => {
    if (currentRole === 'consulta') {
      showToast('403 | El rol Consulta (solo lectura) no tiene privilegios para resolver tickets ni modificar existencias.', 'error', 'lock');
      return;
    }

    resolveServiceDeskTicket(ticket.id, selectedResolution, resolutionNotes);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold">
              {ticket.folio}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Módulo de Diagnóstico & Reparación • Mesa de Ayuda Institucional
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Resolución Técnica: {ticket.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Flujo formal de recepción técnica, diagnóstico pericial y resolución con retorno o baja definitiva.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Stepper Header (4 Steps matching image 6) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Paso 1 • Completado</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Recepción & Registro</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Paso 2 • Completado</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Diagnóstico Pericial</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md ring-4 ring-blue-500/20 animate-pulse">
              3
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Paso 3 • En Curso</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Decisión Reparar / Baja</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paso 4 • Pendiente</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cierre & Acta Digital</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Asset & Evidence File (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Asset Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[20px]">devices</span>
                <span className="font-headline font-bold text-sm text-slate-900 dark:text-white">Activo en Diagnóstico</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold">
                ESTADO: DAÑADO
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80"
                  alt="Monitor dañado"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1 text-xs">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{ticket.assetName}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-blue-600 dark:text-cyan-400 font-semibold">{ticket.serialNumber}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-mono text-slate-500">{ticket.assetCode}</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  {ticket.environmentName}
                </span>
              </div>
            </div>

            {/* Reporter details */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Reportado por:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.reporterName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Fecha del Incidente:
                </span>
                <span className="font-mono">{ticket.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Photo Evidence with Lightbox Trigger */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500 text-[18px]">photo_camera</span>
                Evidencia Fotográfica In Situ
              </span>
              <span className="text-[10px] font-mono text-slate-400">{ticket.evidenceSize}</span>
            </div>

            {/* Clickable Image Preview */}
            <div 
              onClick={() => openModal('evidence-lightbox')}
              className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 cursor-pointer group shadow-inner border border-slate-200 dark:border-white/10"
            >
              <img
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80"
                alt="Evidencia daño pantalla"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <div className="flex items-center justify-between w-full text-white text-xs">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-cyan-400">zoom_in</span>
                    <span>Ampliar Fotografía</span>
                  </span>
                  <span className="font-mono text-[10px] opacity-80">EXIF Verificado</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[13px] text-emerald-500">my_location</span>
              <span>{ticket.evidencePhotoGps}</span>
            </p>
          </div>

          {/* Technical Diagnostics Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <span className="font-headline font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">engineering</span>
              Dictamen Pericial del Técnico
            </span>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <p>
                <strong>Diagnóstico:</strong> {ticket.diagnosticNotes}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-amber-200 dark:border-amber-500/20 text-[11px]">
                <span>Costo Estimado de Reparación:</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">{ticket.repairCostEstimate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
              <span>Diagnóstico firmado digitalmente por: {ticket.technicianName}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Decision & Resolution Options (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
            <div>
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Seleccionar Vía de Resolución Técnica
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                La decisión impacta directamente las existencias operativas y genera el acta correspondiente.
              </p>
            </div>

            {/* 3 Interactive Cards */}
            <div className="flex flex-col gap-3">
              
              {/* Option A: Reparar y Retornar */}
              <label 
                onClick={() => setSelectedResolution('REPARAR_RETORNAR')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedResolution === 'REPARAR_RETORNAR'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-cyan-400 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="ticket_resolution"
                  checked={selectedResolution === 'REPARAR_RETORNAR'}
                  onChange={() => setSelectedResolution('REPARAR_RETORNAR')}
                  className="mt-1 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      A. Reparación Aprobada & Retorno a Aula
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-bold text-[10px]">
                      RETORNO
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Se procede con el reemplazo de componentes en taller y el monitor vuelve al Ambiente 2 (Aula Cómputo) con estado 100% operativo.
                  </p>
                </div>
              </label>

              {/* Option B: Garantía Proveedor */}
              <label 
                onClick={() => setSelectedResolution('GARANTIA_EXTERNA')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedResolution === 'GARANTIA_EXTERNA'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 dark:border-cyan-400 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="ticket_resolution"
                  checked={selectedResolution === 'GARANTIA_EXTERNA'}
                  onChange={() => setSelectedResolution('GARANTIA_EXTERNA')}
                  className="mt-1 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      B. Tramitación de Garantía con Fabricante (Dell)
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                      EXTERNO
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    El activo es retirado temporalmente de las instalaciones bajo guía de remisión oficial a la espera de reemplazo por Dell Support.
                  </p>
                </div>
              </label>

              {/* Option C: Baja Definitiva (RAEE) */}
              <label 
                onClick={() => setSelectedResolution('BAJA')}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedResolution === 'BAJA'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-600 dark:border-rose-500 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="ticket_resolution"
                  checked={selectedResolution === 'BAJA'}
                  onChange={() => setSelectedResolution('BAJA')}
                  className="mt-1 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-rose-700 dark:text-rose-400">
                      C. Baja Definitiva del Inventario (Acta de Desecho)
                    </span>
                    <span className="px-2 py-0.2 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                      DESINCORPORACIÓN
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Daño irreparable o costo excesivo. Genera acta oficial de baja patrimonial, descuenta el activo de existencias activas y lo envía a reciclaje RAEE.
                  </p>
                </div>
              </label>

            </div>

            {/* Justification Textarea */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Observaciones y Justificación para el Acta:
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs resize-none"
              />
            </div>

            {/* Action CTA with RBAC Notice */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-cyan-400">lock</span>
                <span>Firma requerida con Token JWT del Administrador RBAC</span>
              </div>

              <button
                type="button"
                onClick={handleExecuteResolution}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>Ejecutar Resolución & Actualizar Stock</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
