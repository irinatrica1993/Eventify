import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch, 
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import ImageUploader from '../../components/common/ImageUploader';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { it } from 'date-fns/locale';
import { eventService } from '../../services/eventService';
import { CreateEventDto, UpdateEventDto } from '../../types/event.types';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EventFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<CreateEventDto | UpdateEventDto>({
    title: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3600000).toISOString(), // +1 ora
    location: '',
    category: '',
    imageUrl: '',
    maxParticipants: 0,
    isPrivate: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Categorie di esempio (da sostituire con dati reali)
  const categories = [
    'Musica',
    'Sport',
    'Arte',
    'Tecnologia',
    'Cibo',
    'Networking',
    'Formazione',
    'Altro'
  ];
  
  // Recupera i dettagli dell'evento in modalità modifica
  useEffect(() => {
    if (isEditMode && id) {
      const fetchEvent = async () => {
        try {
          const eventData = await eventService.getEventById(id);
          setFormData({
            title: eventData.title,
            description: eventData.description,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
            location: eventData.location,
            category: eventData.category,
            imageUrl: eventData.imageUrl || '',
            maxParticipants: eventData.maxParticipants,
            isPrivate: eventData.isPrivate,
            status: eventData.status,
          });
        } catch (err) {
          console.error('Errore nel recupero dei dettagli dell\'evento:', err);
          setError('Si è verificato un errore nel recupero dei dettagli dell\'evento. Riprova più tardi.');
        } finally {
          setFetchLoading(false);
        }
      };
      
      fetchEvent();
    }
  }, [id, isEditMode]);
  
  // Gestisce il cambiamento dei campi del form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };
  
  // Gestisce il cambiamento dello switch
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Gestisce il cambiamento delle date
  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date ? date.toISOString() : null
    }));
  };
  
  // Gestisce l'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isEditMode && id) {
        await eventService.updateEvent(id, formData as UpdateEventDto);
        setSuccess('Evento aggiornato con successo');
        setTimeout(() => navigate(`/events/${id}`), 1500);
      } else {
        const newEvent = await eventService.createEvent(formData as CreateEventDto);
        setSuccess('Evento creato con successo');
        setTimeout(() => navigate(`/events/${newEvent._id}`), 1500);
      }
    } catch (err: any) {
      console.error('Errore nel salvataggio dell\'evento:', err);
      setError(err.response?.data?.message || 'Si è verificato un errore nel salvataggio dell\'evento. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
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
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/events')}
            sx={{ mr: 2 }}
          >
            Indietro
          </Button>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Modifica Evento' : 'Crea Nuovo Evento'}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <TextField
                name="title"
                label="Titolo dell'evento"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Box>
            
            <Box>
              <TextField
                name="description"
                label="Descrizione"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
            
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: { xs: 2, md: 0 } }}>
                  <DateTimePicker
                    label="Data e ora di inizio"
                    value={formData.startDate ? new Date(formData.startDate) : null}
                    onChange={handleDateChange('startDate')}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </Box>
                
                <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1 }}>
                  <DateTimePicker
                    label="Data e ora di fine"
                    value={formData.endDate ? new Date(formData.endDate) : null}
                    onChange={handleDateChange('endDate')}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </Box>
              </Box>
            </LocalizationProvider>
            
            <Box>
              <TextField
                name="location"
                label="Luogo"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: { xs: 2, md: 0 } }}>
                <FormControl fullWidth required>
                  <InputLabel id="category-label">Categoria</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    label="Categoria"
                    onChange={handleChange}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1 }}>
                <TextField
                  name="maxParticipants"
                  label="Numero massimo di partecipanti (0 = illimitato)"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Box>
              <ImageUploader
                initialImage={formData.imageUrl}
                onImageChange={(imageUrl) => {
                  setFormData(prev => ({
                    ...prev,
                    imageUrl: imageUrl || ''
                  }));
                }}
                label="Immagine dell'evento"
              />
            </Box>
            
            {isEditMode && (
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Stato</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={(formData as UpdateEventDto).status || 'active'}
                    label="Stato"
                    onChange={handleChange}
                  >
                    <MenuItem value="active">Attivo</MenuItem>
                    <MenuItem value="cancelled">Cancellato</MenuItem>
                    <MenuItem value="completed">Completato</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
            
            <Box sx={{ width: '100%', maxWidth: isEditMode ? '50%' : '100%' }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isPrivate"
                    checked={!!formData.isPrivate}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Evento privato (visibile solo ai partecipanti)"
              />
            </Box>
            
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/events')}
                >
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : isEditMode ? 'Aggiorna Evento' : 'Crea Evento'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventFormPage;
