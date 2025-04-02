import api from '@/lib/api';
import { RaceData } from '@/types/race';

export const fetchNextRaceAPI = async (): Promise<RaceData> => {
  const { data } = await api.get('/races/next');
  return data;
};
