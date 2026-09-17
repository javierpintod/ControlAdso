import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MovementType, EnvironmentId } from '../../types';
import { INITIAL_ENVIRONMENTS } from '../../data/mockData';

export const MovementModal: React.FC = () => {
  const { activeModal, closeModal, registerMovement, categories, assets, currentRole } = useApp();

  const [type, setType] = useState<MovementType>('TRANSFER');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>(categories[0]?.code || 'CAT-CMP-01');
  const [originEnv, setOriginEnv] = useState<EnvironmentId>('amb1');
  const [destEnv, setDestEnv] = useState<EnvironmentId>('amb2');
  const [quantity, setQuantity] = useState<number>(1);
  const [serialNumber, setSerialNumber] = useState<string>('SN-8842-LAP');
  const [notes, setNotes] = useState<string>('Reubicación Curricular - Taller de Programación Avanzada 2025-1');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (activeModal !== 'movement') return null;

  const currentCategory = categories.find(c => c.code === selectedCategoryCode) || categories[0];

  const getAvailableStock = (envId: EnvironmentId) => {
    if (envId === 'amb1') return currentCategory.amb1;
    if (envId === 'amb2') return currentCategory.amb2;
    if (envId === 'amb3') return currentCategory.amb3;
    if (envId === 'service') return currentCategory.mesa;
    if (envId === 'damaged') return currentCategory.dano;
    return 0;
  };

  const availableInOrigin = getAvailableStock(originEnv);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (currentRole === 'consulta') {
      setErrorMsg('403 | Acceso denegado. El rol Consulta (solo lectura) no tiene permisos de modificación.');
      return;
    }

    if (quantity <= 0) {
      setErrorMsg('La cantidad debe ser mayor a 0.');
      return;
    }

    if ((type === 'TRANSFER' || type === 'OUT') && quantity > availableInOrigin) {
      setErrorMsg(`Error: Cantidad solicitada (${quantity}) excede el stock disponible en ${originEnv.toUpperCase()} (${availableInOrigin}).`);
      return;
    }

    if (type === 'TRANSFER' && originEnv === destEnv) {
      setErrorMsg('El ambiente de origen y destino no pueden ser el mismo para una transferencia.');
      return;
    }

    const res = registerMovement({
      type,
      productName: currentCategory.name,
      categoryCode: currentCategory.code,
      originEnvironmentId: type !== 'IN' ? originEnv : undefined,
      destinationEnvironmentId: type !== 'OUT' ? destEnv : undefined,
      quantity,
      notes,
      serialNumber: type === 'TRANSFER' ? serialNumber : undefined
    });

    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">sync_alt</span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Registrar Movimiento de Inventario</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Validación de stock en tiempo real y certificación criptográfica</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-rose-600 dark:text-rose-400 shrink-0">warning</span>
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Movement Type Pill Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Tipo de Operación
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setType('TRANSFER')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  type === 'TRANSFER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                Transferencia
              </button>
              <button
                type="button"
                onClick={() => setType('IN')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  type === 'IN'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">add_box</span>
                Entrada (Alta)
              </button>
              <button
                type="button"
                onClick={() => setType('OUT')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  type === 'OUT'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Salida (Baja)
              </button>
            </div>
          </div>

          {/* Category / Product */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Línea o Categoría Técnica *
            </label>
            <select
              value={selectedCategoryCode}
              onChange={e => setSelectedCategoryCode(e.target.value)}
              className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.code}>
                  {cat.name} ({cat.code}) — {cat.total} uds totales
                </option>
              ))}
            </select>
          </div>

          {/* Environments Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {type !== 'IN' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Ambiente de Origen *
                  </label>
                  <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                    Stock disp: {availableInOrigin}
                  </span>
                </div>
                <select
                  value={originEnv}
                  onChange={e => setOriginEnv(e.target.value as EnvironmentId)}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="amb1">Ambiente 1: Lab Robótica ({currentCategory.amb1})</option>
                  <option value="amb2">Ambiente 2: Aula Cómputo ({currentCategory.amb2})</option>
                  <option value="amb3">Ambiente 3: Electrónica ({currentCategory.amb3})</option>
                  <option value="service">Mesa de Servicio ({currentCategory.mesa})</option>
                  <option value="damaged">Almacén Dañados ({currentCategory.dano})</option>
                </select>
              </div>
            )}

            {type !== 'OUT' && (
              <div className={type === 'IN' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Ambiente de Destino *
                </label>
                <select
                  value={destEnv}
                  onChange={e => setDestEnv(e.target.value as EnvironmentId)}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="amb1">Ambiente 1: Lab Robótica e IA</option>
                  <option value="amb2">Ambiente 2: Aula Cómputo & Redes</option>
                  <option value="amb3">Ambiente 3: Taller de Electrónica</option>
                  <option value="service">Mesa de Servicio (Taller Diagnóstico)</option>
                  <option value="damaged">Almacén de Dañados (Cuarentena)</option>
                </select>
              </div>
            )}
          </div>

          {/* Quantity and Serial Optional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Cantidad de Unidades *
              </label>
              <input
                type="number"
                min="1"
                max={type !== 'IN' ? availableInOrigin : 500}
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Serial Específico (Opcional)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                placeholder="Ej: SN-8842-LAP"
                className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Justification Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Motivo / Justificación Institucional *
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ej: Reubicación curricular para taller de robótica..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-transform active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Guardar y Certificar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
