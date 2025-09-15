// Tipi per gli eventi
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: User | string;
  participants: (User | string)[];
  category: string;
  imageUrl?: string;
  maxParticipants: number;
  status: 'active' | 'cancelled' | 'completed';
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipo per la risposta paginata di eventi
export interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}

// DTO per la creazione di eventi
export interface CreateEventDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  imageUrl?: string;
  maxParticipants?: number;
  isPrivate?: boolean;
}

// DTO per l'aggiornamento di eventi
export interface UpdateEventDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  imageUrl?: string;
  maxParticipants?: number;
  status?: 'active' | 'cancelled' | 'completed';
  isPrivate?: boolean;
}

// DTO per la query di eventi
export interface QueryEventsDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  startDateFrom?: string;
  startDateTo?: string;
  status?: string;
  organizer?: string;
}
