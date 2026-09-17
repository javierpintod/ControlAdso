import React from 'react';
import { Environment, PhysicalInventorySchedule, ShiftType } from '../../types';
import { WeekDayInfo } from '../../utils/scheduleWeekUtils';

interface WeeklyMatrixGridProps {
  weekDays: WeekDayInfo[];
  environments: Environment[];
  schedules: PhysicalInventorySchedule[];
  selectedEnvFilter: string;
  selectedShiftFilter: string;
  selectedStatusFilter: string;
  onSelectSchedule: (schedule: PhysicalInventorySchedule) => void;
  onSelectAlert: (scheduleId: string) => void;
  onAssignInstructor: (env: Environment) => void;
  onMarkMissed: (scheduleId: string) => void;
}

export const WeeklyMatrixGrid: React.FC<WeeklyMatrixGridProps> = ({
  weekDays,
  environments,
  schedules,
  selectedEnvFilter,
  selectedShiftFilter,
  selectedStatusFilter,
  onSelectSchedule,
  onSelectAlert,
  onAssignInstructor,
  onMarkMissed
}) => {
  const shifts: { shift: ShiftType; label: string; icon: string }[] = [
    { shift: '06:00', label: '06:00 AM • Apertura', icon: 'wb_sunny' },
    { shift: '12:00', label: '12:00 M • Mediodía', icon: 'wb_twilight' },
    { shift: '18:00', label: '06:00 PM • Cierre', icon: 'nights_stay' }
  ];

  const visibleShifts = selectedShiftFilter === 'all'
    ? shifts
    : shifts.filter(s => s.shift === selectedShiftFilter);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[1100px] grid grid-cols-6 gap-3">
        {weekDays.map(day => {
          const daySchedules = schedules.filter(s => s.date === day.date);
          const dayCompleted = daySchedules.filter(s => s.status === 'COMPLETADA').length;
          const dayMissed = daySchedules.filter(s => s.status === 'NO_REALIZADA').length;
          const dayPending = daySchedules.filter(s => s.status === 'PENDIENTE').length;
          const dayTotal = daySchedules.length;
          const dayPct = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;

          return (
            <div
              key={day.date}
              className={`flex flex-col rounded-2xl border transition-all overflow-hidden ${
                day.isSaturday
                  ? 'border-amber-300 dark:border-amber-600/50 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm ring-1 ring-amber-400/20'
                  : day.isToday
                  ? 'border-blue-300 dark:border-blue-600/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-sm ring-1 ring-blue-500/20'
                  : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xs'
              }`}
            >
              {/* Day Column Header */}
              <div
                className={`p-3 border-b flex flex-col gap-1.5 ${
                  day.isSaturday
                    ? 'bg-amber-100/70 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/40'
                    : day.isToday
                    ? 'bg-blue-100/70 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-black uppercase tracking-wider ${
                    day.isSaturday ? 'text-amber-900 dark:text-amber-300' : 'text-slate-800 dark:text-white'
                  }`}>
                    {day.dayName}
                  </span>

                  {day.isSaturday ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] tracking-wide flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[13px]">star</span>
                      <span>SÁBADO</span>
                    </span>
                  ) : day.isToday ? (
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] tracking-wide flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      <span>HOY</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400">
                      Día #{day.dayNumber}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {day.dayNumber} {day.monthName}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                    {dayCompleted}/{dayTotal} ({dayPct}%)
                  </span>
                </div>

                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${dayPct}%` }}
                    title={`${dayCompleted} completadas`}
                  />
                  {dayMissed > 0 && (
                    <div
                      className="bg-rose-500 h-full transition-all"
                      style={{ width: `${(dayMissed / (dayTotal || 1)) * 100}%` }}
                      title={`${dayMissed} alertas`}
                    />
                  )}
                </div>

                {day.isSaturday && (
                  <div className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">construction</span>
                    <span>Jornada Sabatina Obligatoria</span>
                  </div>
                )}
              </div>

              {/* Day Shifts Body */}
              <div className="p-2 flex flex-col gap-2.5 flex-1">
                {visibleShifts.map(sInfo => {
                  const shiftSchedules = daySchedules.filter(s => {
                    if (s.shift !== sInfo.shift) return false;
                    if (selectedEnvFilter !== 'all' && s.environmentId !== selectedEnvFilter) return false;
                    if (selectedStatusFilter !== 'all' && s.status !== selectedStatusFilter) return false;
                    return true;
                  });

                  return (
                    <div
                      key={sInfo.shift}
                      className="flex flex-col gap-1.5 rounded-xl p-1.5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5"
                    >
                      {/* Shift Header Tag */}
                      <div className="flex items-center justify-between px-1.5 py-0.5">
                        <div className="flex items-center gap-1 text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300">
                          <span className="material-symbols-outlined text-[14px] text-blue-600 dark:text-cyan-400">
                            {sInfo.icon}
                          </span>
                          <span>{sInfo.shift === '06:00' ? '6:00 AM' : sInfo.shift === '12:00' ? '12:00 M' : '6:00 PM'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Límite +30m
                        </span>
                      </div>

                      {/* Shift Environment Cards */}
                      {shiftSchedules.length === 0 ? (
                        <div className="p-2 text-center text-[10px] text-slate-400 italic">
                          Sin turnos que coincidan con el filtro
                        </div>
                      ) : (
                        shiftSchedules.map(sched => {
                          const env = environments.find(e => e.id === sched.environmentId);
                          const isCompleted = sched.status === 'COMPLETADA';
                          const isMissed = sched.status === 'NO_REALIZADA';
                          const isPending = sched.status === 'PENDIENTE';

                          return (
                            <div
                              key={sched.id}
                              className={`p-2 rounded-lg border transition-all text-xs flex flex-col gap-1.5 ${
                                isCompleted
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40'
                                  : isMissed
                                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300/80 dark:border-rose-800/50'
                                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-white/10 hover:border-blue-400'
                              }`}
                            >
                              {/* Environment & Status */}
                              <div className="flex items-start justify-between gap-1">
                                <div className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight line-clamp-1">
                                  {sched.environmentName.replace('Ambiente ', 'Amb. ')}
                                </div>
                                {isCompleted ? (
                                  <span className="text-emerald-700 dark:text-emerald-400 shrink-0" title="Completada">
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  </span>
                                ) : isMissed ? (
                                  <span className="text-rose-600 dark:text-rose-400 shrink-0" title="No Realizada • Alerta Enviada">
                                    <span className="material-symbols-outlined text-[16px]">error</span>
                                  </span>
                                ) : (
                                  <span className="text-amber-600 dark:text-amber-400 shrink-0" title="Pendiente">
                                    <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                                  </span>
                                )}
                              </div>

                              {/* Instructor & Count */}
                              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                <span className="truncate max-w-[100px]" title={sched.instructorName}>
                                  {sched.instructorName.split(' ')[0]} {sched.instructorName.split(' ')[1]?.charAt(0)}.
                                </span>
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                  {isCompleted ? `${sched.verifiedCount}/${sched.totalItems}` : `${sched.totalItems} eq.`}
                                </span>
                              </div>

                              {/* Quick Action Button */}
                              <div className="pt-1 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-1">
                                {isPending ? (
                                  <div className="flex items-center gap-1 w-full">
                                    <button
                                      onClick={() => onSelectSchedule(sched)}
                                      className="flex-1 py-1 px-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors text-center truncate"
                                      title="Realizar toma física del inventario"
                                    >
                                      Toma Física
                                    </button>
                                    <button
                                      onClick={() => onMarkMissed(sched.id)}
                                      className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                      title="Simular que venció el plazo reglamentario y alertar al Admin"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">notification_important</span>
                                    </button>
                                  </div>
                                ) : isMissed ? (
                                  <div className="flex items-center gap-1 w-full">
                                    <button
                                      onClick={() => onSelectAlert(sched.id)}
                                      className="flex-1 py-1 px-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition-colors truncate"
                                      title="Ver alerta por correo enviada al Administrador"
                                    >
                                      Ver Alerta
                                    </button>
                                    <button
                                      onClick={() => onSelectSchedule(sched)}
                                      className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                      title="Regularizar toma extemporánea"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">edit_note</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => onSelectSchedule(sched)}
                                    className="w-full py-0.5 px-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-[10px] transition-colors truncate text-center"
                                  >
                                    Ver Certificado
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
