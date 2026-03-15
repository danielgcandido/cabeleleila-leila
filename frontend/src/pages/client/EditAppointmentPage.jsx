import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { appointmentSchema } from '../../schemas/appointmentSchema';
import { useServices } from '../../hooks/useServices';
import { useSuggestion } from '../../hooks/useSuggestion';
import { useAppointment, useUpdateAppointment } from '../../hooks/useAppointments';
import PageContainer from '../../components/layout/PageContainer';
import SuggestionBanner from '../../components/appointments/SuggestionBanner';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function EditAppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: appointment, isLoading: loadingAppointment } = useAppointment(id);
  const { data: services, isLoading: loadingServices } = useServices();
  const updateAppointment = useUpdateAppointment(id);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { services: [], notes: '' },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time?.substring(0, 5),
        services: appointment.appointmentServices?.map((as) => as.service_id) || [],
        notes: appointment.notes || '',
      });
    }
  }, [appointment, reset]);

  const watchedDate = watch('appointment_date');
  const watchedServices = watch('services') || [];

  const { data: suggestion } = useSuggestion(watchedDate || null, id);

  const toggleService = (serviceId) => {
    const current = watchedServices;
    const updated = current.includes(serviceId)
      ? current.filter((s) => s !== serviceId)
      : [...current, serviceId];
    setValue('services', updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    await updateAppointment.mutateAsync(data);
    navigate(`/agendamentos/${id}`);
  };

  if (loadingAppointment) {
    return (
      <PageContainer>
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      </PageContainer>
    );
  }

  if (!appointment) {
    return (
      <PageContainer>
        <div className="text-center py-12 text-muted-foreground">Agendamento não encontrado</div>
      </PageContainer>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <PageContainer title="Editar Agendamento">
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SuggestionBanner
              suggestion={suggestion}
              onAccept={(date) => setValue('appointment_date', date, { shouldValidate: true })}
            />

            {/* Data */}
            <div>
              <Label>Data do agendamento *</Label>
              <Input type="date" min={today} {...register('appointment_date')} className="mt-1" />
              {errors.appointment_date && (
                <p className="text-xs text-destructive mt-1">{errors.appointment_date.message}</p>
              )}
            </div>

            {/* Horário */}
            <div>
              <Label>Horário *</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                {TIME_SLOTS.map((slot) => {
                  const occupied = suggestion?.occupiedSlots?.some(
                    (s) => slot >= s.start && slot < s.end
                  );
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={occupied}
                      onClick={() => setValue('appointment_time', slot, { shouldValidate: true })}
                      className={`px-2 py-1.5 text-xs rounded-md border transition-colors ${
                        watch('appointment_time') === slot
                          ? 'bg-primary text-white border-primary'
                          : occupied
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          : 'hover:border-primary hover:text-primary'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.appointment_time && (
                <p className="text-xs text-destructive mt-1">{errors.appointment_time.message}</p>
              )}
            </div>

            {/* Serviços */}
            <div>
              <Label>Serviços * <span className="text-muted-foreground font-normal">(selecione um ou mais)</span></Label>
              {loadingServices ? (
                <p className="text-sm text-muted-foreground mt-2">Carregando serviços...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {services?.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        watchedServices.includes(service.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={watchedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {service.duration_minutes}min — R$ {parseFloat(service.price).toFixed(2)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {errors.services && (
                <p className="text-xs text-destructive mt-1">{errors.services.message}</p>
              )}
            </div>

            {/* Duração e valor estimado */}
            {watchedServices.length > 0 && services && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                {(() => {
                  const selected = services.filter((s) => watchedServices.includes(s.id));
                  const totalMin = selected.reduce((a, s) => a + s.duration_minutes, 0);
                  const totalPrice = selected.reduce((a, s) => a + parseFloat(s.price), 0);
                  return (
                    <p className="text-muted-foreground">
                      Duração estimada: <strong>{totalMin} min</strong> — Total: <strong>R$ {totalPrice.toFixed(2)}</strong>
                    </p>
                  );
                })()}
              </div>
            )}

            {/* Observações */}
            <div>
              <Label>Observações (opcional)</Label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Alguma preferência ou informação especial..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.notes && <p className="text-xs text-destructive mt-1">{errors.notes.message}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(`/agendamentos/${id}`)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateAppointment.isPending}>
                {updateAppointment.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
