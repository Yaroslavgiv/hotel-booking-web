import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import './App.css';

// Lazy loading страниц
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const HotelPage = lazy(() => import('./pages/HotelPage').then(module => ({ default: module.HotelPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(module => ({ default: module.BookingPage })));
const BookingsViewPage = lazy(() => import('./pages/BookingsViewPage').then(module => ({ default: module.BookingsViewPage })));

const LoadingFallback = () => (
  <div className="loading" style={{ padding: '40px', textAlign: 'center' }}>
    Загрузка...
  </div>
);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ToastProvider>
        <UserProvider>
          <ErrorBoundary>
            <Router>
              <div className="app">
                <main className="app-main">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/hotel/:id" element={<HotelPage />} />
                      <Route path="/room/:roomId/book" element={<BookingPage />} />
                      <Route path="/room/:roomId/bookings" element={<BookingsViewPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <ToastContainer />
              </div>
            </Router>
          </ErrorBoundary>
        </UserProvider>
      </ToastProvider>
    </ApolloProvider>
  );
}

export default App;
