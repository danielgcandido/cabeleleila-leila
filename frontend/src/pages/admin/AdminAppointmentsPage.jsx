import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Pencil, Search } from 'lucide-react';
import { useAdminAppointments, useConfirmAppointment, useUpdateServiceStatus } from '../../hooks/useDashboard';
import PageContainer from '../../components/layout/PageContainer';
import { StatusBadge, ServiceStatusBadge } from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';

export default function AdminAppointmentsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ status: '', date: '', clientName: '' });
  const [confirmId, setConfirmId] = useState(null);

  const { data: appointments, isLoading } = useAdminAppointments(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  );
  const confirmMutation = useConfirmAppointment();
  const updateServiceMutation = useUpdateServiceStatus();

  const handleConfirm = async () => {
    await confirmMutation.mutateAsync(confirmId);
    setConfirmId(null);
  };

  return (
    <PageContainer title="Gerenciar Agendamentos">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div>
          <Label className="text-xs">Data</Label>
          <Input
            type="date"
            className="w-36 mt-1"
            value={filters.date}
            onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
          />
        </div>
        <div>
          <Label className="text-xs">Status</Label>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">Todos</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div>
          <Label className="text-xs">Cliente</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 w-48"
              placeholder="Buscar cliente..."
              value={filters.clientName}
              onChange={(e) => setFilters((f) => ({ ...f, clientName: e.target.value }))}
            />
          </div>
        </div>
        {Object.values(filters).some(Boolean) && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({ status: '', date: '', clientName: '' })}>
            Limpar filtros
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Carregando...</div>
      ) : !appointments?.length ? (
        <div className="text-center py-12 text-muted-foreground">Nenhum agendamento encontrado</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const date = format(new Date(appt.appointment_date + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR });
            const time = appt.appointment_time?.substring(0, 5);

            return (
              <Card key={appt.id}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{appt.client?.name}</p>
                        <StatusBadge status={appt.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{date} às {time} — {appt.client?.phone}</p>

                      {/* Serviços com status individual */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {appt.appointmentServices?.map((as) => (
                          <div key={as.id} className="flex items-center gap-1.5 text-xs bg-muted/50 rounded-md px-2 py-1">
                            <span>{as.service?.name}</span>
                            <ServiceStatusBadge status={as.service_status} />
                            {appt.status === 'confirmed' && (
                              <select
                                className="text-xs border rounded px-1 py-0.5 bg-background ml-1"
                                value={as.service_status}
                                onChange={(e) =>
                                  updateServiceMutation.mutate({
                                    appointmentId: appt.id,
                                    serviceId: as.service_id,
                                    service_status: e.target.value,
                                  })
                                }
                              >
                                <option value="pending">Pendente</option>
                                <option value="in_progress">Em andamento</option>
                                <option value="completed">Concluído</option>
                              </select>
                            )}
                          </div>
                        ))}
                      </div>

                      {appt.notes && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{appt.notes}"</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {!['completed', 'cancelled'].includes(appt.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/agendamentos/${appt.id}/editar`)}
                          className="flex items-center gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                      )}
                      {appt.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => setConfirmId(appt.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirm}
        title="Confirmar agendamento"
        description="Deseja confirmar este agendamento? O cliente será atendido no horário marcado."
        loading={confirmMutation.isPending}
      />
    </PageContainer>
  );
}
