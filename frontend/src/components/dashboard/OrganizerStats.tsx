import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Divider } from '@mui/material';
import { eventService } from '../../services/eventService';
import participationService from '../../services/participationService';
import { Event } from '../../types/event.types';
import { Participation } from '../../types/participation.types';
import { isAfter, isBefore, isToday, parseISO } from 'date-fns';

interface OrganizerStatsProps {
  userId: string;
}

const OrganizerStats: React.FC<OrganizerStatsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carica gli eventi organizzati dall'utente
        const eventsData = await eventService.getEventsByOrganizer(userId);
        setEvents(eventsData);

        // Carica tutte le partecipazioni agli eventi dell'organizzatore
        const participationsPromises = eventsData.map(event => 
          participationService.getEventParticipants(event._id)
        );
        const participationsResults = await Promise.all(participationsPromises);
        const allParticipations = participationsResults.flat();
        setParticipations(allParticipations);
      } catch (err) {
        console.error('Errore nel caricamento delle statistiche:', err);
        setError('Si è verificato un errore nel caricamento delle statistiche.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Funzioni per calcolare le statistiche
  const getTotalEvents = () => events.length;
  
  const getActiveEvents = () => events.filter(event => event.status === 'active').length;
  
  const getCompletedEvents = () => events.filter(event => event.status === 'completed').length;
  
  // Ottieni il numero di eventi cancellati
  const getCancelledEvents = () => events.filter(event => event.status === 'cancelled').length;
  
  const getTotalParticipants = () => participations.length;
  
  const getUpcomingEvents = () => {
    return events.filter(event => {
      const eventDate = parseISO(event.startDate);
      const now = new Date();
      return isAfter(eventDate, now) || isToday(eventDate);
    }).length;
  };
  
  const getPastEvents = () => {
    return events.filter(event => {
      const eventDate = parseISO(event.endDate || event.startDate);
      const now = new Date();
      return isBefore(eventDate, now) && !isToday(eventDate);
    }).length;
  };
  
  const getAverageParticipantsPerEvent = () => {
    if (events.length === 0) return 0;
    return (participations.length / events.length).toFixed(1);
  };

  // Componente per mostrare una singola statistica
  const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ my: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Statistiche Organizzatore
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3} component="div">
          <StatItem label="Eventi Totali" value={getTotalEvents()} />
        </Grid>
        <Grid item xs={6} sm={3} component="div">
          <StatItem label="Eventi Attivi" value={getActiveEvents()} />
        </Grid>
        <Grid item xs={6} sm={3} component="div">
          <StatItem label="Eventi Futuri" value={getUpcomingEvents()} />
        </Grid>
        <Grid item xs={6} sm={3} component="div">
          <StatItem label="Eventi Passati" value={getPastEvents()} />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} component="div">
          <StatItem label="Partecipanti Totali" value={getTotalParticipants()} />
        </Grid>
        <Grid item xs={6} sm={4} component="div">
          <StatItem label="Media Partecipanti" value={getAverageParticipantsPerEvent()} />
        </Grid>
        <Grid item xs={6} sm={4} component="div">
          <StatItem label="Eventi Completati" value={getCompletedEvents()} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrganizerStats;
