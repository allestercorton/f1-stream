import api from '@/utils/api';
import { RaceData } from '@/types/race';

export const fetchNextRaceAPI = async (): Promise<RaceData> => {
  const { data } = await api.get('/api/races/next');
  return data;
};
