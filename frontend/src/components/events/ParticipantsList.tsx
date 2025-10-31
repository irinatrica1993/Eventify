import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import participationService from '../../services/participationService';
import { Participation, ParticipationStatus } from '../../types/participation.types';

interface ParticipantsListProps {
  eventId: string;
  isOrganizer: boolean;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ eventId, isOrganizer }) => {
  const [participants, setParticipants] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOrganizer && eventId) {
      fetchParticipants();
    }
  }, [eventId, isOrganizer]);

  const fetchParticipants = async () => {
    setLoading(true);
    setError(null);

    try {
      const participantsData = await participationService.getEventParticipants(eventId);
      setParticipants(participantsData);
    } catch (err: any) {
      console.error('Errore nel recupero dei partecipanti:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nel recupero dei partecipanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (participationId: string, newStatus: ParticipationStatus) => {
    try {
      await participationService.updateParticipation(participationId, { status: newStatus });
      // Aggiorna la lista dei partecipanti
      fetchParticipants();
    } catch (err: any) {
      console.error('Errore nell\'aggiornamento dello stato:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nell\'aggiornamento dello stato.');
    }
  };

  const getStatusColor = (status: ParticipationStatus) => {
    switch (status) {
      case ParticipationStatus.CONFIRMED:
        return 'success';
      case ParticipationStatus.PENDING:
        return 'warning';
      case ParticipationStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ParticipationStatus) => {
    switch (status) {
      case ParticipationStatus.CONFIRMED:
        return 'Confermato';
      case ParticipationStatus.PENDING:
        return 'In attesa';
      case ParticipationStatus.CANCELLED:
        return 'Cancellato';
      default:
        return status;
    }
  };

  if (!isOrganizer) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gestione Partecipanti ({participants.length})
      </Typography>
      
      {participants.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Nessun partecipante registrato.
        </Typography>
      ) : (
        <List>
          {participants.map((participation, index) => {
            const user = typeof participation.user === 'object' ? participation.user : { name: 'Utente', email: '' };
            
            return (
              <React.Fragment key={participation._id}>
                {index > 0 && <Divider variant="inset" component="li" />}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span">
                          {user.name}
                        </Typography>
                        <Chip 
                          label={getStatusLabel(participation.status)} 
                          color={getStatusColor(participation.status) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box component="span">
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {user.email}
                          </Typography>
                        </Box>
                        {participation.notes && (
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 1 }}
                          >
                            Note: {participation.notes}
                          </Typography>
                        )}
                        <Box component="span" sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          {participation.status !== ParticipationStatus.CONFIRMED && (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="success"
                              onClick={() => handleStatusChange(participation._id, ParticipationStatus.CONFIRMED)}
                            >
                              Conferma
                            </Button>
                          )}
                          {participation.status !== ParticipationStatus.CANCELLED && (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error"
                              onClick={() => handleStatusChange(participation._id, ParticipationStatus.CANCELLED)}
                            >
                              Cancella
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default ParticipantsList;
