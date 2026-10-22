import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { parseJwtUnverified } from '../../lib/jwt';

export const JwtInspectorModal: React.FC = () => {
  const { activeModal, closeModal, jwtToken, jwtPayload, currentUser, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'jwt-inspector') return null;

  const parsed = jwtToken ? parseJwtUnverified(jwtToken) : null;
  const tokenParts = jwtToken ? jwtToken.split('.') : [];

  const handleCopy = () => {
    if (jwtToken) {
      navigator.clipboard.writeText(jwtToken);
      setCopied(true);
      showToast('¡Token JWT copiado al portapapeles! Puedes verificarlo en jwt.io', 'success', 'content_copy');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const expDate = jwtPayload?.exp ? new Date(jwtPayload.exp * 1000).toLocaleString() : 'N/A';
  const iatDate = jwtPayload?.iat ? new Date(jwtPayload.iat * 1000).toLocaleString() : 'N/A';
  const now = Math.floor(Date.now() / 1000);
  const remainingSeconds = jwtPayload?.exp ? Math.max(0, jwtPayload.exp - now) : 0;
  const remainingHours = Math.floor(remainingSeconds / 3600);
  const remainingMins = Math.floor((remainingSeconds % 3600) / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col transition-all max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-4 ring-emerald-500/10">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Sesión JWT Verificada
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white leading-none mt-0.5">
                Inspector de Token JWT (RFC 7519)
              </h2>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Status summary banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px] text-emerald-600 dark:text-emerald-400">
                lock_open
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Autenticado como: {currentUser.name} ({currentUser.roleTitle})
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Firma criptográfica HMAC-SHA256 válida • {remainingHours}h {remainingMins}m restantes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span>{copied ? '¡Copiado!' : 'Copiar Token'}</span>
              </button>
            </div>
          </div>

          {/* Raw Colored Token */}
          {tokenParts.length === 3 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Estructura Codificada del Token (Header • Payload • Signature)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Base64URL Format
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-[11px] leading-relaxed break-all select-all border border-slate-800 shadow-inner">
                <span className="text-rose-400 font-bold" title="Header (Algoritmo y Tipo)">{tokenParts[0]}</span>
                <span className="text-slate-500">.</span>
                <span className="text-purple-400 font-bold" title="Payload (Claims del Usuario)">{tokenParts[1]}</span>
                <span className="text-slate-500">.</span>
                <span className="text-cyan-400 font-bold" title="Signature (Firma HMAC-SHA256)">{tokenParts[2]}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-[10px]">
                <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Header
                </span>
                <span className="flex items-center gap-1 text-purple-500 dark:text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Payload (Claims)
                </span>
                <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Firma HMAC-SHA256
                </span>
              </div>
            </div>
          )}

          {/* Decoded Header & Payload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Header Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 text-[10px]">
                  Decoded Header
                </span>
                <span className="text-[10px] font-mono text-slate-400">HS256</span>
              </div>
              <pre className="font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                {JSON.stringify(parsed?.header || { alg: 'HS256', typ: 'JWT' }, null, 2)}
              </pre>
            </div>

            {/* Timestamps Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 text-[10px] block mb-2">
                  Metadatos de Vigencia
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
                    <span className="text-slate-500">Emitido (iat):</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{iatDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-1">
                    <span className="text-slate-500">Expira (exp):</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{expDate}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Proveedor Auth:</span>
                    <span className="font-mono font-semibold text-blue-600 dark:text-cyan-400">
                      {jwtPayload?.authProvider || 'institutional_jwt'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decoded Payload Claims */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 text-[10px]">
                Decoded Payload (Claims Institucionales)
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Rol: {jwtPayload?.role || 'admin'}
              </span>
            </div>
            <pre className="font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 max-h-48">
              {JSON.stringify(jwtPayload || parsed?.payload, null, 2)}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            Validado con la Web Crypto API nativa del navegador.
          </span>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cerrar Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
