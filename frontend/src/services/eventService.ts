import axios from 'axios';
import AuthService from './auth.service';
import { 
  Event, 
  PaginatedEvents, 
  CreateEventDto, 
  UpdateEventDto, 
  QueryEventsDto 
} from '../types/event.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Funzione per ottenere il token di autenticazione
const getAuthHeader = () => {
  const token = AuthService.getToken();
  if (!token) return {};
  
  return {
    Authorization: `Bearer ${token}`
  };
};

// Servizio per gli eventi
export const eventService = {
  // Ottiene tutti gli eventi con paginazione e filtri
  async getEvents(queryParams: QueryEventsDto = {}): Promise<PaginatedEvents> {
    const params = new URLSearchParams();
    
    // Aggiungi i parametri di query se presenti
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(
      `${API_URL}/events?${params.toString()}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  // Ottiene un evento specifico per ID
  async getEventById(id: string): Promise<Event> {
    const response = await axios.get(
      `${API_URL}/events/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  // Crea un nuovo evento
  async createEvent(eventData: CreateEventDto): Promise<Event> {
    const response = await axios.post(
      `${API_URL}/events`, 
      eventData, 
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  // Aggiorna un evento esistente
  async updateEvent(id: string, eventData: UpdateEventDto): Promise<Event> {
    const response = await axios.patch(
      `${API_URL}/events/${id}`, 
      eventData, 
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  // Elimina un evento
  async deleteEvent(id: string): Promise<void> {
    await axios.delete(
      `${API_URL}/events/${id}`, 
      { headers: getAuthHeader() }
    );
  },
  
  // Partecipa a un evento
  async joinEvent(id: string): Promise<Event> {
    const response = await axios.post(
      `${API_URL}/events/${id}/join`, 
      {}, 
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  // Lascia un evento
  async leaveEvent(id: string): Promise<Event> {
    const response = await axios.post(
      `${API_URL}/events/${id}/leave`, 
      {}, 
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  // Ottiene gli eventi organizzati da un utente
  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    const response = await axios.get(
      `${API_URL}/events/organizer/${organizerId}`
    );
    return response.data;
  },
  
  // Ottiene gli eventi a cui partecipa un utente
  async getEventsByParticipant(participantId: string): Promise<Event[]> {
    const response = await axios.get(
      `${API_URL}/events/participant/${participantId}`
    );
    return response.data;
  }
};
