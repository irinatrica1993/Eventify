import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  Request
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { QueryEventsDto } from '../dto/query-events.dto';
import { ParticipationDto } from '../dto/participation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user);
  }

  @Get()
  async findAll(@Query() queryDto: QueryEventsDto, @Request() req) {
    // Pass user if authenticated, otherwise pass undefined
    const user = req.user ? req.user : undefined;
    return this.eventsService.findAll(queryDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    return this.eventsService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string, 
    @Body() updateEventDto: UpdateEventDto, 
    @Request() req
  ) {
    return this.eventsService.update(id, updateEventDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinEvent(@Param('id') id: string, @Request() req) {
    return this.eventsService.joinEvent(id, req.user);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveEvent(@Param('id') id: string, @Request() req) {
    return this.eventsService.leaveEvent(id, req.user);
  }

  @Get('organizer/:id')
  async getEventsByOrganizer(@Param('id') id: string) {
    return this.eventsService.getEventsByOrganizer(id);
  }

  @Get('participant/:id')
  async getEventsByParticipant(@Param('id') id: string) {
    return this.eventsService.getEventsByParticipant(id);
  }
}
