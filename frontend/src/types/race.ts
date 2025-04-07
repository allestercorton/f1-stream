export type RaceSession = {
  name: string;
  startTime: Date;
  endTime: Date;
};

export type Race = {
  grandPrix: string;
  circuit: string;
  country: string;
  hasSprint: boolean;
  sessions: RaceSession[];
};

export type NextSession = {
  grandPrix: string;
  circuit: string;
  country: string;
  sessionName: string;
  sessionStart: Date;
  sessionEnd: Date;
} | null;
