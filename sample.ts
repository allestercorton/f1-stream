// backend/data/f1_2025_races.ts
export const f1_2025_races = [
    {
      grandPrix: 'Japanese Grand Prix',
      circuit: 'Suzuka International Racing Course',
      country: 'Japan',
      hasSprint: false,
      sessions: [
        {
          name: 'Practice 1',
          startTime: new Date('2025-04-04T10:30:00Z'),
          endTime: new Date('2025-04-04T11:30:00Z'),
        },
        {
          name: 'Practice 2',
          startTime: new Date('2025-04-04T14:00:00Z'),
          endTime: new Date('2025-04-04T15:00:00Z'),
        },
        {
          name: 'Practice 3',
          startTime: new Date('2025-04-05T10:30:00Z'),
          endTime: new Date('2025-04-05T11:30:00Z'),
        },
        {
          name: 'Qualifying',
          startTime: new Date('2025-04-05T14:00:00Z'),
          endTime: new Date('2025-04-05T15:00:00Z'),
        },
        {
          name: 'Race',
          startTime: new Date('2025-04-06T13:00:00Z'),
          endTime: new Date('2025-04-06T05:00:00Z'),
        },
      ],
    },
  ]
  
  // backend/models/race.model.ts
  class Session {
    @prop({ type: String, required: true })
    public name!: string;
  
    @prop({ type: Date, required: true })
    public startTime!: Date;
  
    @prop({ type: Date, required: true })
    public endTime!: Date;
  }
  
  @modelOptions({ schemaOptions: { collection: 'races', timestamps: true } })
  export class Race {
    @prop({ type: String, required: true })
    public grandPrix!: string;
  
    @prop({ type: String, required: true })
    public circuit!: string;
  
    @prop({ type: String, required: true })
    public country!: string;
  
    @prop({ type: () => [Session], _id: false })
    public sessions!: Session[];
  
    @prop({ type: Boolean, default: false })
    public hasSprint?: boolean;
  }
  
  export const RaceModel = getModelForClass(Race);
  
  // backend/controllers/race.controller.ts
  export const getNextRace = asyncHandler(
    async (_req: Request, res: Response) => {
      const now = new Date();
  
      const race = await RaceModel.findOne({
        $expr: { $gt: [{ $max: '$sessions.endTime' }, now] },
      }).sort({ 'sessions.startTime': 1 });
  
      if (!race) throw createHttpError(404, 'No upcoming races found.');
  
      const currentSession = race.sessions.find(
        (s) => s.startTime <= now && s.endTime >= now
      );
  
      const nextSession = race.sessions.find((s) => s.startTime > now);
  
      res.status(200).json({
        grandPrix: race.grandPrix,
        country: race.country,
        hasSprint: race.hasSprint,
        currentSession: currentSession
          ? {
              name: currentSession.name,
              startTime: currentSession.startTime.toISOString(),
              endTime: currentSession.endTime.toISOString(),
            }
          : null,
        nextSession: nextSession
          ? {
              name: nextSession.name,
              startTime: nextSession.startTime.toISOString(),
              endTime: nextSession.endTime.toISOString(),
            }
          : null,
      });
    }
  );
  
  // frontend/src/utils/raceUtils.ts
  export const formatCountdown = (targetDate: string): string => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
  
    if (diff <= 0) return 'NOW';
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
    return [
      days > 0 ? `${days}d ` : '',
      `${hours}h `,
      `${minutes}m `,
      `${seconds}s `,
    ]
      .join('')
      .trim();
  };
  
  // frontend/src/components/RaceCountdown.tsx
  const RaceCountdown = () => {
    const [countdown, setCountdown] = useState('');
    const { data, isPending, error } = useNextRace();
    const { label, sessionName, isLive } = getSessionStatus(data);
  
    useEffect(() => {
      if (!data) return;
  
      const updateCountdown = () => {
        if (data.currentSession) {
          setCountdown('LIVE');
        } else if (data.nextSession) {
          setCountdown(formatCountdown(data.nextSession.startTime));
        } else {
          setCountdown('COMPLETED');
        }
      };
  
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }, [data]);
  
    if (isPending) return <StatusPill>Loading...</StatusPill>;
    if (error) return <StatusPill isError>{getErrorMessage(error)}</StatusPill>;
    if (!data) return <StatusPill>No upcoming race</StatusPill>;
  
    return (
      <div
        className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm backdrop-blur-md transition-all duration-300 ${
          isLive
            ? 'border border-red-800/50 bg-gradient-to-r from-red-950/80 to-red-900/80 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
            : 'border border-zinc-800/50 bg-gradient-to-r from-zinc-950/80 to-zinc-900/80'
        }`}
      >
        <span className='font-medium tracking-tight'>{data.grandPrix}</span>
        <span className='mx-2 text-zinc-500'>•</span>
        <div className='flex items-center gap-1.5'>
          {isLive && (
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75'></span>
              <span className='relative inline-flex h-2 w-2 rounded-full bg-red-600'></span>
            </span>
          )}
          <span className={`${isLive ? 'text-red-400' : 'text-zinc-400'}`}>
            {sessionName && `${label}: ${sessionName}`}
            {!sessionName && label}
          </span>
        </div>
        <span className='mx-2 text-zinc-500'>•</span>
        <span className='font-mono text-xs tracking-tight text-zinc-300'>
          {countdown}
        </span>
      </div>
    );
  };
  
  const StatusPill = ({
    children,
    isError = false,
  }: {
    children: React.ReactNode;
    isError?: boolean;
  }) => (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs backdrop-blur-md ${
        isError
          ? 'border border-red-800/50 bg-gradient-to-r from-red-950/80 to-red-900/80 text-red-300'
          : 'border border-zinc-800/50 bg-gradient-to-r from-zinc-950/80 to-zinc-900/80 text-zinc-300'
      }`}
    >
      {children}
    </div>
  );
  
  export default RaceCountdown;
  
  // There is something wrong with the countdown. I double check the schedules for the Japanese GP data and it's correct but the countdown in my component displayed is a bit late, currently in the official website for the formula and it says my time is 1d 10h 29m but the countdown in my component is 1d 18h 29m. Please fix this to ensure this working properly since this is crucial that need to be exact.