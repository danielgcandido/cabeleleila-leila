import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { StatusBadge } from '../admin/StatusBadge';

export default function AppointmentCard({ appointment }) {
  const { id, appointment_date, appointment_time, status, appointmentServices } = appointment;

  const date = format(new Date(appointment_date + 'T00:00:00'), "dd 'de' MMM", { locale: ptBR });
  const time = appointment_time?.substring(0, 5);
  const services = appointmentServices?.map((as) => as.service?.name).join(', ') || '';

  return (
    <Link to={`/agendamentos/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-primary/10 rounded-lg p-2 min-w-12">
                <Calendar className="h-4 w-4 text-primary mb-0.5" />
                <span className="text-xs font-medium text-primary">{date}</span>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {time}
                </div>
                <p className="text-sm font-medium mt-0.5 line-clamp-1">{services}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
