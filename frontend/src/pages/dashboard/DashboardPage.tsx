import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Avatar, Badge, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import participationService from '../../services/participationService';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventifyLogo from '../../components/common/EventifyLogo';
import DashboardCard from '../../components/dashboard/DashboardCard';
import OrganizerStats from '../../components/dashboard/OrganizerStats';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [participationsCount, setParticipationsCount] = useState<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica gli eventi organizzati dall'utente
        if (user?.id) {
          // Se l'utente è un organizzatore o admin, carica gli eventi organizzati
          if (user.role === 'organizer' || user.role === 'admin') {
            const organizedEvents = await eventService.getEventsByOrganizer(user.id);
            setEventsCount(organizedEvents.length);
          }
          
          // Carica le partecipazioni dell'utente (per tutti i tipi di utente)
          const participations = await participationService.getMyParticipations();
          setParticipationsCount(participations.length);
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
      }
    };
    
    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ 
      bgcolor: '#FFFFFF', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Header principale con logo e logout */}
      <Box sx={{ 
        width: '100%', 
        borderBottom: '1px solid #f0f0f0',
        py: 3,
      }}>
        <Box sx={{ px: { xs: 2, sm: 2 }, width: '100%', maxWidth: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            {/* Logo a sinistra */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <EventifyLogo size="medium" />
            </Box>
            
            {/* Logout e profilo a destra */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'text.secondary',
              }}>
                <Box sx={{ flexDirection: 'column', alignItems: 'flex-end', mr: 1, display: { xs: 'none', sm: 'flex' } }}>
                  <Typography variant="body2">
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'text.secondary',
                    bgcolor: user?.role === 'organizer' ? 'rgba(25, 118, 210, 0.1)' : user?.role === 'admin' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(76, 175, 80, 0.1)', 
                    px: 1, 
                    borderRadius: 1,
                    textTransform: 'capitalize'
                  }}>
                    {user?.role === 'organizer' ? 'Organizzatore' : user?.role === 'admin' ? 'Amministratore' : 'Utente'}
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}>
                  {user?.name.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleLogout}
                size="small"
                sx={{ 
                  borderRadius: 28,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Contenuto principale */}
      <Box 
        sx={{ 
          py: 8, 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          px: 0,
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          mt: 0,
        }}
      >
      
      {/* Messaggio di benvenuto */}
      <Box sx={{ width: '100%', mb: 6, px: 0 }}>
        <Box 
          sx={{ 
            p: { xs: 4, sm: 5 }, 
            bgcolor: 'background.paper', 
            borderRadius: 0, 
            border: '1px solid #f0f0f0', 
            boxShadow: 'none',
            width: '100%',
            maxWidth: '100%',
            textAlign: 'center',
            mx: 0
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
            Benvenuto in Eventify!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 1200, mx: 'auto' }}>
            Questa è la tua dashboard personale. Da qui puoi gestire i tuoi eventi, scoprire nuovi eventi a cui partecipare e gestire le tue partecipazioni.
          </Typography>
        </Box>
      </Box>

      {/* Statistiche per organizzatori */}
      {(user?.role === 'organizer' || user?.role === 'admin') && user?.id && (
        <Box sx={{ width: '100%', px: { xs: 2, sm: 4 }, mb: 4 }}>
          <OrganizerStats userId={user.id} />
        </Box>
      )}
      
      {/* Card degli eventi */}
      <Grid
        container
        spacing={4}
        justifyContent="space-between"
        sx={{ 
          width: '100%', 
          px: { xs: 2, sm: 4 }, 
          maxWidth: '100vw',
          mx: 0,
          my: 0
        }}
      >
        {/* Card "I tuoi eventi" - ora visibile per tutti gli utenti */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Badge badgeContent={eventsCount} color="primary" max={99} sx={{ width: '100%', height: '100%' }}>
            <DashboardCard
              title="I tuoi eventi"
              description="Gestisci gli eventi che hai creato"
              icon={<EventIcon />}
              iconColor="primary.main"
              sx={{ height: '100%', width: '100%' }}
              onClick={() => navigate('/my-events?tab=1')}
            />
          </Badge>
        </Grid>
        
        {/* Card "Eventi disponibili" - visibile per tutti */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <DashboardCard
            title="Eventi disponibili"
            description="Scopri nuovi eventi a cui partecipare"
            icon={<CalendarTodayIcon />}
            iconColor="secondary.main"
            sx={{ height: '100%' }}
            onClick={() => navigate('/events')}
          />
        </Grid>
        
        {/* Card "Partecipazioni" - visibile per tutti */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Badge badgeContent={participationsCount} color="primary" max={99} sx={{ width: '100%', height: '100%' }}>
            <DashboardCard
              title="Partecipazioni"
              description="Gestisci le tue partecipazioni agli eventi"
              icon={<PeopleIcon />}
              iconColor="#2196f3"
              sx={{ height: '100%', width: '100%' }}
              onClick={() => navigate('/my-events?tab=0')}
            />
          </Badge>
        </Grid>
      </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
