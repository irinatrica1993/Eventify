import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';
import AuthCard from '../../components/auth/AuthCard';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Se l'utente è già autenticato, reindirizza alla dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageContainer
      maxWidth={false}
      sx={{
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <AuthCard title="Accedi al tuo account">
          <LoginForm />
        </AuthCard>
      </Box>
    </PageContainer>
  );
};

export default LoginPage;
