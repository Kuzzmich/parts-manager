import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientsDto } from './dto/find-clients.dto';
import { Client } from '@prisma/client';
import { FindClients } from './interfaces/find-clients.interface';
import { UpdateClientDto } from './dto/update-client.dto';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  create(@Body() dto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(dto.name, dto.inn, dto.notes);
  }

  @Get()
  findAll(@Query() dto: FindClientsDto): Promise<FindClients> {
    return this.clientsService.findAll(dto.page, dto.limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Client | null> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientsService.update({ id: id, update: dto });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Client> {
    return this.clientsService.delete(id);
  }
}
