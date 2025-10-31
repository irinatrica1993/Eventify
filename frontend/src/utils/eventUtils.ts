import { Event } from '../types/event.types';
import { parseISO, isAfter, isBefore, isToday } from 'date-fns';

/**
 * Verifica se un evento è futuro (la data di inizio è oggi o nel futuro)
 */
export const isUpcomingEvent = (event: Event): boolean => {
  const eventDate = parseISO(event.startDate);
  const now = new Date();
  return isAfter(eventDate, now) || isToday(eventDate);
};

/**
 * Verifica se un evento è passato (la data di fine è nel passato)
 */
export const isPastEvent = (event: Event): boolean => {
  const eventDate = parseISO(event.endDate || event.startDate);
  const now = new Date();
  return isBefore(eventDate, now) && !isToday(eventDate);
};

/**
 * Verifica se un evento è in corso (la data di inizio è nel passato o oggi, e la data di fine è nel futuro o oggi)
 */
export const isOngoingEvent = (event: Event): boolean => {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate || event.startDate);
  const now = new Date();
  return (isBefore(startDate, now) || isToday(startDate)) && (isAfter(endDate, now) || isToday(endDate));
};

/**
 * Aggiorna lo stato di un evento in base alla data
 * Ritorna una copia dell'evento con lo stato aggiornato
 */
export const updateEventStatus = (event: Event): Event => {
  // Se l'evento è già cancellato, mantieni lo stato
  if (event.status === 'cancelled') {
    return event;
  }
  
  // Se l'evento è passato, imposta lo stato a 'completed'
  if (isPastEvent(event)) {
    return { ...event, status: 'completed' };
  }
  
  // Altrimenti mantieni lo stato attuale
  return event;
};

/**
 * Aggiorna lo stato di tutti gli eventi in un array
 */
export const updateEventsStatus = (events: Event[]): Event[] => {
  return events.map(updateEventStatus);
};
