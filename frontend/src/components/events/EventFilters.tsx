import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  Paper,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { it } from 'date-fns/locale';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { QueryEventsDto } from '../../types/event.types';

interface EventFiltersProps {
  onFilter: (filters: QueryEventsDto) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<QueryEventsDto>({
    search: '',
    category: '',
    status: '',
    startDateFrom: '',
    startDateTo: '',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
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
  
  // Stati degli eventi
  const statuses = [
    { value: 'active', label: 'Attivo' },
    { value: 'cancelled', label: 'Cancellato' },
    { value: 'completed', label: 'Completato' }
  ];
  
  // Gestisce il cambiamento dei filtri
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name as string]: value
    }));
  };
  
  // Gestisce il cambiamento delle date
  const handleDateChange = (name: string) => (date: Date | null) => {
    setFilters(prev => ({
      ...prev,
      [name]: date ? date.toISOString() : ''
    }));
  };
  
  // Applica i filtri
  const applyFilters = () => {
    onFilter(filters);
  };
  
  // Resetta i filtri
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      startDateFrom: '',
      startDateTo: '',
    });
    onFilter({});
  };
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filtra Eventi</Typography>
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterListIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          name="search"
          label="Cerca eventi"
          variant="outlined"
          fullWidth
          value={filters.search || ''}
          onChange={handleChange}
          placeholder="Cerca per titolo o descrizione"
          size="small"
        />
      </Box>
      
      <Collapse in={showFilters}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1, mb: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 1, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-label">Categoria</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={filters.category || ''}
                  label="Categoria"
                  onChange={handleChange}
                >
                  <MenuItem value="">Tutte</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 1, mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Stato</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={filters.status || ''}
                  label="Stato"
                  onChange={handleChange}
                >
                  <MenuItem value="">Tutti</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 1, mb: 2 }}>
              <DatePicker
                label="Data inizio da"
                value={filters.startDateFrom ? new Date(filters.startDateFrom) : null}
                onChange={handleDateChange('startDateFrom')}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 1, mb: 2 }}>
              <DatePicker
                label="Data inizio a"
                value={filters.startDateTo ? new Date(filters.startDateTo) : null}
                onChange={handleDateChange('startDateTo')}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Box>
          </Box>
        </LocalizationProvider>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={resetFilters}
          >
            Resetta
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={applyFilters}
          >
            Applica Filtri
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default EventFilters;
