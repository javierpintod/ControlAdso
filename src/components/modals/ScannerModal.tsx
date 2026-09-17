import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ScannerModal: React.FC = () => {
  const { activeModal, closeModal, verifyAssetInAudit, showToast } = useApp();
  const [flashOn, setFlashOn] = useState(false);

  if (activeModal !== 'scanner') return null;

  const handleSimulateScan = () => {
    verifyAssetInAudit('SN-9012-ROB', 'Banco 1 (Sensor Óptico QR)');
    closeModal();
    showToast('¡Código QR detectado! Brazo Robótico Dobot verificado', 'success', 'qr_code_scanner');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 w-full max-w-sm rounded-3xl shadow-2xl p-5 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">Escáner Óptico QR</h3>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&q=80"
            alt="Hardware sensor backdrop"
            className="w-full h-full object-cover opacity-35"
          />

          {/* Viewfinder corners and laser line */}
          <div className="absolute inset-8 rounded-xl flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between">
              <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
            </div>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce"></div>
            <div className="flex justify-between">
              <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>
            </div>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={() => setFlashOn(prev => !prev)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                flashOn ? 'bg-amber-400 text-slate-950' : 'bg-white/20 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {flashOn ? 'flash_on' : 'flash_off'}
              </span>
            </button>
          </div>

          <span className="absolute bottom-3 bg-slate-900/80 text-white text-[11px] px-3 py-1 rounded-full font-medium backdrop-blur-sm">
            Centrar etiqueta de serial o placa QR
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleSimulateScan}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Simular Detección de Código QR</span>
          </button>
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1">
            <span>Motor: ZXing / QuaggaJS</span>
            <span>60 FPS • HD 1080p</span>
          </div>
        </div>
      </div>
    </div>
  );
};
