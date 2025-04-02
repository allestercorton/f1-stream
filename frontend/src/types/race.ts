export interface Session {
  name: string;
  startTime: string;
  endTime: string;
}

export interface RaceData {
  grandPrix: string;
  country: string;
  hasSprint: boolean;
  currentSession?: Session;
  nextSession?: Session;
}
