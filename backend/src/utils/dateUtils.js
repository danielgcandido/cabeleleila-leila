const {
  differenceInCalendarDays,
  startOfWeek,
  endOfWeek,
  parse,
  addMinutes,
  format,
} = require('date-fns');
const { ptBR } = require('date-fns/locale');

/**
 * Verifica se o agendamento pode ser modificado online (regra 2 dias)
 */
function canModifyOnline(appointmentDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Parse date string as local date to avoid UTC offset issues
  const [year, month, day] = String(appointmentDate).split('-').map(Number);
  const apptDate = new Date(year, month - 1, day);
  const diff = differenceInCalendarDays(apptDate, today);
  return diff >= 2;
}

/**
 * Retorna o início e fim da semana de uma data
 */
function getWeekBounds(date) {
  let target;
  if (date instanceof Date) {
    target = date;
  } else {
    const [year, month, day] = String(date).split('T')[0].split('-').map(Number);
    target = new Date(year, month - 1, day);
  }
  return {
    startOfWeek: format(startOfWeek(target, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
    endOfWeek: format(endOfWeek(target, { weekStartsOn: 0 }), 'yyyy-MM-dd'),
  };
}

/**
 * Verifica se dois intervalos de tempo se sobrepõem
 */
function hasOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2;
}

/**
 * Converte string HH:mm ou HH:mm:ss para minutos desde meia-noite
 */
function timeToMinutes(timeStr) {
  const parts = timeStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/**
 * Formata data para exibição em português
 */
function formatDatePtBR(date) {
  const [year, month, day] = String(date).split('-').map(Number);
  return format(new Date(year, month - 1, day), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

module.exports = {
  canModifyOnline,
  getWeekBounds,
  hasOverlap,
  timeToMinutes,
  formatDatePtBR,
};
