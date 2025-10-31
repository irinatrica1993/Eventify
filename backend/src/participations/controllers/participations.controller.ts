import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request, 
  Query 
} from '@nestjs/common';
import { ParticipationsService } from '../services/participations.service';
import { CreateParticipationDto } from '../dto/create-participation.dto';
import { UpdateParticipationDto } from '../dto/update-participation.dto';
import { QueryParticipationsDto } from '../dto/query-participations.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';

@Controller('participations')
export class ParticipationsController {
  constructor(private readonly participationsService: ParticipationsService) {}

  /**
   * Crea una nuova partecipazione (iscrizione a un evento)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createParticipationDto: CreateParticipationDto, @Request() req) {
    return this.participationsService.create(createParticipationDto, req.user);
  }

  /**
   * Ottiene tutte le partecipazioni (solo per admin)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(@Query() queryDto: QueryParticipationsDto) {
    return this.participationsService.findAll(queryDto);
  }

  /**
   * Ottiene una partecipazione specifica
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.participationsService.findOne(id);
  }

  /**
   * Ottiene le partecipazioni dell'utente corrente
   */
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async findMyParticipations(@Request() req) {
    return this.participationsService.findByUser(req.user._id);
  }

  /**
   * Ottiene le partecipazioni di un utente specifico (solo per admin)
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findByUser(@Param('userId') userId: string) {
    return this.participationsService.findByUser(userId);
  }

  /**
   * Ottiene le partecipazioni a un evento specifico (solo per l'organizzatore)
   */
  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  async findByEvent(@Param('eventId') eventId: string, @Request() req) {
    return this.participationsService.findByEvent(eventId, req.user);
  }

  /**
   * Aggiorna una partecipazione
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string, 
    @Body() updateParticipationDto: UpdateParticipationDto,
    @Request() req
  ) {
    return this.participationsService.update(id, updateParticipationDto, req.user);
  }

  /**
   * Cancella una partecipazione (annulla l'iscrizione)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    return this.participationsService.remove(id, req.user);
  }

  /**
   * Annulla l'iscrizione a un evento
   */
  @Delete('event/:eventId')
  @UseGuards(JwtAuthGuard)
  async cancelParticipation(@Param('eventId') eventId: string, @Request() req) {
    return this.participationsService.cancelParticipation(eventId, req.user);
  }
}
