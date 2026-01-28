import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <BookingProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="search" element={<MobileSearchPage />} />
            </Route>
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </BookingProvider>
  );
}

export default App;
