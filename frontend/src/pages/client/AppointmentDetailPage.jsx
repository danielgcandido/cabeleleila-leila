import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import { useAppointment, useCancelAppointment } from '../../hooks/useAppointments';
import PageContainer from '../../components/layout/PageContainer';
import { StatusBadge, ServiceStatusBadge } from '../../components/admin/StatusBadge';
import ModifyBlockedAlert from '../../components/appointments/ModifyBlockedAlert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import toast from 'react-hot-toast';
import { useState } from 'react';

function canModify(appointmentDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((new Date(appointmentDate) - today) / (1000 * 60 * 60 * 24));
  return diff >= 2;
}

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: appointment, isLoading } = useAppointment(id);
  const cancelMutation = useCancelAppointment();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (isLoading) return <PageContainer><div className="text-center py-12 text-muted-foreground">Carregando...</div></PageContainer>;
  if (!appointment) return <PageContainer><div className="text-center py-12 text-muted-foreground">Agendamento não encontrado</div></PageContainer>;

  const canModifyOnline = canModify(appointment.appointment_date);
  const isActive = !['cancelled', 'completed'].includes(appointment.status);

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(appointment.id);
      navigate('/agendamentos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao cancelar');
    }
    setShowCancelConfirm(false);
  };

  const date = format(new Date(appointment.appointment_date + 'T00:00:00'), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const time = appointment.appointment_time?.substring(0, 5);
  const totalPrice = appointment.appointmentServices?.reduce(
    (sum, as) => sum + parseFloat(as.service?.price || 0), 0
  );

  return (
    <PageContainer>
      <div className="max-w-2xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/agendamentos')} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg capitalize">{date}</CardTitle>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date.split(',')[0]}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{time}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Serviços */}
            <div>
              <p className="text-sm font-medium mb-2">Serviços</p>
              <div className="space-y-2">
                {appointment.appointmentServices?.map((as) => (
                  <div key={as.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{as.service?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {as.service?.duration_minutes}min — R$ {parseFloat(as.service?.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <ServiceStatusBadge status={as.service_status} />
                  </div>
                ))}
              </div>
              {totalPrice > 0 && (
                <p className="text-sm font-medium mt-2 text-right">
                  Total: R$ {totalPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Observações */}
            {appointment.notes && (
              <div>
                <p className="text-sm font-medium flex items-center gap-1 mb-1">
                  <FileText className="h-3 w-3" /> Observações
                </p>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2">{appointment.notes}</p>
              </div>
            )}

            {/* Ações */}
            {isActive && (
              <div className="pt-2 border-t">
                {!canModifyOnline ? (
                  <ModifyBlockedAlert />
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/agendamentos/${id}/editar`)}
                    >
                      Editar
                    </Button>
                    {!showCancelConfirm ? (
                      <Button variant="destructive" onClick={() => setShowCancelConfirm(true)}>
                        Cancelar Agendamento
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Confirmar cancelamento?</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleCancel}
                          disabled={cancelMutation.isPending}
                        >
                          Sim
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowCancelConfirm(false)}>
                          Não
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
