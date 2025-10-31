import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { format } from 'date-fns';
import { isUpcomingEvent, isPastEvent, updateEventsStatus } from '../../utils/eventUtils';
import { it } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import participationService from '../../services/participationService';
import { eventService } from '../../services/eventService';
import { Event } from '../../types/event.types';
import { Participation } from '../../types/participation.types';
import AuthService from '../../services/auth.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Imposta il tab corretto in base ai parametri URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setTabValue(parseInt(tab, 10));
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verifica se l'utente è autenticato
        if (!AuthService.isAuthenticated()) {
          navigate('/login', { state: { from: '/my-events' } });
          return;
        }

        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          throw new Error('Utente non trovato');
        }

        // Carica le partecipazioni dell'utente (per tutti i tipi di utente)
        const participationsData = await participationService.getMyParticipations();
        setParticipations(participationsData);

        // Carica gli eventi organizzati dall'utente (per tutti gli utenti)
        const organizedEventsData = await eventService.getEventsByOrganizer(currentUser.user.id);
        
        // Aggiorna lo stato degli eventi in base alla data
        const updatedEvents = updateEventsStatus(organizedEventsData);
        
        // Aggiorna gli eventi sul server se necessario
        updatedEvents.forEach(async (event, index) => {
          if (event.status !== organizedEventsData[index].status) {
            try {
              await eventService.updateEvent(event._id, { status: event.status });
            } catch (error) {
              console.error(`Errore nell'aggiornamento dello stato dell'evento ${event._id}:`, error);
            }
          }
        });
        
        setOrganizedEvents(updatedEvents);
      } catch (err: any) {
        console.error('Errore nel caricamento degli eventi:', err);
        setError(err.response?.data?.message || 'Si è verificato un errore nel caricamento degli eventi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await participationService.leaveEvent(eventId);
      // Aggiorna la lista delle partecipazioni
      const updatedParticipations = participations.filter(p => {
        const id = typeof p.event === 'string' ? p.event : p.event._id;
        return id !== eventId;
      });
      setParticipations(updatedParticipations);
    } catch (err: any) {
      console.error('Errore nell\'abbandono dell\'evento:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nell\'abbandono dell\'evento.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', { locale: it });
  };
  
  // Le funzioni isUpcomingEvent e isPastEvent sono ora importate da eventUtils.ts
  
  // Filtra le partecipazioni in base al filtro temporale
  const filteredParticipations = useMemo(() => {
    if (timeFilter === 'all') return participations;
    
    return participations.filter(participation => {
      const eventObj = typeof participation.event === 'object' ? participation.event : null;
      if (!eventObj) return false;
      
      return timeFilter === 'upcoming' ? isUpcomingEvent(eventObj) : isPastEvent(eventObj);
    });
  }, [participations, timeFilter]);
  
  // Filtra gli eventi organizzati in base al filtro temporale
  const filteredOrganizedEvents = useMemo(() => {
    if (timeFilter === 'all') return organizedEvents;
    
    return organizedEvents.filter(event => {
      return timeFilter === 'upcoming' ? isUpcomingEvent(event) : isPastEvent(event);
    });
  }, [organizedEvents, timeFilter]);
  
  // Gestisce il cambio del filtro temporale
  const handleTimeFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: 'all' | 'upcoming' | 'past' | null) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter);
    }
  };

  const renderEventCard = (event: Event, isParticipation: boolean = false) => {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={event.imageUrl || 'https://source.unsplash.com/random?event'}
          alt={event.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {event.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.startDate)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {event.location}
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={event.status === 'active' ? 'Attivo' : event.status === 'cancelled' ? 'Cancellato' : 'Completato'} 
              color={event.status === 'active' ? 'success' : event.status === 'cancelled' ? 'error' : 'default'} 
              size="small" 
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleViewEvent(event._id)}>
            Dettagli
          </Button>
          {isParticipation && (
            <Button size="small" color="error" onClick={() => handleLeaveEvent(event._id)}>
              Abbandona
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        I miei eventi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="event tabs">
          <Tab label={`Partecipazioni (${participations.length})`} />
          <Tab label={`Eventi organizzati (${organizedEvents.length})`} />
        </Tabs>
      </Box>
      
      {/* Filtro temporale */}
      <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={timeFilter}
          exclusive
          onChange={handleTimeFilterChange}
          aria-label="filtro temporale"
          size="small"
          color="primary"
        >
          <ToggleButton value="all">
            Tutti
          </ToggleButton>
          <ToggleButton value="upcoming">
            Futuri
          </ToggleButton>
          <ToggleButton value="past">
            Passati
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {participations.length > 0 ? (
          filteredParticipations.length > 0 ? (
            <Grid container spacing={3}>
              {filteredParticipations.map((participation) => {
                const eventObj = typeof participation.event === 'object' ? participation.event : null;
                if (!eventObj) return null;
                return (
                  <Grid item key={participation._id} xs={12} sm={6} md={4}>
                    {renderEventCard(eventObj, true)}
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {timeFilter === 'upcoming' ? 'Non hai partecipazioni a eventi futuri.' : 'Non hai partecipazioni a eventi passati.'}
              </Typography>
            </Box>
          )
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Non sei iscritto a nessun evento.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/events')}
            >
              Esplora eventi
            </Button>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {organizedEvents.length > 0 ? (
          filteredOrganizedEvents.length > 0 ? (
            <Grid container spacing={3}>
              {filteredOrganizedEvents.map((event) => (
                <Grid item key={event._id} xs={12} sm={6} md={4}>
                  {renderEventCard(event)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {timeFilter === 'upcoming' ? 'Non hai eventi organizzati futuri.' : 'Non hai eventi organizzati passati.'}
              </Typography>
            </Box>
          )
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Non hai ancora organizzato eventi.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/events/create')}
            >
              Crea un evento
            </Button>
          </Box>
        )}
      </TabPanel>
    </Container>
  );
};

export default MyEventsPage;
