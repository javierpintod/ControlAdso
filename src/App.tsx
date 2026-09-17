import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { InventorySerialView } from './components/inventory/InventorySerialView';
import { ServiceDeskView } from './components/servicedesk/ServiceDeskView';
import { DamagedAssetsView } from './components/damaged/DamagedAssetsView';
import { MovementsView } from './components/movements/MovementsView';
import { AuditView } from './components/audit/AuditView';
import { ScannerView } from './components/scanner/ScannerView';
import { UsersView } from './components/users/UsersView';
import { ReportsView } from './components/reports/ReportsView';
import { DatabaseView } from './components/database/DatabaseView';

// Modals
import { MovementModal } from './components/modals/MovementModal';
import { TransferSuccessModal } from './components/modals/TransferSuccessModal';
import { CampusModal } from './components/modals/CampusModal';
import { NewUserModal } from './components/modals/NewUserModal';
import { DiscrepancyModal } from './components/modals/DiscrepancyModal';
import { ScannerModal } from './components/modals/ScannerModal';
import { EvidenceLightboxModal } from './components/modals/EvidenceLightboxModal';

// Toast
import { Toast } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'inventario':
        return <InventorySerialView onNavigate={setCurrentView} />;
      case 'mesa-de-servicio':
        return <ServiceDeskView onNavigate={setCurrentView} />;
      case 'equipos-con-dano':
        return <DamagedAssetsView onNavigate={setCurrentView} />;
      case 'movimientos':
        return <MovementsView onNavigate={setCurrentView} />;
      case 'auditoria':
        return <AuditView onNavigate={setCurrentView} />;
      case 'escanear':
        return <ScannerView onNavigate={setCurrentView} />;
      case 'usuarios':
        return <UsersView onNavigate={setCurrentView} />;
      case 'reportes':
        return <ReportsView onNavigate={setCurrentView} />;
      case 'database':
        return <DatabaseView onNavigate={setCurrentView} />;
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white antialiased">
      {/* Sidebar for Desktop (72px fixed) */}
      <div className="no-print">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      </div>

      {/* Top Navbar */}
      <div className="no-print">
        <Navbar currentView={currentView} onNavigate={setCurrentView} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-72 pt-20 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
        {renderView()}
      </main>

      {/* Mobile Floating Bottom Dock */}
      <div className="no-print">
        <MobileNav currentView={currentView} onNavigate={setCurrentView} />
      </div>

      {/* Global Interactive Modals */}
      <MovementModal />
      <TransferSuccessModal />
      <CampusModal />
      <NewUserModal />
      <DiscrepancyModal />
      <ScannerModal />
      <EvidenceLightboxModal />

      {/* Toast Notification Layer */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
