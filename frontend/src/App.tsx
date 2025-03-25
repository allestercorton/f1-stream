import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/404';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='min-h-screen bg-gray-100'>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
            </Route>

            {/* Private route */}
            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<ProfilePage />} />
            </Route>

            {/* Catch-All  */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
