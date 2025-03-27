import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';
import NotFoundPage from './pages/404';
import PublicRoute from './components/PublicRoute';

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
        path: '/new-password',
        element: <NewPassword />,
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
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position='top-center' toastOptions={{ duration: 3000 }} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
