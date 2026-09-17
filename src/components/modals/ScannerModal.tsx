import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

export const ScannerModal: React.FC = () => {
  const { activeModal, closeModal, verifyAssetInAudit, showToast } = useApp();
  const [flashOn, setFlashOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (activeModal === 'scanner') {
      const codeReader = new BrowserMultiFormatReader();
      readerRef.current = codeReader;
      
      codeReader.listVideoInputDevices()
        .then((videoInputDevices) => {
          if (videoInputDevices.length > 0) {
            let selectedDeviceId = videoInputDevices[0].deviceId;
            
            // Prefer back camera
            const backCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));
            if (backCamera) {
              selectedDeviceId = backCamera.deviceId;
            }

            codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
              if (result) {
                const text = result.getText();
                handleScanResult(text);
              }
              if (err && !(err instanceof NotFoundException)) {
                console.error(err);
              }
            });
          } else {
            setError('No se encontró cámara.');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Error accediendo a la cámara.');
        });
    }

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [activeModal]);

  const handleScanResult = (text: string) => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    // Attempt to extract SN from QR text if it's not exactly the SN
    // e.g. QR-SENA-SN-1234 -> SN-1234, or just pass the text
    let serialToVerify = text;
    if (text.includes('QR-SENA-')) {
      serialToVerify = text.replace('QR-SENA-', '');
    }
    
    verifyAssetInAudit(serialToVerify, 'Scanner QR');
    closeModal();
    showToast(`¡Código escaneado! ${serialToVerify}`, 'success', 'qr_code_scanner');
  };

  if (activeModal !== 'scanner') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 w-full max-w-sm rounded-3xl shadow-2xl p-5 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">Escáner Óptico QR</h3>
          </div>
          <button
            onClick={() => {
              if (readerRef.current) readerRef.current.reset();
              closeModal();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          {error ? (
             <div className="text-rose-500 text-center p-4 text-sm font-semibold">{error}</div>
          ) : (
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              autoPlay 
              playsInline 
              muted 
            />
          )}

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
        </div>

        <div className="flex flex-col gap-2">
           <div className="text-center text-xs text-slate-500">
             Alinee el código QR con el retículo para escanear
           </div>
        </div>
      </div>
    </div>
  );
};
