import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

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
        {/* Altre rotte protette qui */}
      </Route>
      
      {/* Reindirizzamento predefinito */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
