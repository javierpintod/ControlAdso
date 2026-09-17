import React from 'react';
import { useApp } from '../../context/AppContext';

export const TransferSuccessModal: React.FC = () => {
  const { activeModal, closeModal, voucherData, showToast } = useApp();

  if (activeModal !== 'transfer-voucher' || !voucherData) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(voucherData.cryptoHash);
    showToast('Hash criptográfico SHA-256 copiado al portapapeles', 'success', 'content_copy');
  };

  const handleDownloadPdf = () => {
    showToast('Generando Comprobante Digital Oficial (PDF foliado)...', 'info', 'picture_as_pdf');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Certificación de Custodia Digital
            </span>
          </div>
          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Top Celebration Icon & Heading */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className="absolute w-16 h-16 bg-emerald-500/20 rounded-full animate-ping opacity-40"></div>
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center relative shadow-sm border border-emerald-400/30">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-300 dark:border-emerald-500/30 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sincronizado con Éxito
            </span>
            <h2 className="font-headline text-xl font-bold text-slate-900 dark:text-white">¡Transferencia Exitosa!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Acta de Custodia Digital Generada y Certificada</p>
          </div>

          {/* Database Update Banner */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/25 rounded-xl p-3 shadow-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[20px] shrink-0 mt-0.5">cloud_done</span>
            <div className="flex flex-col text-xs">
              <span className="font-semibold uppercase tracking-wider text-blue-700 dark:text-cyan-300 text-[10px]">
                Base de datos central actualizada
              </span>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                El <strong className="text-slate-900 dark:text-white font-semibold">{voucherData.destinationEnvironmentName}</strong> ahora registra la disponibilidad en tiempo real.
              </p>
            </div>
          </div>

          {/* Official Voucher Ticket */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm">
            
            {/* Voucher Header */}
            <div className="bg-slate-100 dark:bg-slate-800 p-3.5 flex flex-col gap-1 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-cyan-300 tracking-wider">
                  FOLIO OFICIAL
                </span>
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-mono text-xs font-bold shadow-xs">
                  {voucherData.folio}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {voucherData.timestamp}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">security</span>
                  JWT Validado
                </span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash Display */}
            <div className="bg-slate-200/50 dark:bg-slate-900/60 px-3.5 py-2 flex items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="material-symbols-outlined text-[15px] text-slate-400 shrink-0">tag</span>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate">
                  {voucherData.cryptoHash}
                </span>
              </div>
              <button 
                onClick={copyHash}
                title="Copiar Hash SHA-256"
                className="p-1 text-blue-600 dark:text-cyan-300 hover:bg-slate-300 dark:hover:bg-white/10 rounded transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {/* Voucher Body Details */}
            <div className="p-4 space-y-3.5 text-xs">
              
              {/* Asset Card Mini */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-xs">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">laptop_mac</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white truncate text-[13px]">
                    {voucherData.productName}
                  </span>
                  <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono font-semibold">
                    Placa: {voucherData.assetCode || 'EDU-ACT-0492'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    S/N: {voucherData.serialNumber || 'SN-8842-LAP'} • Cantidad: {voucherData.quantity} ud
                  </span>
                </div>
              </div>

              {/* Custody Flow with Vertical Connector */}
              <div className="relative flex flex-col gap-3 pl-2.5">
                {/* Vertical connecting line */}
                <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                {/* Origin */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center shrink-0 z-10 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300"></span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Origen (Emisor)</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {voucherData.originEnvironmentName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">person</span>
                      Ing. Lucía Vargas Méndez
                    </span>
                  </div>
                </div>

                {/* Reallocation tag */}
                <div className="flex items-center gap-1 pl-6 text-blue-600 dark:text-cyan-400 font-semibold text-[10px] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                  <span>Reubicación Física Aprobada</span>
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 z-10 mt-0.5 border border-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                      Destino Actual (Receptor)
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {voucherData.destinationEnvironmentName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">how_to_reg</span>
                      Prof. Ricardo Salinas
                    </span>
                  </div>
                </div>
              </div>

              {/* Justification Quote */}
              <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/5 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Motivo de Reubicación</span>
                <p className="text-slate-700 dark:text-slate-300 italic text-[11px]">
                  "{voucherData.notes}"
                </p>
              </div>

              {/* Auth RBAC Badge */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[18px]">verified_user</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{voucherData.userName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{voucherData.userRole} • JWT Verificado</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                  AUTH_OK
                </span>
              </div>

              {/* Perforated Ticket Separator */}
              <div className="relative py-1 flex items-center justify-between overflow-hidden">
                <div className="w-3.5 h-3.5 bg-white dark:bg-slate-900 rounded-full -ml-5 border border-slate-300 dark:border-slate-700 shadow-inner"></div>
                <div className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-700 mx-2"></div>
                <div className="w-3.5 h-3.5 bg-white dark:bg-slate-900 rounded-full -mr-5 border border-slate-300 dark:border-slate-700 shadow-inner"></div>
              </div>

              {/* QR Verification Code SVG */}
              <div className="flex flex-col items-center text-center gap-1 pt-1">
                <div className="p-3 bg-white rounded-2xl shadow-sm inline-block border border-slate-200">
                  <svg className="w-28 h-28 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="28" height="28" rx="2" fill="currentColor" />
                    <rect x="4" y="4" width="20" height="20" rx="1" fill="white" />
                    <rect x="8" y="8" width="12" height="12" rx="1" fill="currentColor" />
                    <rect x="72" y="0" width="28" height="28" rx="2" fill="currentColor" />
                    <rect x="76" y="4" width="20" height="20" rx="1" fill="white" />
                    <rect x="80" y="8" width="12" height="12" rx="1" fill="currentColor" />
                    <rect x="0" y="72" width="28" height="28" rx="2" fill="currentColor" />
                    <rect x="4" y="76" width="20" height="20" rx="1" fill="white" />
                    <rect x="8" y="80" width="12" height="12" rx="1" fill="currentColor" />
                    <rect x="36" y="4" width="6" height="6" />
                    <rect x="46" y="4" width="6" height="14" />
                    <rect x="58" y="4" width="6" height="6" />
                    <rect x="36" y="16" width="6" height="12" />
                    <rect x="4" y="36" width="6" height="6" />
                    <rect x="14" y="36" width="14" height="6" />
                    <rect x="4" y="48" width="8" height="6" />
                    <rect x="36" y="36" width="28" height="28" rx="2" fill="#1e40af" />
                    <circle cx="50" cy="50" r="5" fill="white" />
                    <rect x="72" y="36" width="8" height="6" />
                    <rect x="76" y="48" width="6" height="12" />
                    <rect x="36" y="72" width="6" height="8" />
                    <rect x="46" y="72" width="12" height="6" />
                    <rect x="36" y="84" width="14" height="6" />
                    <rect x="54" y="82" width="8" height="14" />
                    <rect x="72" y="76" width="10" height="6" />
                    <rect x="88" y="76" width="8" height="18" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-blue-600 dark:text-cyan-400">lock_reset</span>
                  <span className="font-mono font-bold">TOKEN: {voucherData.qrVerificationToken}</span>
                </div>
                <p className="text-[10px] text-slate-400 max-w-xs leading-snug">
                  Escanear para verificar autenticidad en cualquier momento o auditar en campo sin conexión.
                </p>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center justify-between px-4 shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                <span>Descargar Comprobante PDF</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/20 font-mono text-[10px]">240 KB</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => showToast('Enlace seguro del acta copiado para compartir', 'success', 'share')}
                className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-cyan-400">share</span>
                <span>Compartir Acta</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Notificación enviada al correo del custodio receptor', 'success', 'forward_to_inbox')}
                className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-500">forward_to_inbox</span>
                <span>Enviar Custodio</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  // navigate to scanner
                }}
                className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                Escanear Siguiente
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
