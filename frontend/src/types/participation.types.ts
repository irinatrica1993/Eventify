import { Event } from './event.types';

// Definizione dell'interfaccia User se non esiste già
interface User {
  _id: string;
  name: string;
  email: string;
}

export enum ParticipationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface Participation {
  _id: string;
  user: User | string;
  event: Event | string;
  status: ParticipationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParticipationDto {
  eventId: string;
  status?: ParticipationStatus;
  notes?: string;
}

export interface UpdateParticipationDto {
  status?: ParticipationStatus;
  notes?: string;
}

export interface QueryParticipationsDto {
  userId?: string;
  eventId?: string;
  status?: ParticipationStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedParticipations {
  participations: Participation[];
  total: number;
  page: number;
  limit: number;
}
