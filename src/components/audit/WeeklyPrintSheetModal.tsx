import React from 'react';
import { Environment, PhysicalInventorySchedule } from '../../types';
import { WeekDayInfo, getWeekRangeLabel } from '../../utils/scheduleWeekUtils';
import { useApp } from '../../context/AppContext';

interface WeeklyPrintSheetModalProps {
  weekDays: WeekDayInfo[];
  environments: Environment[];
  schedules: PhysicalInventorySchedule[];
  onClose: () => void;
}

export const WeeklyPrintSheetModal: React.FC<WeeklyPrintSheetModalProps> = ({
  weekDays,
  environments,
  schedules,
  onClose
}) => {
  const { institutionProfile } = useApp();
  const weekLabel = getWeekRangeLabel(weekDays);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Toolbar (Non-printable) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-400 text-[22px]">print</span>
            <div>
              <h3 className="font-bold text-sm">Planilla Oficial de Control Semanal (Lunes a Sábado)</h3>
              <p className="text-[11px] text-slate-400">Formato reglamentario de 3 jornadas diarias para archivo físico</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 sm:p-8 overflow-y-auto print:p-0 print:overflow-visible">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                  {institutionProfile.shortName} • {institutionProfile.name}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {institutionProfile.centerName} • {institutionProfile.regional} • NIT: {institutionProfile.nit}
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1 uppercase tracking-wide">
                PLANILLA OFICIAL DE TOMA FÍSICA SEMANAL DE INVENTARIO (INCLUYE SÁBADO)
              </p>
            </div>

            <div className="sm:text-right text-xs text-slate-600 font-mono">
              <div className="font-bold text-slate-900 text-sm">{weekLabel}</div>
              <div>Turnos: 06:00 AM • 12:00 M • 06:00 PM</div>
              <div className="text-[10px] text-slate-500">6 Días Reglamentarios (Lunes a Sábado)</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700 border-b border-slate-300">
                  <th className="border border-slate-300 p-2 w-48">Ambiente & Instructor</th>
                  {weekDays.map(d => (
                    <th
                      key={d.date}
                      className={`border border-slate-300 p-2 text-center ${
                        d.isSaturday ? 'bg-amber-100/70 font-black text-amber-950' : ''
                      }`}
                    >
                      <div>{d.dayName}</div>
                      <div className="text-[9px] font-mono text-slate-500">{d.dayNumber} {d.monthName}</div>
                      {d.isSaturday && (
                        <div className="text-[8px] bg-amber-200 text-amber-900 rounded px-1 py-0.2 mt-0.5 inline-block">
                          SABATINO
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {environments.map(env => (
                  <React.Fragment key={env.id}>
                    {/* 3 Shifts per environment */}
                    {(['06:00', '12:00', '18:00'] as const).map((shift, sIdx) => {
                      const shiftLabel = shift === '06:00' ? '6:00 AM' : shift === '12:00' ? '12:00 M' : '6:00 PM';
                      return (
                        <tr key={`${env.id}-${shift}`} className="border-b border-slate-200 hover:bg-slate-50/50">
                          {sIdx === 0 ? (
                            <td
                              rowSpan={3}
                              className="border border-slate-300 p-2.5 align-top bg-slate-50 font-medium"
                            >
                              <div className="font-bold text-slate-900">{env.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {env.building} • {env.floor}
                              </div>
                              <div className="text-[10px] text-slate-700 font-semibold mt-1">
                                Custodio: {env.assignedInstructorName || 'Sin Asignar'}
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono">
                                Total: {env.assignedCount} bienes
                              </div>
                            </td>
                          ) : null}

                          {weekDays.map(dayInfo => {
                            const sched = schedules.find(
                              s => s.environmentId === env.id && s.date === dayInfo.date && s.shift === shift
                            );

                            return (
                              <td
                                key={`${dayInfo.date}-${shift}`}
                                className={`border border-slate-300 p-1.5 text-center text-[10px] ${
                                  dayInfo.isSaturday ? 'bg-amber-50/30' : ''
                                }`}
                              >
                                <div className="font-mono text-[9px] font-bold text-slate-500">
                                  {shiftLabel}
                                </div>
                                {sched?.status === 'COMPLETADA' ? (
                                  <div className="mt-0.5 text-emerald-700 font-bold">
                                    ✓ {sched.verifiedCount}/{sched.totalItems}
                                    <div className="text-[8px] font-mono text-slate-400">{sched.completedAt}</div>
                                  </div>
                                ) : sched?.status === 'NO_REALIZADA' ? (
                                  <div className="mt-0.5 text-rose-600 font-bold">
                                    ✕ ALERTA
                                    <div className="text-[8px] font-mono text-rose-500">Vencida</div>
                                  </div>
                                ) : (
                                  <div className="mt-0.5 text-slate-400">
                                    [ &nbsp;&nbsp;&nbsp;&nbsp; ]
                                    <div className="text-[8px] font-mono">Pend.</div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Institutional Signatures Strip */}
          <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-700">
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-mono font-medium">
                {institutionProfile.email}
              </div>
              <div className="font-bold text-slate-900">Coordinación Académica & Logística</div>
              <div className="text-[10px] text-slate-500">Firma & Sello de Verificación Semanal</div>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-mono font-medium">
                Control de Almacén & Activos
              </div>
              <div className="font-bold text-slate-900">Responsable de Inventario Institucional</div>
              <div className="text-[10px] text-slate-500">Revisión de Novedades & Faltantes</div>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-mono font-medium">
                Jornada Sabatina Incluida
              </div>
              <div className="font-bold text-slate-900">Custodios de Talleres & Laboratorios</div>
              <div className="text-[10px] text-slate-500">Certificación In Situ de 6 Días</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
