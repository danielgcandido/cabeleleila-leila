import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '../api/appointments';

export function useMyAppointments(filters = {}) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => api.getMyAppointments(filters).then((r) => r.data.data.appointments),
  });
}

export function useAppointment(id) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => api.getAppointment(id).then((r) => r.data.data.appointment),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao criar agendamento');
    },
  });
}

export function useUpdateAppointment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      toast.success('Agendamento atualizado!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar agendamento');
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Agendamento cancelado');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao cancelar agendamento');
    },
  });
}
