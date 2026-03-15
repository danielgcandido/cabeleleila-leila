import { Badge } from '../ui/badge';

const STATUS_MAP = {
  pending: { label: 'Pendente', variant: 'warning' },
  confirmed: { label: 'Confirmado', variant: 'info' },
  completed: { label: 'Concluído', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const SERVICE_STATUS_MAP = {
  pending: { label: 'Pendente', variant: 'warning' },
  in_progress: { label: 'Em Andamento', variant: 'info' },
  completed: { label: 'Concluído', variant: 'success' },
};

export function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { label: status, variant: 'secondary' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function ServiceStatusBadge({ status }) {
  const config = SERVICE_STATUS_MAP[status] || { label: status, variant: 'secondary' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
