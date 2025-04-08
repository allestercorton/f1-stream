import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import NotFoundPage from './pages/404';
import Banner from './components/Banner';
import { useAuthStore } from './store/authStore';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function App() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <>
      <Banner />
      <RouterProvider router={router} />
      <Toaster position='top-center' toastOptions={{ duration: 4000 }} />
      <Analytics />
    </>
  );
}
