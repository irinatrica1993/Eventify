import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/common/PageContainer';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Estrai i dati dalla query string
    const handleCallback = async () => {
      try {
        const dataParam = searchParams.get('data');
        
        if (dataParam) {
          // Decodifica i dati dell'utente
          const userData = JSON.parse(decodeURIComponent(dataParam));
          
          if (userData && userData.token) {
            // Salva i dati nel localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Reindirizza alla dashboard
            navigate('/dashboard');
          } else {
            setError('Token mancante nella risposta');
            setTimeout(() => navigate('/login'), 3000);
          }
        } else {
          setError('Dati utente mancanti nella risposta');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('Errore durante il callback di Google', error);
        setError('Errore durante l\'autenticazione con Google');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

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
        {error ? (
          <>
            <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 400 }}>
              {error}
            </Alert>
            <Typography variant="body1">
              Verrai reindirizzato alla pagina di login tra pochi secondi...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 3 }}>
              Autenticazione in corso...
            </Typography>
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export default GoogleCallbackPage;
