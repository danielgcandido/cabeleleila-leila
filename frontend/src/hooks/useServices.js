import { useQuery } from '@tanstack/react-query';
import { getServices } from '../api/services';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => getServices().then((r) => r.data.data.services),
    staleTime: 1000 * 60 * 10, // 10 minutos - serviços mudam pouco
  });
}
