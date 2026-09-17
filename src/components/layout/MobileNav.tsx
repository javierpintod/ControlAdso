import React from 'react';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'inventario', label: 'Inventario', icon: 'inventory_2' },
    { id: 'escanear', label: 'Escaneo QR', icon: 'qr_code_scanner' },
    { id: 'movimientos', label: 'Movimientos', icon: 'swap_horiz' },
    { id: 'mesa-de-servicio', label: 'Mesa Ayuda', icon: 'support_agent' }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden pb-safe bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/10 shadow-lg">
      <div className="flex justify-around items-center h-16 px-1 max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-cyan-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${
                isActive ? 'scale-110 drop-shadow-sm' : ''
              }`}>
                {tab.icon}
              </span>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
