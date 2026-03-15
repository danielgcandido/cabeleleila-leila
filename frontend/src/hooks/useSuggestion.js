import { useQuery } from '@tanstack/react-query';
import { getSuggestion } from '../api/appointments';

export function useSuggestion(date, excludeId = null) {
  return useQuery({
    queryKey: ['suggestion', date, excludeId],
    queryFn: () => getSuggestion(date, excludeId).then((r) => r.data.data),
    enabled: !!date,
  });
}
