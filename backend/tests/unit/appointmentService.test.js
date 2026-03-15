const { canModifyOnline } = require('../../src/utils/dateUtils');

// Testes unitários para a lógica de negócio do appointmentService
// (sem banco de dados - testa apenas funções puras)

describe('Regra de 2 dias (canModifyOnline)', () => {
  it('permite modificação quando faltam 2+ dias', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    expect(canModifyOnline(future.toISOString().split('T')[0])).toBe(true);
  });

  it('bloqueia modificação quando falta 1 dia', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(canModifyOnline(tomorrow.toISOString().split('T')[0])).toBe(false);
  });

  it('bloqueia modificação no dia do agendamento', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(canModifyOnline(today)).toBe(false);
  });

  it('bloqueia modificação para data passada', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(canModifyOnline(past.toISOString().split('T')[0])).toBe(false);
  });
});

describe('Detecção de conflito de horário (lógica)', () => {
  function hasConflict(start1, duration1, start2, duration2) {
    const end1 = start1 + duration1;
    const end2 = start2 + duration2;
    return start1 < end2 && end1 > start2;
  }

  it('detecta sobreposição direta', () => {
    // 09:00 (60min) vs 09:30 (30min)
    expect(hasConflict(540, 60, 570, 30)).toBe(true);
  });

  it('não detecta conflito em horários consecutivos', () => {
    // 09:00 (60min) vs 10:00 (30min)
    expect(hasConflict(540, 60, 600, 30)).toBe(false);
  });

  it('detecta sobreposição total', () => {
    // 09:00 (120min) vs 09:30 (30min)
    expect(hasConflict(540, 120, 570, 30)).toBe(true);
  });

  it('não detecta conflito quando o novo começa depois do existente terminar', () => {
    // 08:00 (30min) vs 09:00 (30min)
    expect(hasConflict(480, 30, 540, 30)).toBe(false);
  });
});
