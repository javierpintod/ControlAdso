import React, { useState, useMemo } from 'react';
import { Environment, PhysicalInventorySchedule, ShiftType } from '../../types';
import { 
  CalendarDayCell, 
  getMonthCalendarDays, 
  getWeekDaysForDate, 
  getWeekRangeLabel, 
  parseLocalDate, 
  formatDateToISO, 
  shiftMonthDate, 
  shiftWeekDate,
  MONTH_NAMES_ES,
  WeekDayInfo
} from '../../utils/scheduleWeekUtils';

interface InventoryAuditCalendarProps {
  environments: Environment[];
  schedules: PhysicalInventorySchedule[];
  selectedDate: string; // 'all' or 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
  onSelectSchedule: (schedule: PhysicalInventorySchedule) => void;
  onSelectAlert: (scheduleId: string) => void;
  onAssignInstructor: (env: Environment) => void;
  onMarkMissed: (scheduleId: string) => void;
  onOpenPrintModal: () => void;
  adminEmailAddress: string;
}

export const InventoryAuditCalendar: React.FC<InventoryAuditCalendarProps> = ({
  environments,
  schedules,
  selectedDate,
  onSelectDate,
  onSelectSchedule,
  onSelectAlert,
  onAssignInstructor,
  onMarkMissed,
  onOpenPrintModal,
  adminEmailAddress
}) => {
  // Calendar Navigation State
  const [calendarMode, setCalendarMode] = useState<'month' | 'week'>('month');
  
  // Current view reference date
  const [viewDateStr, setViewDateStr] = useState<string>('2026-09-17');
  const viewDate = useMemo(() => parseLocalDate(viewDateStr), [viewDateStr]);
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Filters within the selected day/week schedules
  const [activeShiftFilter, setActiveShiftFilter] = useState<'all' | ShiftType>('all');
  const [activeEnvFilter, setActiveEnvFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  // Month cells (7 columns: Lun - Dom)
  const monthCells = useMemo(() => {
    return getMonthCalendarDays(viewYear, viewMonth, '2026-09-17');
  }, [viewYear, viewMonth]);

  // Current week days (Lunes a Sábado)
  const currentWeekDays: WeekDayInfo[] = useMemo(() => {
    return getWeekDaysForDate(viewDateStr);
  }, [viewDateStr]);
  const weekRangeLabel = useMemo(() => getWeekRangeLabel(currentWeekDays), [currentWeekDays]);

  // Aggregate schedule telemetry by date
  const schedulesByDate = useMemo(() => {
    const map = new Map<string, {
      total: number;
      completed: number;
      pending: number;
      missed: number;
    }>();

    schedules.forEach(s => {
      const current = map.get(s.date) || { total: 0, completed: 0, pending: 0, missed: 0 };
      current.total += 1;
      if (s.status === 'COMPLETADA') current.completed += 1;
      else if (s.status === 'NO_REALIZADA') current.missed += 1;
      else current.pending += 1;
      map.set(s.date, current);
    });

    return map;
  }, [schedules]);

  // Navigation handlers
  const handlePrev = () => {
    if (calendarMode === 'month') {
      setViewDateStr(prev => shiftMonthDate(prev, -1));
    } else {
      setViewDateStr(prev => shiftWeekDate(prev, -1));
    }
  };

  const handleNext = () => {
    if (calendarMode === 'month') {
      setViewDateStr(prev => shiftMonthDate(prev, 1));
    } else {
      setViewDateStr(prev => shiftWeekDate(prev, 1));
    }
  };

  const handleGoToday = () => {
    setViewDateStr('2026-09-17');
    onSelectDate('2026-09-17');
  };

  const handleSelectWeek = () => {
    onSelectDate('all');
  };

  // Determine current active selection label
  const selectionTitle = useMemo(() => {
    if (selectedDate === 'all') {
      return `Semana Completa (${weekRangeLabel}) • Lunes a Sábado`;
    }
    const dayDate = parseLocalDate(selectedDate);
    const dayOfWeek = dayDate.getDay();
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = MONTH_NAMES_ES;
    const isSaturday = dayOfWeek === 6;
    return `${dayNames[dayOfWeek]} ${dayDate.getDate()} de ${monthNames[dayDate.getMonth()]}, ${dayDate.getFullYear()}${isSaturday ? ' • Jornada Sabatina' : ''}`;
  }, [selectedDate, weekRangeLabel]);

  // Filtered schedules for the active selection
  const activeSchedules = useMemo(() => {
    return schedules.filter(s => {
      // Date filter
      if (selectedDate !== 'all') {
        if (s.date !== selectedDate) return false;
      } else {
        // Must belong to current week
        const weekDates = new Set(currentWeekDays.map(w => w.date));
        if (!weekDates.has(s.date)) return false;
      }

      // Shift filter
      if (activeShiftFilter !== 'all' && s.shift !== activeShiftFilter) return false;

      // Environment filter
      if (activeEnvFilter !== 'all' && s.environmentId !== activeEnvFilter) return false;

      // Status filter
      if (activeStatusFilter !== 'all' && s.status !== activeStatusFilter) return false;

      return true;
    });
  }, [schedules, selectedDate, currentWeekDays, activeShiftFilter, activeEnvFilter, activeStatusFilter]);

  // Group active schedules by shift (06:00, 12:00, 18:00)
  const shiftGroups = useMemo(() => {
    const shifts: {
      shift: ShiftType;
      title: string;
      subtitle: string;
      deadline: string;
      icon: string;
      badgeColor: string;
      schedules: PhysicalInventorySchedule[];
    }[] = [
      {
        shift: '06:00',
        title: '06:00 AM • Jornada Mañana / Apertura',
        subtitle: 'Apertura de ambientes y verificación de puestos de cómputo y maquinaria',
        deadline: '06:30 AM',
        icon: 'wb_sunny',
        badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
        schedules: []
      },
      {
        shift: '12:00',
        title: '12:00 M • Jornada Mediodía / Cambio de Turno',
        subtitle: 'Cotejo físico en relevo de instructores y aprendices de jornada',
        deadline: '12:30 PM',
        icon: 'wb_twilight',
        badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/50',
        schedules: []
      },
      {
        shift: '18:00',
        title: '06:00 PM • Jornada Tarde / Cierre Nocturno',
        subtitle: 'Cierre de laboratorios y precintado de gabinetes de herramientas',
        deadline: '06:30 PM',
        icon: 'nights_stay',
        badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/50',
        schedules: []
      }
    ];

    shifts.forEach(group => {
      group.schedules = activeSchedules.filter(s => s.shift === group.shift);
    });

    return shifts;
  }, [activeSchedules]);

  // Telemetry counts for the current selection
  const selectionTotal = activeSchedules.length;
  const selectionCompleted = activeSchedules.filter(s => s.status === 'COMPLETADA').length;
  const selectionMissed = activeSchedules.filter(s => s.status === 'NO_REALIZADA').length;
  const selectionPending = activeSchedules.filter(s => s.status === 'PENDIENTE').length;

  return (
    <div className="flex flex-col gap-6">

      {/* ========================================================================= */}
      {/* PASO 1: CALENDARIO INTERACTIVO (SELECCIÓN DE DÍA O SEMANA)                */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col gap-5">
        
        {/* Step 1 Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 text-[11px] font-bold border border-blue-200/60 dark:border-blue-800/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>PASO 1: SELECCIÓN EN EL CALENDARIO</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Seleccione un día específico o la semana completa
              </span>
            </div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-cyan-400 text-2xl">event</span>
              <span>Calendario Institucional de Tomas de Inventario</span>
            </h2>
          </div>

          {/* Navigation & View Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Prev / Next month/week */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                title="Anterior"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              <span className="px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white min-w-[130px] text-center">
                {calendarMode === 'month' 
                  ? `${MONTH_NAMES_ES[viewMonth]} ${viewYear}`
                  : `Semana: ${currentWeekDays[0]?.formattedDate} - ${currentWeekDays[5]?.formattedDate}`
                }
              </span>

              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                title="Siguiente"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            {/* Quick Hoy button */}
            <button
              onClick={handleGoToday}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              title="Ir al día de hoy (17 Sep 2026)"
            >
              Hoy
            </button>

            {/* Calendar mode switcher (Mes vs Semana) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setCalendarMode('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  calendarMode === 'month'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">calendar_view_month</span>
                <span>Mes</span>
              </button>
              <button
                onClick={() => setCalendarMode('week')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  calendarMode === 'week'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">calendar_view_week</span>
                <span>Semana (Lun - Sáb)</span>
              </button>
            </div>

            {/* Full Week Selection Button */}
            <button
              onClick={handleSelectWeek}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                selectedDate === 'all'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 border border-blue-200/80 hover:bg-blue-100'
              }`}
              title="Seleccionar y ver los horarios de toda la semana de Lunes a Sábado"
            >
              <span className="material-symbols-outlined text-[16px]">view_week</span>
              <span>Seleccionar Semana Completa (Lun - Sáb)</span>
            </button>

            {/* Print Sheet Action */}
            <button
              onClick={onOpenPrintModal}
              className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              title="Imprimir planilla de toma semanal"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Planilla PDF</span>
            </button>
          </div>
        </div>

        {/* Quick instruction notice */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-[18px]">touch_app</span>
            <span>Haga clic sobre cualquier día para ver sus <strong>3 horarios de toma</strong> (06:00 AM, 12:00 M, 06:00 PM), o seleccione <strong>"Semana Completa"</strong>.</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Completada</span>
            </span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Pendiente</span>
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Alerta / Vencida</span>
            </span>
            <span className="flex items-center gap-1 text-amber-800 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
              ★ Sábado
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CALENDAR GRID: MONTH VIEW                                                 */}
        {/* ========================================================================= */}
        {calendarMode === 'month' && (
          <div className="flex flex-col">
            {/* Weekday headers: Lunes a Domingo */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
              <span>LUN</span>
              <span>MAR</span>
              <span>MIÉ</span>
              <span>JUE</span>
              <span>VIE</span>
              <span className="text-amber-800 dark:text-amber-300 flex items-center justify-center gap-0.5 font-black">
                <span>SÁB</span>
                <span className="text-[10px]">★</span>
              </span>
              <span className="text-slate-400">DOM</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
              {monthCells.map((cell) => {
                const isSelected = selectedDate === cell.date;
                const stats = schedulesByDate.get(cell.date);
                const hasSchedules = stats && stats.total > 0;

                return (
                  <button
                    key={cell.date}
                    onClick={() => onSelectDate(cell.date)}
                    className={`min-h-[84px] sm:min-h-[96px] p-2 rounded-xl text-left transition-all relative flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/40 shadow-sm z-10'
                        : cell.isSaturday
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-700/50 hover:border-amber-400'
                        : cell.isToday
                        ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 hover:border-blue-400'
                        : cell.isCurrentMonth
                        ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                        : 'bg-slate-50/40 dark:bg-slate-950/40 border-dashed border-slate-200/60 dark:border-white/5 opacity-50'
                    }`}
                  >
                    {/* Top row in cell: day number and tag */}
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className={`text-xs sm:text-sm font-bold font-mono rounded-md px-1.5 py-0.5 ${
                        cell.isToday
                          ? 'bg-blue-600 text-white'
                          : isSelected
                          ? 'bg-blue-200 dark:bg-blue-900 text-blue-950 dark:text-blue-200'
                          : cell.isSaturday
                          ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {cell.dayNumber}
                      </span>

                      {cell.isSaturday && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-900/60 px-1 py-0.2 rounded shrink-0">
                          Sabatino
                        </span>
                      )}

                      {cell.isSunday && (
                        <span className="text-[9px] text-slate-400">
                          No lectivo
                        </span>
                      )}
                    </div>

                    {/* Middle / Telemetry badges for this day */}
                    {hasSchedules ? (
                      <div className="flex flex-col gap-1 my-1">
                        <div className="flex items-center justify-between text-[10px] font-mono font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">
                            {stats.total} tomas
                          </span>
                          <div className="flex items-center gap-1">
                            {stats.completed > 0 && (
                              <span className="text-emerald-600 dark:text-emerald-400" title={`${stats.completed} completadas`}>
                                ✓{stats.completed}
                              </span>
                            )}
                            {stats.pending > 0 && (
                              <span className="text-amber-600 dark:text-amber-400" title={`${stats.pending} pendientes`}>
                                ⌛{stats.pending}
                              </span>
                            )}
                            {stats.missed > 0 && (
                              <span className="text-rose-600 dark:text-rose-400 font-bold" title={`${stats.missed} vencidas / alerta`}>
                                !{stats.missed}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Shift dot indicators (6am, 12m, 6pm) */}
                        <div className="flex items-center gap-1">
                          <span 
                            className={`h-1.5 flex-1 rounded-full ${
                              stats.completed >= 3 ? 'bg-emerald-500' : stats.missed > 0 ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            title="Progreso de las 3 jornadas"
                          ></span>
                        </div>
                      </div>
                    ) : (
                      !cell.isSunday && cell.isCurrentMonth && (
                        <span className="text-[10px] text-slate-400 italic">
                          Sin turnos
                        </span>
                      )
                    )}

                    {/* Bottom indication when selected */}
                    {isSelected && (
                      <div className="text-[9px] font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        <span>Seleccionado</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CALENDAR GRID: WEEK VIEW (LUNES A SÁBADO • 6 DÍAS REGLAMENTARIOS)          */}
        {/* ========================================================================= */}
        {calendarMode === 'week' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {currentWeekDays.map((day) => {
              const isSelected = selectedDate === day.date;
              const stats = schedulesByDate.get(day.date);
              const total = stats?.total || 0;
              const completed = stats?.completed || 0;
              const pending = stats?.pending || 0;
              const missed = stats?.missed || 0;

              return (
                <button
                  key={day.date}
                  onClick={() => onSelectDate(day.date)}
                  className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/40 shadow-sm'
                      : day.isSaturday
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 hover:border-amber-400'
                      : day.isToday
                      ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 hover:border-blue-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {day.dayName}
                    </span>
                    {day.isSaturday && (
                      <span className="text-[10px] font-black bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 px-1 rounded">
                        ★ Sabatino
                      </span>
                    )}
                    {day.isToday && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Hoy"></span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black font-mono ${
                      isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {day.dayNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {day.monthName}
                    </span>
                  </div>

                  {/* Telemetry pills */}
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Tomas totales:</span>
                      <span className="font-bold">{total}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Completadas:</span>
                      <span className="font-bold">✓ {completed}</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                      <span>Pendientes:</span>
                      <span className="font-bold">⌛ {pending}</span>
                    </div>
                    {missed > 0 && (
                      <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold">
                        <span>Con Alerta:</span>
                        <span>! {missed}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-center">
                    {isSelected ? (
                      <span className="text-blue-600 dark:text-cyan-400 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Viendo Horarios</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 hover:text-blue-600 transition-colors">
                        Ver 3 Horarios →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* PASO 2: HORARIOS DE TOMA DE INVENTARIO FÍSICO                              */}
      {/* ========================================================================= */}
      <div id="horarios-toma-section" className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-xs flex flex-col gap-5">
        
        {/* Step 2 Header with Selection Title and Quick Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                <span>PASO 2: HORARIOS DE TOMA</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                3 Horarios Diarios: 06:00 AM • 12:00 M • 06:00 PM
              </span>
            </div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">browse_activity</span>
              <span>{selectionTitle}</span>
            </h2>
          </div>

          {/* Telemetry chips for current view */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
              Total: <strong>{selectionTotal}</strong> turnos
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-mono font-semibold">
              ✓ <strong>{selectionCompleted}</strong> completadas
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 text-xs font-mono font-semibold">
              ⌛ <strong>{selectionPending}</strong> pendientes
            </div>
            {selectionMissed > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 text-xs font-mono font-bold">
                ! <strong>{selectionMissed}</strong> con alerta
              </div>
            )}
          </div>
        </div>

        {/* Day Selector Quick Ribbon (To switch days quickly without scrolling) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">
            Cambiar día:
          </span>
          <button
            onClick={() => onSelectDate('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
              selectedDate === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>Toda la Semana</span>
          </button>

          {currentWeekDays.map(day => {
            const isDaySelected = selectedDate === day.date;
            return (
              <button
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  isDaySelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : day.isSaturday
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 hover:bg-amber-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{day.shortDay} {day.dayNumber}</span>
                {day.isSaturday && <span className="text-[10px]">★</span>}
                {day.isToday && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
              </button>
            );
          })}
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Shift Filter buttons */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-white/10">
              <button
                onClick={() => setActiveShiftFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeShiftFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Todos los Horarios
              </button>
              <button
                onClick={() => setActiveShiftFilter('06:00')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeShiftFilter === '06:00' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                06:00 AM Apertura
              </button>
              <button
                onClick={() => setActiveShiftFilter('12:00')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeShiftFilter === '12:00' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                12:00 M Mediodía
              </button>
              <button
                onClick={() => setActiveShiftFilter('18:00')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeShiftFilter === '18:00' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                06:00 PM Cierre
              </button>
            </div>

            {/* Environment Filter */}
            <select
              value={activeEnvFilter}
              onChange={(e) => setActiveEnvFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">Todos los Ambientes ({environments.length})</option>
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">Todos los Estados</option>
              <option value="PENDIENTE">Sólo Pendientes</option>
              <option value="COMPLETADA">Sólo Completadas</option>
              <option value="NO_REALIZADA">Sólo Alertas / No Realizadas</option>
            </select>

          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Mostrando {activeSchedules.length} tomas programadas
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHIFTS SECTIONS (06:00 AM • 12:00 M • 06:00 PM)                            */}
        {/* ========================================================================= */}
        {activeSchedules.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">event_busy</span>
            <p className="text-sm font-semibold">No hay tomas físicas para la combinación de filtros seleccionada</p>
            <p className="text-xs text-slate-400 mt-1">Pruebe seleccionando "Todos los Horarios" o "Todos los Ambientes"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {shiftGroups
              .filter(group => activeShiftFilter === 'all' || activeShiftFilter === group.shift)
              .map(group => {
                if (group.schedules.length === 0) return null;

                return (
                  <div 
                    key={group.shift} 
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 flex flex-col gap-4"
                  >
                    {/* Shift Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border flex items-center gap-1.5 shadow-2xs ${group.badgeColor}`}>
                          <span className="material-symbols-outlined text-[16px]">{group.icon}</span>
                          <span>{group.title}</span>
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
                          {group.subtitle}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-400">Límite reglamentario:</span>
                        <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                          ⏰ {group.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Environment Shift Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.schedules.map(schedule => {
                        const env = environments.find(e => e.id === schedule.environmentId);
                        const isPending = schedule.status === 'PENDIENTE';
                        const isCompleted = schedule.status === 'COMPLETADA';
                        const isMissed = schedule.status === 'NO_REALIZADA';
                        const isSaturdaySched = schedule.shiftLabel.toLowerCase().includes('sabat') || schedule.date.endsWith('19');

                        return (
                          <div
                            key={schedule.id}
                            className={`p-4 rounded-xl bg-white dark:bg-slate-800 border transition-all flex flex-col justify-between gap-3 shadow-2xs ${
                              isCompleted
                                ? 'border-emerald-200 dark:border-emerald-900/50'
                                : isMissed
                                ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'
                                : 'border-slate-200 dark:border-white/10 hover:border-blue-400'
                            }`}
                          >
                            <div>
                              {/* Card Date and Status row */}
                              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-white/5 text-xs">
                                <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                                  <span>📅 {schedule.date}</span>
                                  {isSaturdaySched && (
                                    <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200 text-[10px] font-bold">
                                      SÁB
                                    </span>
                                  )}
                                </span>

                                {isCompleted ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                    Completada
                                  </span>
                                ) : isMissed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-[11px] border border-rose-500/30">
                                    <span className="material-symbols-outlined text-[13px]">error</span>
                                    Alerta Enviada
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold text-[11px] border border-amber-500/20">
                                    <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                                    Pendiente
                                  </span>
                                )}
                              </div>

                              {/* Environment info */}
                              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white leading-snug">
                                {schedule.environmentName}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {env?.building} • {env?.floor} • {schedule.totalItems} equipos asignados
                              </p>

                              {/* Instructor in charge */}
                              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {schedule.instructorName.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                                      {schedule.instructorName}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono truncate">
                                      {schedule.instructorEmail}
                                    </div>
                                  </div>
                                </div>

                                {env && (
                                  <button
                                    onClick={() => onAssignInstructor(env)}
                                    className="text-slate-400 hover:text-blue-600 p-1"
                                    title="Cambiar instructor asignado"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">edit</span>
                                  </button>
                                )}
                              </div>

                              {/* Status Note or Certification */}
                              {isCompleted && (
                                <div className="mt-2.5 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200/50">
                                  ✓ Certificado: {schedule.verifiedCount}/{schedule.totalItems} verificados por {schedule.completedBy} a las {schedule.completedAt}
                                </div>
                              )}

                              {isMissed && (
                                <div className="mt-2.5 text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50/60 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200/50">
                                  ⚠️ Venció a las {schedule.deadlineTime}. Correo despachado al Admin ({adminEmailAddress}).
                                </div>
                              )}

                              {isPending && (
                                <div className="mt-2.5 text-[11px] text-amber-700 dark:text-amber-400">
                                  ⏰ Plazo de cierre: {schedule.deadlineTime} (tolerancia 30 min)
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => onSelectSchedule(schedule)}
                                    className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">checklist</span>
                                    <span>Realizar Toma Física</span>
                                  </button>

                                  <button
                                    onClick={() => onMarkMissed(schedule.id)}
                                    className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs transition-colors shrink-0"
                                    title="Simular corte horario vencido y enviar correo al Admin"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">notification_important</span>
                                  </button>
                                </>
                              ) : isMissed ? (
                                <>
                                  <button
                                    onClick={() => onSelectAlert(schedule.id)}
                                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">mail</span>
                                    <span>Ver Alerta Enviada</span>
                                  </button>
                                  <button
                                    onClick={() => onSelectSchedule(schedule)}
                                    className="px-2.5 py-2 rounded-lg border border-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
                                    title="Regularizar toma extemporánea"
                                  >
                                    Regularizar
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => onSelectSchedule(schedule)}
                                  className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[15px]">verified</span>
                                  <span>Ver Detalle y Certificado</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

      </div>

    </div>
  );
};
