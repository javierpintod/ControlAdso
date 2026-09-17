import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminEmailAlert } from '../../types';

interface EmailAlertModalProps {
  alert: AdminEmailAlert | null;
  onClose: () => void;
}

export const EmailAlertModal: React.FC<EmailAlertModalProps> = ({ alert, onClose }) => {
  const { resendAdminEmailAlert, adminEmailAddress, showToast } = useApp();

  if (!alert) return null;

  const handleResend = () => {
    resendAdminEmailAlert(alert.id);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(alert.body);
    showToast('Contenido del correo copiado al portapapeles', 'info', 'content_copy');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Email Header */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shrink-0">
              <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                  ALERTA ADMINISTRATIVA
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {alert.status}
                </span>
              </div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Notificación Oficial de Incumplimiento
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

        {/* Email Headers / Metadata */}
        <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-800/20 text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-semibold text-slate-400 w-24 shrink-0">Para:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300">
                {alert.adminEmail || adminEmailAddress}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                (Administrador Principal)
              </span>
              <span className="font-mono text-slate-400 text-[11px]">
                cc: admin@sena.edu.co
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-semibold text-slate-400 w-24 shrink-0">De:</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono">
              sistema.inventarios@sena.edu.co (Servicio Automatizado SENA)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-semibold text-slate-400 w-24 shrink-0">Instructor:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {alert.instructorName} &lt;{alert.instructorEmail}&gt;
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-semibold text-slate-400 w-24 shrink-0">Fecha y Hora:</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              {alert.sentAt} • Plazo vencido a las {alert.deadlineTime}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pt-1">
            <span className="font-semibold text-slate-400 w-24 shrink-0">Asunto:</span>
            <span className="font-bold text-slate-900 dark:text-white text-xs">
              {alert.subject}
            </span>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-6 bg-white dark:bg-slate-900 overflow-y-auto max-h-[300px]">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/5 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
            {alert.body}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Mensaje emitido por el subsistema de telemetría de tomas físicas
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyBody}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copiar Texto</span>
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
              <span>Re-enviar Correo al Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
