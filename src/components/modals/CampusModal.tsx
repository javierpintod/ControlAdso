import React from 'react';
import { useApp } from '../../context/AppContext';
import { CampusId } from '../../types';

export const CampusModal: React.FC = () => {
  const { activeModal, closeModal, currentCampus, setCampus } = useApp();

  if (activeModal !== 'campus-select') return null;

  const campuses: { id: CampusId; name: string; subtitle: string; icon: string }[] = [
    {
      id: 'central',
      name: 'Sede Central - Campus Educativo',
      subtitle: 'Facultad de Ingeniería & Tecnología (3 Ambientes)',
      icon: 'domain'
    },
    {
      id: 'norte',
      name: 'Sede Norte - Centro Tecnológico',
      subtitle: 'Laboratorios de Mecatrónica & Redes Avanzadas',
      icon: 'apartment'
    },
    {
      id: 'sur',
      name: 'Sede Sur - Talleres Vocacionales',
      subtitle: 'Talleres de Automatización y Sistemas Industriales',
      icon: 'location_city'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400">location_on</span>
            <span className="font-headline font-bold text-base text-slate-900 dark:text-white">Seleccionar Campus / Sede</span>
          </div>
          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {campuses.map(c => {
            const isSelected = currentCampus.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setCampus(c.id, c.name);
                  closeModal();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400/50 text-blue-900 dark:text-cyan-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm block">{c.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{c.subtitle}</span>
                  </div>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400">check_circle</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
