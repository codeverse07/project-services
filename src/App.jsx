import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ServicesPage from './pages/Services/ServicesPage';
import BookingsPage from './pages/Bookings/BookingsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import MobileSearchPage from './pages/Search/MobileSearchPage';
import TransportPage from './pages/Services/TransportPage';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleResize);
    // Initial check
    setIsMobile(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <div style={isMobile ? { position: 'relative', minHeight: '100vh', overflowX: 'hidden' } : {}}>
      <AnimatePresence>
        <motion.div
          key={isMobile ? location.pathname : 'desktop-view'}
          initial={isMobile ? { opacity: 0 } : false}
          animate={isMobile ? { opacity: 1 } : false}
          exit={isMobile ? { opacity: 0 } : false}
          transition={{ duration: 0.2 }}
          className={isMobile ? "mobile-page-transition" : ""}
          style={isMobile ? {
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 0 // Base z-index
          } : {}}
        >
          <Routes location={location}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="search" element={<MobileSearchPage />} />
            </Route>
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <BookingProvider>
      <ThemeProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ThemeProvider>
    </BookingProvider>
  );
}

export default App;
