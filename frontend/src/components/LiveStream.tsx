const LiveStream = () => {
  const streamSource = import.meta.env.VITE_STREAM_SOURCE;

  return (
    <div className='relative flex aspect-video h-full w-full items-center justify-center overflow-hidden'>
      {/* Stream iframe with responsive container */}
      <div className='absolute inset-0 bg-black'>
        <iframe
          src={streamSource}
          className='h-full w-full border-0 object-cover'
          allowFullScreen
          allow='autoplay; encrypted-media; picture-in-picture'
          title='Live Stream'
        ></iframe>
      </div>

      {/* Top overlay with race info */}
      <div className='pointer-events-none absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/80 to-transparent px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='pointer-events-auto flex items-center'>
            <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500'></div>
            <span className='text-xs text-white/80 sm:text-sm'>LIVE</span>
          </div>
          <div className='text-xs font-medium text-white/80 sm:text-sm'>
            SKY F1
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
