import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import NotFoundPage from './pages/404';
import Banner from './components/Banner';
import PublicRoute from './components/PublicRoute';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/sign-in',
        element: <Signin />,
      },
      {
        path: '/sign-up',
        element: <Signup />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Banner />
      <RouterProvider router={router} />
      <Toaster position='top-center' toastOptions={{ duration: 4000 }} />
      <Analytics />
    </QueryClientProvider>
  );
}
