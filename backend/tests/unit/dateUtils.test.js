const { canModifyOnline, getWeekBounds, timeToMinutes } = require('../../src/utils/dateUtils');

// Helper: formata date como string local YYYY-MM-DD (sem converter para UTC)
function toLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('dateUtils', () => {
  describe('canModifyOnline', () => {
    it('retorna true quando a data é 3 dias no futuro', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      expect(canModifyOnline(toLocalDate(futureDate))).toBe(true);
    });

    it('retorna false quando a data é amanhã (1 dia)', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(canModifyOnline(toLocalDate(tomorrow))).toBe(false);
    });

    it('retorna false quando a data é hoje', () => {
      expect(canModifyOnline(toLocalDate(new Date()))).toBe(false);
    });

    it('retorna true quando a data é exatamente 2 dias no futuro', () => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      expect(canModifyOnline(toLocalDate(date))).toBe(true);
    });
  });

  describe('getWeekBounds', () => {
    it('retorna início e fim da semana corretamente', () => {
      const { startOfWeek, endOfWeek } = getWeekBounds('2025-06-11'); // Quarta-feira
      expect(startOfWeek).toBe('2025-06-08'); // Domingo
      expect(endOfWeek).toBe('2025-06-14');   // Sábado
    });
  });

  describe('timeToMinutes', () => {
    it('converte 09:00 para 540', () => {
      expect(timeToMinutes('09:00')).toBe(540);
    });

    it('converte 14:30 para 870', () => {
      expect(timeToMinutes('14:30')).toBe(870);
    });

    it('lida com formato HH:mm:ss', () => {
      expect(timeToMinutes('09:00:00')).toBe(540);
    });
  });
});
