import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Stack,
  CardActions
} from '@mui/material';
import { Event } from '../../types/event.types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  
  // Formatta la data dell'evento
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: it });
  };
  
  // Determina il colore del chip di stato
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'primary';
    }
  };
  
  // Traduce lo stato dell'evento
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo';
      case 'cancelled':
        return 'Cancellato';
      case 'completed':
        return 'Completato';
      default:
        return status;
    }
  };
  
  // Calcola il numero di partecipanti
  const participantsCount = event.participants ? event.participants.length : 0;
  
  // Gestisce il click sulla card
  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={event.imageUrl || 'https://source.unsplash.com/random?event'}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {event.category}
          </Typography>
          <Chip 
            label={getStatusLabel(event.status)} 
            size="small" 
            color={getStatusColor(event.status) as any}
            variant="outlined"
          />
        </Box>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {event.description}
        </Typography>
        
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(event.startDate)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {participantsCount} {event.maxParticipants > 0 ? `/ ${event.maxParticipants}` : ''} partecipanti
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleClick}
          sx={{ ml: 'auto' }}
        >
          Dettagli
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
