export default function HomePage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-3xl text-center'>
        <h1 className='mb-6 text-4xl font-bold'>Welcome to MERN Auth App</h1>
        <p className='mb-8 text-xl'>
          A secure authentication system built with the MERN stack and
          TypeScript
        </p>
        <div className='rounded-lg bg-white p-8 shadow-md'>
          <h2 className='mb-4 text-2xl font-semibold'>Features</h2>
          <ul className='space-y-2 text-left'>
            <li>✅ Secure user authentication with JWT</li>
            <li>✅ Form validation with Zod and React Hook Form</li>
            <li>✅ State management with Zustand</li>
            <li>✅ API integration with Axios and TanStack Query</li>
            <li>✅ TypeScript for type safety</li>
            <li>✅ MongoDB with Typegoose for type-safe models</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
