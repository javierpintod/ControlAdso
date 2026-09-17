import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PhysicalInventorySchedule, 
  Environment, 
  AdminEmailAlert, 
  EnvironmentId, 
  ShiftType,
  AuditItem 
} from '../../types';
import { TakeInventoryModal } from './TakeInventoryModal';
import { EmailAlertModal } from './EmailAlertModal';
import { AssignInstructorModal } from './AssignInstructorModal';

interface AuditViewProps {
  onNavigate: (view: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ onNavigate }) => {
  const { 
    environments,
    physicalSchedules,
    adminEmailAlerts,
    adminEmailAddress,
    setAdminEmailAddress,
    markScheduleAsMissed,
    executeAutoMissedCheck,
    auditItems, 
    verifyAssetInAudit, 
    openModal, 
    finalizeAuditSession, 
    showToast,
    currentRole 
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'cronograma' | 'ambientes' | 'alertas' | 'cotejo-general'>('cronograma');

  // Filters for schedules
  const [selectedEnvFilter, setSelectedEnvFilter] = useState<string>('all');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modals state
  const [activeScheduleModal, setActiveScheduleModal] = useState<PhysicalInventorySchedule | null>(null);
  const [activeAlertModal, setActiveAlertModal] = useState<AdminEmailAlert | null>(null);
  const [activeEnvAssignModal, setActiveEnvAssignModal] = useState<Environment | null>(null);
  const [showConfigEmail, setShowConfigEmail] = useState(false);
  const [tempAdminEmail, setTempAdminEmail] = useState(adminEmailAddress);

  // Scan input for detailed checklist
  const [scanInput, setScanInput] = useState('');

  // Statistics calculation
  const totalSchedules = physicalSchedules.length;
  const completedSchedules = physicalSchedules.filter(s => s.status === 'COMPLETADA').length;
  const missedSchedules = physicalSchedules.filter(s => s.status === 'NO_REALIZADA').length;
  const pendingSchedules = physicalSchedules.filter(s => s.status === 'PENDIENTE').length;
  const complianceRate = totalSchedules > 0 ? Math.round((completedSchedules / (completedSchedules + missedSchedules || 1)) * 100) : 0;

  // Filtered schedules list
  const filteredSchedules = physicalSchedules.filter(s => {
    if (selectedEnvFilter !== 'all' && s.environmentId !== selectedEnvFilter) return false;
    if (selectedShiftFilter !== 'all' && s.shift !== selectedShiftFilter) return false;
    if (selectedStatusFilter !== 'all' && s.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleSaveAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAdminEmail || !tempAdminEmail.includes('@')) {
      showToast('Por favor ingresa un correo electrónico válido', 'error');
      return;
    }
    setAdminEmailAddress(tempAdminEmail);
    setShowConfigEmail(false);
  };

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const found = auditItems.find(
      (i: AuditItem) => i.serialNumber.toLowerCase() === scanInput.trim().toLowerCase() ||
           i.assetCode.toLowerCase() === scanInput.trim().toLowerCase()
    );

    if (found) {
      verifyAssetInAudit(found.serialNumber, found.station);
      setScanInput('');
      showToast(`¡Activo verificado in situ! ${found.name}`, 'success', 'verified');
    } else {
      showToast(`Serial ${scanInput} no hallado en la nómina de cotejo del ambiente.`, 'warning', 'search_off');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      
      {/* Institutional Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
              REGLAMENTACIÓN DIARIA SENA • 6:00 AM • 12:00 M • 6:00 PM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Instructor Asignado por Ambiente
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Toma Física Diaria de Inventario por Ambientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Control obligatorio de 3 jornadas diarias. Si el instructor asignado no realiza la toma antes de la hora límite, se despacha un correo de alerta automático al Administrador.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowConfigEmail(true)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            title="Configurar correo del administrador para alertas"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-600 dark:text-cyan-400">mail</span>
            <span>Admin: {adminEmailAddress}</span>
          </button>

          <button
            onClick={executeAutoMissedCheck}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Evaluar cortes horarios y despachar correos por tomas vencidas"
          >
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span>Verificar Cortes Horarios</span>
          </button>

          <button
            onClick={() => openModal('scanner')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Lector Óptico</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Horarios de Toma */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-blue-200/50 dark:border-blue-800/50">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              3 Horarios Reglamentarios
            </span>
            <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">06:00 AM</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">12:00 M</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">06:00 PM</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Tolerancia máxima: 30 minutos</span>
          </div>
        </div>

        {/* Card 2: Ambientes con Instructor */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/50">
            <span className="material-symbols-outlined text-2xl">person_pin</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Ambientes Vinculados
            </span>
            <div className="font-bold text-xl text-slate-900 dark:text-white mt-0.5">
              {environments.length} Ambientes
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              100% con Instructor Oficial
            </span>
          </div>
        </div>

        {/* Card 3: Tomas Realizadas Hoy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-200/50 dark:border-cyan-800/50">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cumplimiento Diario
            </span>
            <div className="font-bold text-xl text-slate-900 dark:text-white mt-0.5 flex items-baseline gap-2">
              <span>{completedSchedules}/{totalSchedules}</span>
              <span className="text-xs text-slate-400 font-normal">({complianceRate}%)</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {pendingSchedules} pendientes • {missedSchedules} no realizadas
            </span>
          </div>
        </div>

        {/* Card 4: Alertas de Correo al Admin */}
        <div 
          onClick={() => setActiveTab('alertas')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-900/40 shadow-xs flex items-center gap-3.5 cursor-pointer hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200/50 dark:border-rose-800/50 relative">
            <span className="material-symbols-outlined text-2xl">mark_email_unread</span>
            {adminEmailAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {adminEmailAlerts.length}
              </span>
            )}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Alertas Despachadas
            </span>
            <div className="font-bold text-xl text-slate-900 dark:text-white mt-0.5">
              {adminEmailAlerts.length} Correos
            </div>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium underline flex items-center gap-1 mt-0.5">
              <span>Ver bandeja enviada al Admin</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cronograma')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'cronograma'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>Cronograma de Tomas (6 AM • 12 M • 6 PM)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
            {physicalSchedules.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ambientes')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'ambientes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">diversity_3</span>
          <span>Asignación de Instructores por Ambiente</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono">
            {environments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('alertas')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'alertas'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          <span>Bandeja de Alertas Enviadas al Administrador</span>
          {adminEmailAlerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold text-[10px] font-mono">
              {adminEmailAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cotejo-general')}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'cotejo-general'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
          <span>Cotejo Activo In Situ (Puesto a Puesto)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CRONOGRAMA DE TOMAS FÍSICAS (6:00 AM • 12:00 M • 6:00 PM)          */}
      {/* ========================================================================= */}
      {activeTab === 'cronograma' && (
        <div className="flex flex-col gap-5">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Filtrar:</span>
              
              {/* Environment Filter */}
              <select
                value={selectedEnvFilter}
                onChange={e => setSelectedEnvFilter(e.target.value)}
                className="h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Ambientes ({environments.length})</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>
                    {env.codeName || env.name}
                  </option>
                ))}
              </select>

              {/* Shift Filter */}
              <select
                value={selectedShiftFilter}
                onChange={e => setSelectedShiftFilter(e.target.value)}
                className="h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Horarios (6am, 12m, 6pm)</option>
                <option value="06:00">06:00 AM • Apertura</option>
                <option value="12:00">12:00 M • Mediodía</option>
                <option value="18:00">06:00 PM • Nocturna</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="h-9 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="PENDIENTE">Pendientes ({pendingSchedules})</option>
                <option value="COMPLETADA">Completadas ({completedSchedules})</option>
                <option value="NO_REALIZADA">No Realizadas / Con Alerta ({missedSchedules})</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Mostrando {filteredSchedules.length} de {totalSchedules} turnos
            </div>
          </div>

          {/* Shift Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchedules.map(schedule => {
              const env = environments.find(e => e.id === schedule.environmentId);
              const isPending = schedule.status === 'PENDIENTE';
              const isCompleted = schedule.status === 'COMPLETADA';
              const isMissed = schedule.status === 'NO_REALIZADA';

              return (
                <div
                  key={schedule.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between gap-4 shadow-xs ${
                    isCompleted
                      ? 'border-emerald-200/80 dark:border-emerald-900/40'
                      : isMissed
                      ? 'border-rose-200/80 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10'
                      : 'border-slate-200/80 dark:border-white/10 hover:border-blue-400/60'
                  }`}
                >
                  <div>
                    {/* Top Row: Shift Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300 border border-blue-200/60 dark:border-blue-800/50 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        {schedule.shift === '06:00' ? '06:00 AM' : schedule.shift === '12:00' ? '12:00 M' : '06:00 PM'}
                      </span>

                      {/* Status Tag */}
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-500/20">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Completada
                        </span>
                      ) : isMissed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-500/30">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          No Realizada • Alerta Enviada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold text-xs border border-amber-500/20">
                          <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                          Pendiente
                        </span>
                      )}
                    </div>

                    {/* Environment Title */}
                    <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {schedule.environmentName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {env?.building} • {env?.floor}
                    </p>

                    {/* Assigned Instructor Box */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {schedule.instructorName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {schedule.instructorName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate font-mono">
                            {schedule.instructorEmail}
                          </div>
                        </div>
                      </div>

                      {env && (
                        <button
                          onClick={() => setActiveEnvAssignModal(env)}
                          className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors shrink-0"
                          title="Cambiar instructor asignado"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                    </div>

                    {/* Verification Telemetry / Notes */}
                    <div className="mt-3 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span>Total Bienes Asignados:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {schedule.totalItems} equipos
                        </span>
                      </div>

                      {isCompleted && (
                        <>
                          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>Verificados In Situ:</span>
                            <span className="font-mono">{schedule.verifiedCount}/{schedule.totalItems}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span>Certificado por:</span>
                            <span>{schedule.completedBy} a las {schedule.completedAt}</span>
                          </div>
                        </>
                      )}

                      {isMissed && (
                        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-300">
                          ⚠️ Plazo límite venció a las {schedule.deadlineTime}. Se remitió correo formal al Administrador ({adminEmailAddress}).
                        </div>
                      )}

                      {isPending && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                          ⏰ Hora límite reglamentaria: {schedule.deadlineTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => setActiveScheduleModal(schedule)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">checklist</span>
                          <span>Realizar Toma Física</span>
                        </button>
                        <button
                          onClick={() => markScheduleAsMissed(schedule.id)}
                          className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-xs transition-colors shrink-0"
                          title="Simular que venció el plazo y enviar correo al Administrador"
                        >
                          <span className="material-symbols-outlined text-[16px]">notification_important</span>
                        </button>
                      </>
                    ) : isMissed ? (
                      <>
                        <button
                          onClick={() => {
                            const relatedAlert = adminEmailAlerts.find(a => a.scheduleId === schedule.id) || adminEmailAlerts[0];
                            setActiveAlertModal(relatedAlert);
                          }}
                          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">mail</span>
                          <span>Ver Correo Enviado al Admin</span>
                        </button>
                        <button
                          onClick={() => setActiveScheduleModal(schedule)}
                          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                          title="Registrar toma extemporánea"
                        >
                          Regularizar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setActiveScheduleModal(schedule)}
                        className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Ver Detalle de la Toma</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ASIGNACIÓN DE INSTRUCTORES POR AMBIENTE                              */}
      {/* ========================================================================= */}
      {activeTab === 'ambientes' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Matriz de Asignación de Instructores a Ambientes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cada ambiente de aprendizaje tiene un instructor titular asignado que asume la responsabilidad de la toma física diaria.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300">
              {environments.length} Ambientes Registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                  <th className="px-5 py-3">Ambiente Institucional</th>
                  <th className="px-4 py-3">Ubicación & Piso</th>
                  <th className="px-4 py-3">Bienes Asignados</th>
                  <th className="px-4 py-3">Instructor Titular Asignado</th>
                  <th className="px-4 py-3">Correo Institucional</th>
                  <th className="px-5 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {environments.map(env => (
                  <tr key={env.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">{env.icon || 'meeting_room'}</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {env.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Código: {env.id} • Capacidad: {env.totalCapacity} puestos
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {env.building} • {env.floor}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {env.assignedCount} equipos
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {env.occupancyPercentage}% ocupación
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                          {env.assignedInstructorName?.charAt(0) || 'I'}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {env.assignedInstructorName || 'Sin asignar'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-600 dark:text-slate-400">
                      {env.assignedInstructorEmail || 'N/A'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setActiveEnvAssignModal(env)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 font-semibold text-xs transition-colors flex items-center gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[15px]">person_add</span>
                        <span>Reasignar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BANDEJA DE ALERTAS DE CORREO AL ADMINISTRADOR                       */}
      {/* ========================================================================= */}
      {activeTab === 'alertas' && (
        <div className="flex flex-col gap-4">
          
          {/* Email Info Banner */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 text-2xl shrink-0">
                mark_email_unread
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Bandeja de Despacho Automático de Alertas al Administrador
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Destinatario principal configurado: <strong>{adminEmailAddress}</strong> • Copia oculta a: admin@sena.edu.co
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowConfigEmail(true)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 font-semibold text-xs transition-colors shrink-0"
            >
              Cambiar Correo Admin
            </button>
          </div>

          {/* Alerts List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 px-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Historial de Correos Emitidos por Incumplimiento
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Total Alertas: {adminEmailAlerts.length}
              </span>
            </div>

            {adminEmailAlerts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No hay alertas de correo despachadas. Todas las tomas físicas están al día.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {adminEmailAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => setActiveAlertModal(alert)}
                    className="p-4 px-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {alert.subject}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-mono">
                            {alert.shiftLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          Ambiente: {alert.environmentName} • Instructor: {alert.instructorName} ({alert.instructorEmail})
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>Para: {alert.adminEmail}</span>
                          <span>•</span>
                          <span>{alert.sentAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {alert.status}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveAlertModal(alert);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold"
                      >
                        Abrir Correo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDITORÍA DETALLADA IN SITU (PREEXISTING SCANNER ENGINE)            */}
      {/* ========================================================================= */}
      {activeTab === 'cotejo-general' && (
        <div className="flex flex-col gap-6">
          {/* Quick Scan Input */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-xs">
            <form onSubmit={handleQuickScan} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  barcode_reader
                </span>
                <input
                  type="text"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  placeholder="Ingresar o pistolear serial (ej. 5CD0037S7T) o placa institucional..."
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">search_check</span>
                <span>Verificar Activo</span>
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 px-5 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Nómina de Activos para Cotejo Presencial
              </h3>
              <span className="text-xs text-slate-400">Total: {auditItems.length} activos</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 dark:border-white/5">
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-4 py-3">Serial & Placa</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Estación / Puesto</th>
                    <th className="px-4 py-3">Verificado Por</th>
                    <th className="px-5 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {auditItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3.5">
                        {item.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Verificado
                          </span>
                        ) : item.status === 'mismatch' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-[11px]">
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                            Novedad
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium text-[11px]">
                            <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-xs">
                            {item.serialNumber}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {item.assetCode}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-600 dark:text-slate-300">
                        {item.station}
                      </td>

                      <td className="px-4 py-3.5">
                        {item.verifiedBy ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                              {item.verifiedBy}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">{item.verifiedAt}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sin auditar</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {item.status !== 'verified' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                verifyAssetInAudit(item.serialNumber, item.station);
                                showToast(`Activo ${item.serialNumber} confirmado`, 'success', 'check_circle');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                            >
                              Confirmar Puesto
                            </button>
                            <button
                              onClick={() => openModal('discrepancy', item)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Reportar novedad"
                            >
                              <span className="material-symbols-outlined text-[17px]">report_problem</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[15px]">verified</span>
                            Auditado OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS LAYER                                                              */}
      {/* ========================================================================= */}

      {/* 1. Take Physical Inventory Modal */}
      {activeScheduleModal && (
        <TakeInventoryModal
          schedule={activeScheduleModal}
          onClose={() => setActiveScheduleModal(null)}
        />
      )}

      {/* 2. Email Alert Detail Modal */}
      {activeAlertModal && (
        <EmailAlertModal
          alert={activeAlertModal}
          onClose={() => setActiveAlertModal(null)}
        />
      )}

      {/* 3. Assign Instructor Modal */}
      {activeEnvAssignModal && (
        <AssignInstructorModal
          environment={activeEnvAssignModal}
          onClose={() => setActiveEnvAssignModal(null)}
        />
      )}

      {/* 4. Configure Administrator Destination Email Modal */}
      {showConfigEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                  Correo del Administrador
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dirección donde se remitirán las alertas por tomas físicas no realizadas
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAdminEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Correo Electrónico Oficial:
                </label>
                <input
                  type="email"
                  value={tempAdminEmail}
                  onChange={e => setTempAdminEmail(e.target.value)}
                  placeholder="javierpint@gmail.com"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Cuando venza un turno (6:00 AM, 12:00 M o 6:00 PM) sin toma física completada por el instructor del ambiente, el sistema generará y despachará la notificación formal a esta cuenta.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigEmail(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Guardar Destinatario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
