import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { QueryEventsDto } from '../dto/query-events.dto';
import { User, UserDocument } from '../../users/schemas/user.schema';

// Tipo di utilità per gestire i documenti Mongoose
type MongooseDocument<T> = T & { _id: Types.ObjectId | string };

// Funzione di utilità per ottenere l'ID come stringa da un oggetto Mongoose
function getIdAsString(obj: any): string {
  if (!obj) return '';
  
  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }
  
  if (typeof obj === 'string') {
    return obj;
  }
  
  if (typeof obj === 'object' && obj._id) {
    return obj._id instanceof Types.ObjectId 
      ? obj._id.toString() 
      : typeof obj._id === 'string' 
        ? obj._id 
        : String(obj._id);
  }
  
  return String(obj);
}

// Funzione di utilità per verificare se un utente è organizzatore o partecipante di un evento
function isUserOrganizerOrParticipant(user: any, event: any): boolean {
  const userId = getIdAsString(user);
  const organizerId = getIdAsString(event.organizer);
  
  if (userId === organizerId) {
    return true;
  }
  
  // Verifica se l'utente è un partecipante
  return isUserParticipant(user, event);
}

// Funzione di utilità per verificare se un utente è partecipante di un evento
function isUserParticipant(user: any, event: any): boolean {
  const userId = getIdAsString(user);
  
  if (!event.participants || !Array.isArray(event.participants)) {
    return false;
  }
  
  return event.participants.some(p => getIdAsString(p) === userId);
}

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto, user: MongooseDocument<User>): Promise<Event> {
    // Validate dates
    if (new Date(createEventDto.startDate) > new Date(createEventDto.endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (new Date(createEventDto.startDate) < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    const createdEvent = new this.eventModel({
      ...createEventDto,
      organizer: user._id,
      participants: [], // Start with empty participants
    });

    return createdEvent.save();
  }

  async findAll(queryDto: QueryEventsDto, user?: MongooseDocument<User>): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, category, startDateFrom, startDateTo, status, organizer } = queryDto;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    // Add filters if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (startDateFrom || startDateTo) {
      query.startDate = {};
      if (startDateFrom) {
        query.startDate.$gte = startDateFrom;
      }
      if (startDateTo) {
        query.startDate.$lte = startDateTo;
      }
    }

    if (status) {
      query.status = status;
    }

    if (organizer) {
      query.organizer = new Types.ObjectId(organizer);
    }

    // Only show private events to organizers or participants
    if (user) {
      // If user is logged in, show public events and private events where user is organizer or participant
      query.$or = query.$or || [];
      query.$or.push(
        { isPrivate: false },
        { organizer: user._id },
        { participants: user._id }
      );
    } else {
      // If no user, only show public events
      query.isPrivate = false;
    }

    const total = await this.eventModel.countDocuments(query);
    const events = await this.eventModel.find(query)
      .populate('organizer', 'name email')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      events,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, user?: MongooseDocument<User>): Promise<Event> {
    this.validateObjectId(id);

    const event = await this.eventModel.findById(id)
      .populate('organizer', 'name email')
      .populate('participants', 'name email')
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if event is private and user is not organizer or participant
    if (event.isPrivate && (!user || 
        !isUserOrganizerOrParticipant(user, event))) {
      throw new ForbiddenException('You do not have access to this private event');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: MongooseDocument<User>): Promise<Event> {
    this.validateObjectId(id);

    const event = await this.eventModel.findById(id);
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user is the organizer
    const eventOrganizerId = event.organizer instanceof Types.ObjectId 
      ? event.organizer.toString() 
      : event.organizer;
    const userId = user._id.toString();
      
    if (eventOrganizerId !== userId) {
      throw new ForbiddenException('Only the event organizer can update this event');
    }

    // Validate dates if provided
    if (updateEventDto.startDate && updateEventDto.endDate) {
      if (new Date(updateEventDto.startDate) > new Date(updateEventDto.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    } else if (updateEventDto.startDate && !updateEventDto.endDate) {
      if (new Date(updateEventDto.startDate) > new Date(event.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    } else if (!updateEventDto.startDate && updateEventDto.endDate) {
      if (new Date(event.startDate) > new Date(updateEventDto.endDate)) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    // Don't allow reducing max participants below current participant count
    if (updateEventDto.maxParticipants !== undefined && 
        event.participants.length > updateEventDto.maxParticipants) {
      throw new BadRequestException(
        `Cannot reduce max participants below current participant count (${event.participants.length})`
      );
    }

    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      id, 
      { $set: updateEventDto }, 
      { new: true }
    ).populate('organizer', 'name email');

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found after update`);
    }

    return updatedEvent;
  }

  async remove(id: string, user: MongooseDocument<User>): Promise<void> {
    this.validateObjectId(id);

    const event = await this.eventModel.findById(id);
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if user is the organizer
    const eventOrganizerId = event.organizer instanceof Types.ObjectId 
      ? event.organizer.toString() 
      : event.organizer;
    const userId = user._id.toString();
      
    if (eventOrganizerId !== userId) {
      throw new ForbiddenException('Only the event organizer can delete this event');
    }

    await this.eventModel.findByIdAndDelete(id);
  }

  async joinEvent(eventId: string, user: MongooseDocument<User>): Promise<Event> {
    this.validateObjectId(eventId);

    const event = await this.eventModel.findById(eventId);
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if event is active
    if (event.status !== 'active') {
      throw new BadRequestException(`Cannot join a ${event.status} event`);
    }

    // Check if user is already a participant
    if (isUserParticipant(user, event)) {
      throw new BadRequestException('You are already a participant of this event');
    }

    // Check if event has reached max participants
    if (event.maxParticipants > 0 && event.participants.length >= event.maxParticipants) {
      throw new BadRequestException('Event has reached maximum participants');
    }

    // Add user to participants
    const userId = getIdAsString(user);
    event.participants.push(userId);
    await event.save();

    try {
      return await this.findOne(eventId, user);
    } catch (error) {
      // Se l'evento non viene trovato dopo il salvataggio, restituisci l'evento originale
      if (error instanceof NotFoundException) {
        return event;
      }
      throw error;
    }
  }

  async leaveEvent(eventId: string, user: MongooseDocument<User>): Promise<Event> {
    this.validateObjectId(eventId);

    const event = await this.eventModel.findById(eventId);
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Check if user is a participant
    if (!isUserParticipant(user, event)) {
      throw new BadRequestException('You are not a participant of this event');
    }

    // Remove user from participants
    const userId = getIdAsString(user);
    event.participants = event.participants.filter(p => getIdAsString(p) !== userId);
    await event.save();

    try {
      return await this.findOne(eventId, user);
    } catch (error) {
      // Se l'evento non viene trovato dopo il salvataggio, restituisci l'evento originale
      if (error instanceof NotFoundException) {
        return event;
      }
      throw error;
    }
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    this.validateObjectId(organizerId);

    return this.eventModel.find({ organizer: organizerId })
      .sort({ startDate: 1 })
      .exec();
  }

  async getEventsByParticipant(participantId: string): Promise<Event[]> {
    this.validateObjectId(participantId);

    return this.eventModel.find({ participants: participantId })
      .sort({ startDate: 1 })
      .exec();
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  }
}
