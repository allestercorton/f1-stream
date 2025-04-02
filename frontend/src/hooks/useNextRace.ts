import { useQuery } from '@tanstack/react-query';
import { fetchNextRaceAPI } from '@/api/raceApi';

export const useNextRace = () => {
  return useQuery({
    queryKey: ['nextRace'],
    queryFn: fetchNextRaceAPI,
    staleTime: Infinity, // Data is always considered fresh
    refetchInterval: false, // No automatic polling
    refetchOnWindowFocus: false, // No refetching when switching tabs
    refetchOnReconnect: false, // No refetching on network reconnect
  });
};
