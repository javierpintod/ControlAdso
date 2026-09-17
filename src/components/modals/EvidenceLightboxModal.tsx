import React from 'react';
import { useApp } from '../../context/AppContext';

export const EvidenceLightboxModal: React.FC = () => {
  const { activeModal, closeModal, ticket, showToast } = useApp();

  if (activeModal !== 'evidence-lightbox') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400 text-[20px]">image</span>
            <span className="font-headline font-semibold text-sm">daño_pantalla_01.jpg • Evidencia Técnica</span>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col items-center">
          <div className="w-full max-h-[55vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80"
              alt="Evidencia fotográfica daño pantalla"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            <p className="font-semibold">{ticket.evidencePhotoGps}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Capturado por: {ticket.reporterName} • Tamaño: {ticket.evidenceSize}</p>
          </div>
          <button
            onClick={() => {
              showToast('Descargando imagen original de evidencia fotográfica...', 'success', 'download');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Descargar JPG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
