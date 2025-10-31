import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Chip, 
  Avatar, 
  AvatarGroup,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { updateEventStatus } from '../../utils/eventUtils';
import { eventService } from '../../services/eventService';
import participationService from '../../services/participationService';
import ParticipantsList from '../../components/events/ParticipantsList';
import { Event } from '../../types/event.types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Recupera l'utente corrente dal localStorage
  const getCurrentUser = (): { id: string } | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return { id: user.user.id };
    } catch (err) {
      console.error('Errore nel parsing dell\'utente:', err);
      return null;
    }
  };
  
  const currentUser = getCurrentUser();
  
  // Recupera i dettagli dell'evento
  const fetchEventDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const eventData = await eventService.getEventById(id);
      
      // Aggiorna lo stato dell'evento in base alla data
      const updatedEvent = updateEventStatus(eventData);
      
      // Se lo stato è cambiato, aggiorna l'evento sul server
      if (updatedEvent.status !== eventData.status) {
        try {
          await eventService.updateEvent(id, { status: updatedEvent.status });
          console.log(`Stato dell'evento ${id} aggiornato da ${eventData.status} a ${updatedEvent.status}`);
        } catch (error) {
          console.error(`Errore nell'aggiornamento dello stato dell'evento ${id}:`, error);
        }
      }
      
      setEvent(updatedEvent);
      
      // Controlla se l'utente corrente è l'organizzatore
      if (currentUser) {
        const organizerId = typeof eventData.organizer === 'object' 
          ? eventData.organizer._id 
          : eventData.organizer;
        
        setIsOrganizer(organizerId === currentUser.id);
        
        // Controlla se l'utente corrente è un partecipante
        const isUserParticipant = eventData.participants.some(p => {
          const participantId = typeof p === 'object' ? p._id : p;
          return participantId === currentUser.id;
        });
        
        setIsParticipant(isUserParticipant);
      }
    } catch (err: any) {
      console.error('Errore nel recupero dei dettagli dell\'evento:', err);
      
      // Gestione specifica per errore 403 (non autorizzato)
      if (err.response && err.response.status === 403) {
        if (!currentUser) {
          setError('Devi effettuare il login per visualizzare questo evento.');
        } else {
          setError('Non hai i permessi per visualizzare questo evento privato.');
        }
      } else {
        setError('Si è verificato un errore nel recupero dei dettagli dell\'evento. Riprova più tardi.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Carica i dettagli dell'evento all'avvio
  useEffect(() => {
    fetchEventDetails();
  }, [id]);
  
  // Formatta la data dell'evento
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: it });
  };
  
  // Gestisce la partecipazione all'evento
  const handleJoinEvent = async () => {
    if (!id || !currentUser) return;
    
    setJoinLoading(true);
    
    try {
      await participationService.joinEvent(id);
      // Ricarica i dettagli dell'evento per aggiornare la lista dei partecipanti
      await fetchEventDetails();
      setIsParticipant(true);
    } catch (err: any) {
      console.error('Errore nella partecipazione all\'evento:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nella partecipazione all\'evento.');
    } finally {
      setJoinLoading(false);
    }
  };
  
  // Gestisce l'abbandono dell'evento
  const handleLeaveEvent = async () => {
    if (!id || !currentUser) return;
    
    setJoinLoading(true);
    
    try {
      await participationService.leaveEvent(id);
      // Ricarica i dettagli dell'evento per aggiornare la lista dei partecipanti
      await fetchEventDetails();
      setIsParticipant(false);
    } catch (err: any) {
      console.error('Errore nell\'abbandono dell\'evento:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nell\'abbandono dell\'evento.');
    } finally {
      setJoinLoading(false);
    }
  };
  
  // Naviga alla pagina di modifica evento
  const handleEditEvent = () => {
    navigate(`/events/${id}/edit`);
  };
  
  // Apre il dialog di conferma eliminazione
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  // Chiude il dialog di conferma eliminazione
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // Gestisce l'eliminazione dell'evento
  const handleDeleteEvent = async () => {
    if (!id) return;
    
    try {
      await eventService.deleteEvent(id);
      navigate('/events', { state: { message: 'Evento eliminato con successo' } });
    } catch (err: any) {
      console.error('Errore nell\'eliminazione dell\'evento:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nell\'eliminazione dell\'evento.');
      handleCloseDeleteDialog();
    }
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
  
  // Verifica se l'evento è al completo
  const isEventFull = () => {
    if (!event) return false;
    return event.maxParticipants > 0 && event.participants.length >= event.maxParticipants;
  };
  
  // Verifica se l'evento è attivo
  const isEventActive = () => {
    if (!event) return false;
    return event.status === 'active';
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
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/events')}>
            Torna agli eventi
          </Button>
          {!currentUser && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
            >
              Accedi
            </Button>
          )}
        </Box>
      </Container>
    );
  }
  
  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Evento non trovato
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/events')}>
          Torna agli eventi
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {/* Immagine dell'evento */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2, mb: { xs: 3, md: 0 } }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 1,
              }}
              src={event.imageUrl || 'https://source.unsplash.com/random?event'}
              alt={event.title}
            />
          </Box>
          
          {/* Dettagli dell'evento */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {event.category}
                </Typography>
                <Typography variant="h4" component="h1" gutterBottom>
                  {event.title}
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={getStatusLabel(event.status)} 
                  color={getStatusColor(event.status) as any}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {event.isPrivate ? (
                <Chip icon={<LockIcon />} label="Evento privato" size="small" sx={{ mr: 1 }} />
              ) : (
                <Chip icon={<PublicIcon />} label="Evento pubblico" size="small" sx={{ mr: 1 }} />
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarTodayIcon sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1 }} color="action" />
                <Typography variant="body1">
                  {event.participants.length} {event.maxParticipants > 0 ? `/ ${event.maxParticipants}` : ''} partecipanti
                </Typography>
              </Box>
            </Box>
            
            {/* Azioni per l'evento */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {currentUser && (
                <>
                  {isOrganizer ? (
                    <>
                      <Button 
                        variant="outlined" 
                        startIcon={<EditIcon />} 
                        onClick={handleEditEvent}
                      >
                        Modifica
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={handleOpenDeleteDialog}
                      >
                        Elimina
                      </Button>
                    </>
                  ) : isEventActive() && (
                    isParticipant ? (
                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={handleLeaveEvent}
                        disabled={joinLoading}
                      >
                        {joinLoading ? <CircularProgress size={24} /> : 'Abbandona evento'}
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleJoinEvent}
                        disabled={joinLoading || isEventFull()}
                      >
                        {joinLoading ? <CircularProgress size={24} /> : isEventFull() ? 'Evento al completo' : 'Partecipa'}
                      </Button>
                    )
                  )}
                </>
              )}
              <Button 
                variant="outlined" 
                onClick={() => navigate('/events')}
              >
                Torna agli eventi
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* Descrizione dell'evento */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Descrizione
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>
        </Box>
        
        {/* Organizzatore */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Organizzatore
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>
              {typeof event.organizer === 'object' && event.organizer.name 
                ? event.organizer.name.charAt(0) 
                : 'O'}
            </Avatar>
            <Typography variant="body1">
              {typeof event.organizer === 'object' && event.organizer.name 
                ? event.organizer.name 
                : 'Organizzatore'}
            </Typography>
          </Box>
        </Box>
        
        {/* Partecipanti */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Partecipanti ({event.participants.length})
          </Typography>
          {event.participants.length > 0 ? (
            <>
              <AvatarGroup max={10} sx={{ mb: 2 }}>
                {event.participants.map((participant, index) => (
                  <Avatar key={index}>
                    {typeof participant === 'object' && participant.name 
                      ? participant.name.charAt(0) 
                      : 'P'}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {event.participants.map((participant, index) => (
                  <Chip 
                    key={index} 
                    label={typeof participant === 'object' && participant.name 
                      ? participant.name 
                      : `Partecipante ${index + 1}`} 
                  />
                ))}
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Nessun partecipante
            </Typography>
          )}
        </Box>
        
        {/* Lista dettagliata dei partecipanti (solo per l'organizzatore) */}
        {isOrganizer && id && (
          <ParticipantsList eventId={id} isOrganizer={isOrganizer} />
        )}
      </Paper>
      
      {/* Dialog di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare questo evento? Questa azione non può essere annullata.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annulla</Button>
          <Button onClick={handleDeleteEvent} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetailPage;
