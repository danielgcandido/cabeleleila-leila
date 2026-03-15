import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import { useMyAppointments } from '../../hooks/useAppointments';
import PageContainer from '../../components/layout/PageContainer';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function MyAppointmentsPage() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '' });
  const { data: appointments, isLoading } = useMyAppointments(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  );

  return (
    <PageContainer title="Meus Agendamentos">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <Label className="text-xs">De</Label>
            <Input
              type="date"
              className="w-36 mt-1"
              value={filters.startDate}
              onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
            />
          </div>
          <div>
            <Label className="text-xs">Até</Label>
            <Input
              type="date"
              className="w-36 mt-1"
              value={filters.endDate}
              onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
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
          {(filters.startDate || filters.endDate || filters.status) && (
            <Button variant="ghost" size="sm" onClick={() => setFilters({ startDate: '', endDate: '', status: '' })}>
              Limpar filtros
            </Button>
          )}
        </div>
        <Button asChild>
          <Link to="/agendamentos/novo" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Novo
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Carregando...</div>
      ) : !appointments?.length ? (
        <div className="text-center py-16">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
          <Button asChild className="mt-4">
            <Link to="/agendamentos/novo">Criar primeiro agendamento</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
