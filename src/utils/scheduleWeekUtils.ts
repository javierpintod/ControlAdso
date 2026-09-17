import { Environment, PhysicalInventorySchedule, ShiftType } from '../types';

export interface WeekDayInfo {
  date: string;            // 'YYYY-MM-DD'
  dayName: string;        // 'Lunes', 'Martes', etc.
  shortDay: string;       // 'Lun', 'Mar', etc.
  dayNumber: number;      // 14, 19, etc.
  monthName: string;      // 'Sep', etc.
  isSaturday: boolean;    // true for Sábado
  isToday: boolean;       // true if today
  formattedDate: string;  // 'Lun 14 Sep'
}

/**
 * Safely parse a YYYY-MM-DD string into a local Date object without timezone drift
 */
export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 12, 0, 0);
}

/**
 * Safely format Date into 'YYYY-MM-DD'
 */
export function formatDateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface CalendarDayCell {
  date: string;            // 'YYYY-MM-DD'
  dayNumber: number;      // 1..31
  dayOfWeek: number;      // 0=Dom, 1=Lun, ..., 6=Sáb
  dayName: string;        // 'Lunes', 'Martes', etc.
  shortDay: string;       // 'Lun', 'Mar', etc.
  isCurrentMonth: boolean;
  isToday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  formattedDate: string;
}

export const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MONTH_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export const DAY_NAMES_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const DAY_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Returns full 7-column calendar cells (Monday to Sunday) for the given month and year.
 */
export function getMonthCalendarDays(year: number, month: number, todayStr: string = '2026-09-17'): CalendarDayCell[] {
  const firstDay = new Date(year, month, 1, 12, 0, 0);
  const lastDay = new Date(year, month + 1, 0, 12, 0, 0);

  const startDayOfWeek = firstDay.getDay();
  const leadingDaysCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const cells: CalendarDayCell[] = [];

  for (let i = leadingDaysCount; i > 0; i--) {
    const d = new Date(year, month, 1 - i, 12, 0, 0);
    const dateIso = formatDateToISO(d);
    const dayOfWeek = d.getDay();
    cells.push({
      date: dateIso,
      dayNumber: d.getDate(),
      dayOfWeek,
      dayName: DAY_NAMES_ES[dayOfWeek],
      shortDay: DAY_SHORT_ES[dayOfWeek],
      isCurrentMonth: false,
      isToday: dateIso === todayStr,
      isSaturday: dayOfWeek === 6,
      isSunday: dayOfWeek === 0,
      formattedDate: `${DAY_SHORT_ES[dayOfWeek]} ${d.getDate()} ${MONTH_SHORT_ES[d.getMonth()]}`
    });
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const d = new Date(year, month, day, 12, 0, 0);
    const dateIso = formatDateToISO(d);
    const dayOfWeek = d.getDay();
    cells.push({
      date: dateIso,
      dayNumber: day,
      dayOfWeek,
      dayName: DAY_NAMES_ES[dayOfWeek],
      shortDay: DAY_SHORT_ES[dayOfWeek],
      isCurrentMonth: true,
      isToday: dateIso === todayStr,
      isSaturday: dayOfWeek === 6,
      isSunday: dayOfWeek === 0,
      formattedDate: `${DAY_SHORT_ES[dayOfWeek]} ${day} ${MONTH_SHORT_ES[month]}`
    });
  }

  const remainingCells = 7 - (cells.length % 7);
  if (remainingCells < 7) {
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(year, month + 1, i, 12, 0, 0);
      const dateIso = formatDateToISO(d);
      const dayOfWeek = d.getDay();
      cells.push({
        date: dateIso,
        dayNumber: i,
        dayOfWeek,
        dayName: DAY_NAMES_ES[dayOfWeek],
        shortDay: DAY_SHORT_ES[dayOfWeek],
        isCurrentMonth: false,
        isToday: dateIso === todayStr,
        isSaturday: dayOfWeek === 6,
        isSunday: dayOfWeek === 0,
        formattedDate: `${DAY_SHORT_ES[dayOfWeek]} ${i} ${MONTH_SHORT_ES[d.getMonth()]}`
      });
    }
  }

  return cells;
}

/**
 * Shifts date by month delta
 */
export function shiftMonthDate(currentDateStr: string, monthsDelta: number): string {
  const d = parseLocalDate(currentDateStr);
  d.setMonth(d.getMonth() + monthsDelta);
  return formatDateToISO(d);
}

/**
 * Returns Monday through Saturday for the week containing the given date.
 * By standard Colombian vocational / educational practice, Saturday is included.
 */
export function getWeekDaysForDate(targetDateStr: string = '2026-09-17'): WeekDayInfo[] {
  const targetDate = parseLocalDate(targetDateStr);
  const targetDayOfWeek = targetDate.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  
  // Calculate distance from Monday (day 1)
  // If Sunday (0), we consider it the previous week or start on Monday of this cycle
  const diffToMonday = targetDayOfWeek === 0 ? -6 : 1 - targetDayOfWeek;
  
  const mondayDate = new Date(targetDate);
  mondayDate.setDate(targetDate.getDate() + diffToMonday);

  const todayStr = '2026-09-17'; // Anchor to current app context date or system date

  // Return 6 days: Lunes (1), Martes (2), Miércoles (3), Jueves (4), Viernes (5), Sábado (6)
  const weekDays: WeekDayInfo[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    const dateIso = formatDateToISO(d);
    const dayOfWeek = d.getDay();
    const isSaturday = dayOfWeek === 6;

    weekDays.push({
      date: dateIso,
      dayName: DAY_NAMES_ES[dayOfWeek],
      shortDay: DAY_SHORT_ES[dayOfWeek],
      dayNumber: d.getDate(),
      monthName: MONTH_SHORT_ES[d.getMonth()],
      isSaturday,
      isToday: dateIso === todayStr,
      formattedDate: `${DAY_SHORT_ES[dayOfWeek]} ${d.getDate()} ${MONTH_SHORT_ES[d.getMonth()]}`
    });
  }

  return weekDays;
}

/**
 * Returns human readable week range header:
 * e.g. "Semana del 14 al 19 de Septiembre, 2026 (Lunes a Sábado)"
 */
export function getWeekRangeLabel(weekDays: WeekDayInfo[]): string {
  if (weekDays.length === 0) return '';
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  const firstDate = parseLocalDate(first.date);
  const lastDate = parseLocalDate(last.date);

  const year = lastDate.getFullYear();
  const monthName = MONTH_NAMES_ES[lastDate.getMonth()];

  if (firstDate.getMonth() === lastDate.getMonth()) {
    return `Semana del ${first.dayNumber} al ${last.dayNumber} de ${monthName}, ${year}`;
  } else {
    const firstMonth = MONTH_NAMES_ES[firstDate.getMonth()];
    return `Semana del ${first.dayNumber} de ${firstMonth} al ${last.dayNumber} de ${monthName}, ${year}`;
  }
}

/**
 * Shift the week by +/- 1 or more weeks
 */
export function shiftWeekDate(currentDateStr: string, weeksDelta: number): string {
  const d = parseLocalDate(currentDateStr);
  d.setDate(d.getDate() + weeksDelta * 7);
  return formatDateToISO(d);
}

/**
 * Generate full weekly physical inventory schedules (Lunes a Sábado) for a set of environments
 */
export function generateWeeklyPhysicalSchedules(
  environments: Environment[],
  baseDateStr: string = '2026-09-17'
): PhysicalInventorySchedule[] {
  const weekDays = getWeekDaysForDate(baseDateStr);
  const schedules: PhysicalInventorySchedule[] = [];

  const shifts: { shift: ShiftType; label: string; deadline: string }[] = [
    { shift: '06:00', label: '06:00 AM • Apertura', deadline: '06:30 AM' },
    { shift: '12:00', label: '12:00 M • Mediodía', deadline: '12:30 PM' },
    { shift: '18:00', label: '06:00 PM • Cierre', deadline: '06:30 PM' }
  ];

  weekDays.forEach((dayInfo) => {
    const isSaturday = dayInfo.isSaturday;
    const isPast = dayInfo.date < '2026-09-17';
    const isToday = dayInfo.date === '2026-09-17';

    environments.forEach((env) => {
      const instructorName = env.assignedInstructorName || 'Ing. Instructor Custodio';
      const instructorEmail = env.assignedInstructorEmail || 'instructor@sena.edu.co';
      const instructorId = env.assignedInstructorId || 'usr-inst-1';
      const totalItems = env.assignedCount || 15;

      shifts.forEach((s) => {
        const id = `sched-${env.id}-${dayInfo.date}-${s.shift.replace(':', '')}`;

        // Shift label customized for Saturday if applicable
        const shiftLabel = isSaturday
          ? s.shift === '06:00'
            ? '06:00 AM • Apertura Taller Sabatino'
            : s.shift === '12:00'
            ? '12:00 M • Jornada Técnica Sabatina'
            : '06:00 PM • Cierre Jornada Sabatina'
          : s.shift === '06:00'
          ? '06:00 AM • Apertura de Taller'
          : s.shift === '12:00'
          ? '12:00 M • Cambio de Jornada'
          : '06:00 PM • Cierre Nocturno';

        let status: 'PENDIENTE' | 'COMPLETADA' | 'NO_REALIZADA' = 'PENDIENTE';
        let verifiedCount = 0;
        let missingCount = 0;
        let completedAt: string | undefined = undefined;
        let completedBy: string | undefined = undefined;
        let notes: string | undefined = undefined;
        let alertSent = false;
        let alertSentAt: string | undefined = undefined;

        if (isPast) {
          // In the past days (Mon, Tue, Wed): mostly completed, with a few missed for realism
          const isSampleMissed = (env.id === 'amb3' && dayInfo.dayNumber === 15 && s.shift === '18:00') ||
                                 (env.id === 'amb2' && dayInfo.dayNumber === 16 && s.shift === '12:00');
          if (isSampleMissed) {
            status = 'NO_REALIZADA';
            missingCount = totalItems;
            notes = `Plazo límite venció a las ${s.deadline} sin registro de toma física.`;
            alertSent = true;
            alertSentAt = `${s.deadline.replace(' AM', ':01 AM').replace(' PM', ':01 PM')}`;
          } else {
            status = 'COMPLETADA';
            verifiedCount = totalItems;
            completedAt = s.shift === '06:00' ? '06:14 AM' : s.shift === '12:00' ? '12:10 PM' : '06:15 PM';
            completedBy = instructorName;
            notes = `Toma física reglamentaria completada al 100% (${verifiedCount}/${totalItems} activos verificados).`;
          }
        } else if (isToday) {
          // Today (Thursday Sep 17)
          if (s.shift === '06:00') {
            if (env.id === 'amb3') {
              status = 'NO_REALIZADA';
              missingCount = totalItems;
              notes = 'No se ejecutó la toma física antes de las 06:30 AM.';
              alertSent = true;
              alertSentAt = '06:31 AM';
            } else {
              status = 'COMPLETADA';
              verifiedCount = totalItems;
              completedAt = '06:18 AM';
              completedBy = instructorName;
              notes = `Toma matutina realizada y certificada. ${totalItems}/${totalItems} activos cotejados.`;
            }
          } else if (s.shift === '12:00') {
            if (env.id === 'amb2') {
              status = 'NO_REALIZADA';
              missingCount = totalItems;
              notes = 'Incumplimiento de horario. Venció plazo a las 12:30 PM sin registro.';
              alertSent = true;
              alertSentAt = '12:31 PM';
            } else {
              status = 'COMPLETADA';
              verifiedCount = totalItems;
              completedAt = '12:15 PM';
              completedBy = instructorName;
              notes = `Verificación del mediodía exitosa. ${totalItems} equipos en posición.`;
            }
          } else {
            // 18:00 is Pending for today
            status = 'PENDIENTE';
          }
        } else {
          // Future days (Viernes 18, Sábado 19)
          // All pending, ready for instruction takes!
          status = 'PENDIENTE';
          if (isSaturday) {
            notes = `Toma programada para la jornada sabatina obligatoria (${env.name}).`;
          }
        }

        schedules.push({
          id,
          environmentId: env.id,
          environmentName: env.name,
          instructorId,
          instructorName,
          instructorEmail,
          date: dayInfo.date,
          shift: s.shift,
          shiftLabel,
          deadlineTime: s.deadline,
          status,
          totalItems,
          verifiedCount,
          missingCount,
          completedAt,
          completedBy,
          notes,
          alertSent,
          alertSentAt
        });
      });
    });
  });

  return schedules;
}
