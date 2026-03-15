import { useQuery } from '@tanstack/react-query';
import { getWeeklyDashboard } from '../api/appointments';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '../api/appointments';

export function useWeeklyDashboard(date) {
  return useQuery({
    queryKey: ['dashboard', 'weekly', date],
    queryFn: () => getWeeklyDashboard(date).then((r) => r.data.data),
  });
}

export function useAdminAppointment(id) {
  return useQuery({
    queryKey: ['admin-appointment', id],
    queryFn: () => api.getAdminAppointment(id).then((r) => r.data.data.appointment),
    enabled: !!id,
  });
}

export function useAdminUpdateAppointment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.adminUpdateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-appointment', id] });
      toast.success('Agendamento atualizado!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar agendamento');
    },
  });
}

export function useAdminAppointments(filters = {}) {
  return useQuery({
    queryKey: ['admin-appointments', filters],
    queryFn: () => api.getAdminAppointments(filters).then((r) => r.data.data.appointments),
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.confirmAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Agendamento confirmado!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao confirmar');
    },
  });
}

export function useUpdateServiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, serviceId, service_status }) =>
      api.updateServiceStatus(appointmentId, serviceId, service_status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Status atualizado!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar status');
    },
  });
}
