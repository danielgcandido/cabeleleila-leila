import { z } from 'zod';

export const appointmentSchema = z.object({
  appointment_date: z.string()
    .min(1, 'Data é obrigatória')
    .refine((val) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(val) >= today;
    }, { message: 'Data não pode ser no passado' }),
  appointment_time: z.string()
    .min(1, 'Horário é obrigatório')
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido (HH:mm)'),
  services: z.array(z.number()).min(1, 'Selecione pelo menos um serviço'),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
});
