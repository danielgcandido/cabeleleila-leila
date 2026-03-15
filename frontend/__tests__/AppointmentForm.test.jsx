import { describe, it, expect } from 'vitest';
import { appointmentSchema } from '../src/schemas/appointmentSchema';

describe('appointmentSchema (Zod)', () => {
  const validData = {
    appointment_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d.toISOString().split('T')[0];
    })(),
    appointment_time: '09:00',
    services: [1, 3],
    notes: '',
  };

  it('valida dados corretos sem erros', () => {
    const result = appointmentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejeita quando nenhum serviço é selecionado', () => {
    const result = appointmentSchema.safeParse({ ...validData, services: [] });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe('Selecione pelo menos um serviço');
  });

  it('rejeita data no passado', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const result = appointmentSchema.safeParse({
      ...validData,
      appointment_date: past.toISOString().split('T')[0],
    });
    expect(result.success).toBe(false);
  });

  it('rejeita horário inválido', () => {
    const result = appointmentSchema.safeParse({ ...validData, appointment_time: '25:00' });
    expect(result.success).toBe(false);
  });

  it('rejeita observações muito longas', () => {
    const result = appointmentSchema.safeParse({ ...validData, notes: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('aceita notas opcionais vazias', () => {
    const result = appointmentSchema.safeParse({ ...validData, notes: undefined });
    expect(result.success).toBe(true);
  });
});
