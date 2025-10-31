import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Participation, ParticipationDocument, ParticipationStatus } from '../schemas/participation.schema';
import { Event, EventDocument } from '../../events/schemas/event.schema';
import { User } from '../../users/schemas/user.schema';
import { CreateParticipationDto } from '../dto/create-participation.dto';
import { UpdateParticipationDto } from '../dto/update-participation.dto';
import { QueryParticipationsDto } from '../dto/query-participations.dto';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectModel(Participation.name) private participationModel: Model<ParticipationDocument>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  /**
   * Crea una nuova partecipazione (iscrizione a un evento)
   */
  async create(createParticipationDto: CreateParticipationDto, user: any): Promise<Participation> {
    const { eventId, status, notes } = createParticipationDto;
    
    // Verifica che l'evento esista
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Evento con ID ${eventId} non trovato`);
    }
    
    // Verifica che l'evento sia attivo
    if (event.status !== 'active') {
      throw new BadRequestException(`Non è possibile iscriversi a un evento ${event.status}`);
    }
    
    // Verifica che l'evento non abbia raggiunto il numero massimo di partecipanti
    if (event.maxParticipants > 0) {
      const participantsCount = await this.participationModel.countDocuments({
        event: eventId,
        status: ParticipationStatus.CONFIRMED
      });
      
      if (participantsCount >= event.maxParticipants) {
        throw new BadRequestException('L\'evento ha raggiunto il numero massimo di partecipanti');
      }
    }
    
    // Verifica che l'utente non sia già iscritto all'evento
    const existingParticipation = await this.participationModel.findOne({
      user: user._id,
      event: eventId
    });
    
    if (existingParticipation) {
      throw new BadRequestException('Sei già iscritto a questo evento');
    }
    
    // Crea la partecipazione
    const participation = new this.participationModel({
      user: user._id,
      event: eventId,
      status: status || ParticipationStatus.CONFIRMED,
      notes
    });
    
    // Aggiorna anche l'array dei partecipanti nell'evento
    await this.eventModel.findByIdAndUpdate(eventId, {
      $push: { participants: user._id }
    });
    
    return participation.save();
  }

  /**
   * Trova tutte le partecipazioni in base ai filtri
   */
  async findAll(queryDto: QueryParticipationsDto): Promise<{ participations: Participation[], total: number, page: number, limit: number }> {
    const { userId, eventId, status, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;
    
    // Costruisci la query
    const query: any = {};
    
    if (userId) {
      query.user = new Types.ObjectId(userId);
    }
    
    if (eventId) {
      query.event = new Types.ObjectId(eventId);
    }
    
    if (status) {
      query.status = status;
    }
    
    const total = await this.participationModel.countDocuments(query);
    const participations = await this.participationModel.find(query)
      .populate('user', 'name email')
      .populate('event', 'title startDate location')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      participations,
      total,
      page,
      limit
    };
  }

  /**
   * Trova una partecipazione specifica
   */
  async findOne(id: string): Promise<Participation> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID partecipazione non valido: ${id}`);
    }
    
    const participation = await this.participationModel.findById(id)
      .populate('user', 'name email')
      .populate('event', 'title startDate location organizer')
      .exec();
    
    if (!participation) {
      throw new NotFoundException(`Partecipazione con ID ${id} non trovata`);
    }
    
    return participation;
  }

  /**
   * Trova le partecipazioni di un utente
   */
  async findByUser(userId: string): Promise<Participation[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(`ID utente non valido: ${userId}`);
    }
    
    return this.participationModel.find({ user: userId })
      .populate('event', 'title startDate location imageUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Trova le partecipazioni a un evento
   */
  async findByEvent(eventId: string, user: any): Promise<Participation[]> {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException(`ID evento non valido: ${eventId}`);
    }
    
    // Verifica che l'evento esista
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException(`Evento con ID ${eventId} non trovato`);
    }
    
    // Verifica che l'utente sia l'organizzatore dell'evento
    const organizerId = event.organizer instanceof Types.ObjectId 
      ? event.organizer.toString() 
      : event.organizer;
    
    if (organizerId !== user._id.toString()) {
      throw new ForbiddenException('Solo l\'organizzatore può visualizzare tutti i partecipanti');
    }
    
    return this.participationModel.find({ event: eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Aggiorna lo stato di una partecipazione
   */
  async update(id: string, updateParticipationDto: UpdateParticipationDto, user: any): Promise<Participation | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID partecipazione non valido: ${id}`);
    }
    
    const participation = await this.participationModel.findById(id)
      .populate('event', 'organizer');
    
    if (!participation) {
      throw new NotFoundException(`Partecipazione con ID ${id} non trovata`);
    }
    
    // Verifica che l'utente sia l'organizzatore dell'evento o il partecipante stesso
    const event = participation.event as any;
    const organizerId = event.organizer instanceof Types.ObjectId 
      ? event.organizer.toString() 
      : event.organizer;
    const participantId = participation.user instanceof Types.ObjectId 
      ? participation.user.toString() 
      : participation.user;
    
    if (organizerId !== user._id.toString() && participantId !== user._id.toString()) {
      throw new ForbiddenException('Non hai i permessi per aggiornare questa partecipazione');
    }
    
    // Se lo stato viene cambiato in CANCELLED, rimuovi l'utente dall'array dei partecipanti dell'evento
    if (updateParticipationDto.status === ParticipationStatus.CANCELLED && 
        participation.status !== ParticipationStatus.CANCELLED) {
      await this.eventModel.findByIdAndUpdate(event._id, {
        $pull: { participants: participation.user }
      });
    }
    
    // Se lo stato viene cambiato da CANCELLED a CONFIRMED, aggiungi l'utente all'array dei partecipanti
    if (updateParticipationDto.status === ParticipationStatus.CONFIRMED && 
        participation.status === ParticipationStatus.CANCELLED) {
      await this.eventModel.findByIdAndUpdate(event._id, {
        $push: { participants: participation.user }
      });
    }
    
    const updatedParticipation = await this.participationModel.findByIdAndUpdate(
      id,
      { $set: updateParticipationDto },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('event', 'title startDate location')
    .exec();
    
    if (!updatedParticipation) {
      throw new NotFoundException(`Partecipazione con ID ${id} non trovata dopo l'aggiornamento`);
    }
    
    return updatedParticipation;
  }

  /**
   * Cancella una partecipazione (annulla l'iscrizione)
   */
  async remove(id: string, user: any): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`ID partecipazione non valido: ${id}`);
    }
    
    const participation = await this.participationModel.findById(id)
      .populate('event', 'organizer');
    
    if (!participation) {
      throw new NotFoundException(`Partecipazione con ID ${id} non trovata`);
    }
    
    // Verifica che l'utente sia l'organizzatore dell'evento o il partecipante stesso
    const event = participation.event as any;
    const organizerId = event.organizer instanceof Types.ObjectId 
      ? event.organizer.toString() 
      : event.organizer;
    const participantId = participation.user instanceof Types.ObjectId 
      ? participation.user.toString() 
      : participation.user;
    
    if (organizerId !== user._id.toString() && participantId !== user._id.toString()) {
      throw new ForbiddenException('Non hai i permessi per cancellare questa partecipazione');
    }
    
    // Rimuovi l'utente dall'array dei partecipanti dell'evento
    await this.eventModel.findByIdAndUpdate(event._id, {
      $pull: { participants: participation.user }
    });
    
    await this.participationModel.findByIdAndDelete(id);
  }

  /**
   * Annulla l'iscrizione a un evento
   */
  async cancelParticipation(eventId: string, user: any): Promise<void> {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException(`ID evento non valido: ${eventId}`);
    }
    
    // Trova la partecipazione
    const participation = await this.participationModel.findOne({
      user: user._id,
      event: eventId
    });
    
    if (!participation) {
      throw new NotFoundException('Non sei iscritto a questo evento');
    }
    
    // Rimuovi l'utente dall'array dei partecipanti dell'evento
    await this.eventModel.findByIdAndUpdate(eventId, {
      $pull: { participants: user._id }
    });
    
    await this.participationModel.findByIdAndDelete(participation._id);
  }
}
