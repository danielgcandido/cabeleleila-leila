import { useState } from 'react';
import { useWeeklyDashboard } from '../../hooks/useDashboard';
import PageContainer from '../../components/layout/PageContainer';
import WeeklyChart from '../../components/admin/WeeklyChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { CalendarDays, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function MetricCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${color || ''}`}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {Icon && <Icon className={`h-5 w-5 ${color || 'text-muted-foreground'}`} />}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const { data, isLoading, isError } = useWeeklyDashboard(selectedDate || undefined);

  return (
    <PageContainer title="Dashboard Semanal">
      <div className="mb-6 flex items-end gap-3">
        <div>
          <Label className="text-xs">Semana de referência</Label>
          <Input
            type="date"
            className="w-40 mt-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        {data?.period && (
          <p className="text-sm text-muted-foreground pb-2">
            {format(new Date(data.period.start + 'T00:00:00'), "dd 'de' MMM", { locale: ptBR })} —{' '}
            {format(new Date(data.period.end + 'T00:00:00'), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Carregando dashboard...</div>
      ) : isError ? (
        <div className="text-center text-destructive py-12">Erro ao carregar o dashboard. Verifique se o servidor está rodando.</div>
      ) : data ? (
        <div className="space-y-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Agendamentos"
              value={data.totalAppointments}
              icon={CalendarDays}
              color="text-primary"
            />
            <MetricCard
              title="Pendentes"
              value={data.pendingAppointments}
              subtitle={`${data.totalAppointments ? Math.round((data.pendingAppointments / data.totalAppointments) * 100) : 0}% do total`}
              icon={Clock}
              color="text-amber-500"
            />
            <MetricCard
              title="Confirmados"
              value={data.confirmedAppointments}
              subtitle={`${data.totalAppointments ? Math.round((data.confirmedAppointments / data.totalAppointments) * 100) : 0}% do total`}
              icon={CheckCircle}
              color="text-blue-600"
            />
            <MetricCard
              title="Concluídos"
              value={data.completedAppointments}
              subtitle={`${data.totalAppointments ? Math.round((data.completedAppointments / data.totalAppointments) * 100) : 0}% do total`}
              icon={CheckCircle}
              color="text-green-600"
            />
            <MetricCard
              title="Cancelados"
              value={data.cancelledAppointments}
              subtitle={`${data.totalAppointments ? Math.round((data.cancelledAppointments / data.totalAppointments) * 100) : 0}% do total`}
              icon={XCircle}
              color="text-destructive"
            />
            <MetricCard
              title="Receita da Semana"
              value={`R$ ${data.revenue?.toFixed(2) || '0.00'}`}
              icon={TrendingUp}
              color="text-green-600"
            />
          </div>

          {/* Gráfico */}
          {data.dailyBreakdown && <WeeklyChart data={data.dailyBreakdown} />}

          {/* Top serviços */}
          {data.topServices?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Serviços Mais Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topServices.map((service, i) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                        <span className="text-sm font-medium">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{service.count}x</span>
                        <span className="font-medium text-foreground">R$ {service.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </PageContainer>
  );
}
