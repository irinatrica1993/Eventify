import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Estrai il token dalla risposta
    const handleCallback = async () => {
      try {
        // Il backend reindirizza qui con i dati dell'utente e il token
        // Salviamo i dati nel localStorage
        const userData = location.state;
        
        if (userData && userData.token) {
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/dashboard');
        } else {
          // Se non ci sono dati, significa che c'è stato un errore
          console.error('Dati utente mancanti nel callback');
          navigate('/login');
        }
      } catch (error) {
        console.error('Errore durante il callback di Google', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <PageContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Autenticazione in corso...
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default GoogleCallbackPage;
