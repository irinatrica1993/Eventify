import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Pagination, 
  CircularProgress,
  Alert,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/events/EventCard';
import EventFilters from '../../components/events/EventFilters';
import { Event, QueryEventsDto } from '../../types/event.types';

const EventsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<QueryEventsDto>({});
  
  // Recupera gli eventi dal backend
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams: QueryEventsDto = {
        ...filters,
        page,
        limit: 12 // Numero di eventi per pagina
      };
      
      const response = await eventService.getEvents(queryParams);
      setEvents(response.events);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err) {
      console.error('Errore nel recupero degli eventi:', err);
      setError('Si è verificato un errore nel recupero degli eventi. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carica gli eventi all'avvio e quando cambiano i filtri o la pagina
  useEffect(() => {
    fetchEvents();
  }, [page, filters]);
  
  // Gestisce il cambio pagina
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Gestisce l'applicazione dei filtri
  const handleFilter = (newFilters: QueryEventsDto) => {
    setFilters(newFilters);
    setPage(1); // Torna alla prima pagina quando si applicano nuovi filtri
  };
  
  // Naviga alla pagina di creazione evento
  const handleCreateEvent = () => {
    navigate('/events/create');
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Eventi
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
        >
          Crea Evento
        </Button>
      </Box>
      
      <EventFilters onFilter={handleFilter} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nessun evento trovato
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Prova a modificare i filtri o crea un nuovo evento
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            {events.map(event => (
              <Box key={event._id} sx={{ 
                gridColumn: {
                  xs: 'span 12', 
                  sm: 'span 6', 
                  md: 'span 4', 
                  lg: 'span 3'
                }
              }}>
                <EventCard event={event} />
              </Box>
            ))}
          </Box>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
      
      {/* FAB per dispositivi mobili */}
      <Box sx={{ display: { sm: 'none' } }}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleCreateEvent}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default EventsListPage;
