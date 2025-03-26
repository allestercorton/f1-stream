const LiveStream = () => {
  const streamSource = import.meta.env.VITE_STREAM_SOURCE;

  return (
    <div className='relative h-full w-full'>
      {/* Stream iframe */}
      <div className='h-full w-full bg-black'>
        <iframe
          src={streamSource}
          className='h-full w-full border-0'
          allowFullScreen
          allow='autoplay; encrypted-media; picture-in-picture'
        ></iframe>
      </div>

      {/* Top overlay with race info */}
      <div className='pointer-events-none absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4'>
        <div className='flex items-center justify-between'>
          <div className='pointer-events-auto flex items-center'>
            <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500'></div>
            <span className='text-xs text-white/80'>LIVE</span>
          </div>
          <div className='text-xs font-medium text-white/80'>SKY F1</div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
