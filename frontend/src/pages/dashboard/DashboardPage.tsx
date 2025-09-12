import React from 'react';
import { Box, Typography, Button, Paper, Container, Grid, Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body1" fontWeight="medium">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} component="div">
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 200,
              borderRadius: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <EventIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              I tuoi eventi
            </Typography>
            <Typography variant="body1">
              Gestisci gli eventi che hai creato
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 200,
              borderRadius: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <CalendarTodayIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Eventi disponibili
            </Typography>
            <Typography variant="body1">
              Scopri nuovi eventi a cui partecipare
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 200,
              borderRadius: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <PeopleIcon sx={{ fontSize: 60, mb: 2, color: '#00BCD4' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Partecipazioni
            </Typography>
            <Typography variant="body1">
              Gestisci le tue partecipazioni agli eventi
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Benvenuto in Eventify!
        </Typography>
        <Typography variant="body1">
          Questa è la tua dashboard personale. Da qui puoi gestire i tuoi eventi, scoprire nuovi eventi a cui partecipare e gestire le tue partecipazioni.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;
