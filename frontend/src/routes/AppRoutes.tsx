import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Importa le pagine degli eventi
import EventsListPage from '../pages/events/EventsListPage';
import EventDetailPage from '../pages/events/EventDetailPage';
import EventFormPage from '../pages/events/EventFormPage';
import MyEventsPage from '../pages/events/MyEventsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotte pubbliche */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      
      {/* Rotte protette */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Rotte per gli eventi */}
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/create" element={<EventFormPage />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
      </Route>
      
      {/* Reindirizzamento predefinito */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
