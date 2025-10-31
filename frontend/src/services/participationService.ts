import axios from 'axios';
import AuthService from './auth.service';
import { 
  Participation, 
  CreateParticipationDto, 
  UpdateParticipationDto,
  QueryParticipationsDto,
  PaginatedParticipations
} from '../types/participation.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Funzione per ottenere gli header di autenticazione
const getAuthHeader = () => {
  const token = AuthService.getToken();
  if (!token) return {};
  
  return {
    Authorization: `Bearer ${token}`
  };
};

export const participationService = {
  /**
   * Iscrive l'utente a un evento
   * @param eventId - ID dell'evento a cui iscriversi
   * @param notes - Note opzionali per l'iscrizione
   */
  async joinEvent(eventId: string, notes?: string): Promise<Participation> {
    const data: CreateParticipationDto = {
      eventId,
      notes
    };
    
    const response = await axios.post(
      `${API_URL}/participations`, 
      data, 
      { headers: getAuthHeader() }
    );
    
    return response.data;
  },
  
  /**
   * Annulla l'iscrizione a un evento
   * @param eventId - ID dell'evento da cui disiscriversi
   */
  async leaveEvent(eventId: string): Promise<void> {
    await axios.delete(
      `${API_URL}/participations/event/${eventId}`, 
      { headers: getAuthHeader() }
    );
  },
  
  /**
   * Ottiene tutte le partecipazioni dell'utente corrente
   */
  async getMyParticipations(): Promise<Participation[]> {
    const response = await axios.get(
      `${API_URL}/participations/user/me`, 
      { headers: getAuthHeader() }
    );
    
    return response.data;
  },
  
  /**
   * Ottiene tutti i partecipanti di un evento (solo per l'organizzatore)
   * @param eventId - ID dell'evento
   */
  async getEventParticipants(eventId: string): Promise<Participation[]> {
    const response = await axios.get(
      `${API_URL}/participations/event/${eventId}`, 
      { headers: getAuthHeader() }
    );
    
    return response.data;
  },
  
  /**
   * Verifica se l'utente è iscritto a un evento
   * @param eventId - ID dell'evento da verificare
   */
  async checkParticipation(eventId: string): Promise<boolean> {
    try {
      const participations = await this.getMyParticipations();
      return participations.some(p => {
        const event = typeof p.event === 'string' ? p.event : p.event._id;
        return event === eventId;
      });
    } catch (error) {
      console.error('Errore nel controllo della partecipazione:', error);
      return false;
    }
  },
  
  /**
   * Aggiorna lo stato di una partecipazione
   * @param participationId - ID della partecipazione
   * @param updateData - Dati di aggiornamento
   */
  async updateParticipation(
    participationId: string, 
    updateData: UpdateParticipationDto
  ): Promise<Participation> {
    const response = await axios.patch(
      `${API_URL}/participations/${participationId}`, 
      updateData, 
      { headers: getAuthHeader() }
    );
    
    return response.data;
  }
};

export default participationService;
