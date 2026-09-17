import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface ScannerViewProps {
  onNavigate: (view: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onNavigate }) => {
  const { assets, setSelectedAsset, verifyAssetInAudit, showToast } = useApp();
  const [scannedSerial, setScannedSerial] = useState('SN-8842-LAP');
  const [detectedAsset, setDetectedAsset] = useState(assets[0]);

  const handleScan = (serial: string) => {
    setScannedSerial(serial);
    const found = assets.find(a => a.serialNumber.toLowerCase() === serial.toLowerCase());
    if (found) {
      setDetectedAsset(found);
      setSelectedAsset(found);
      showToast(`¡Código QR detectado! ${found.name}`, 'success', 'qr_code_scanner');
    } else {
      showToast(`Activo con serial ${serial} no hallado en base de datos.`, 'warning');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold">
            SCAN-OPTIC-QR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            Lector Óptico & Reconocimiento de Placas
          </span>
        </div>
        <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
          Escaneo de Activos & Verificación en Campo
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Apunte la cámara al código QR o código de barras GS1-128 del equipo para auditoría inmediata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Scanner Viewport */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-headline font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Visor de Cámara Óptica
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">1080p 60FPS</span>
          </div>

          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
              alt="Hardware sensor backdrop"
              className="w-full h-full object-cover opacity-30"
            />

            {/* Target Corners */}
            <div className="absolute inset-10 rounded-2xl flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
                <div className="w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce"></div>
              <div className="flex justify-between">
                <div className="w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>
                <div className="w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>
              </div>
            </div>

            <span className="absolute bottom-4 bg-slate-900/80 text-white text-xs px-3.5 py-1.5 rounded-full font-medium backdrop-blur-md">
              Alinee el código QR con el retículo
            </span>
          </div>

          {/* Quick presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pruebas Rápidas con Activos Reales:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleScan('SN-8842-LAP')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-mono text-slate-700 dark:text-slate-200 text-left truncate"
              >
                SN-8842-LAP (Dell)
              </button>
              <button
                onClick={() => handleScan('SN-9012-ROB')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-mono text-slate-700 dark:text-slate-200 text-left truncate"
              >
                SN-9012-ROB (Brazo)
              </button>
            </div>
          </div>
        </div>

        {/* Detected Asset Information */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <span className="font-headline font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-[20px]">verified</span>
              Activo Identificado
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
              COINCIDENCIA 100%
            </span>
          </div>

          {detectedAsset && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  <img src={detectedAsset.photoUrl} alt={detectedAsset.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                    {detectedAsset.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400">
                      {detectedAsset.serialNumber}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{detectedAsset.assetCode}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {detectedAsset.environmentName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Puesto Asignado</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{detectedAsset.station}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Custodio Docente</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{detectedAsset.responsiblePerson}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300/60 dark:border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Activo auditado y cotejado contra el libro mayor institucional.</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    verifyAssetInAudit(detectedAsset.serialNumber, detectedAsset.station);
                    showToast(`Activo ${detectedAsset.serialNumber} verificado in situ.`, 'success', 'verified');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Confirmar Presencia en Auditoría</span>
                </button>
                <button
                  onClick={() => onNavigate('inventario')}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Ver Hoja de Vida Completa</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
