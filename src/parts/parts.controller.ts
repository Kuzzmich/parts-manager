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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { Part } from '@prisma/client';
import { FindPartDto } from './dto/find-part.dto';
import { FindPart } from './interfaces/find-part.interface';
import { UpdatePartDto } from './dto/update-part.dto';

@UseGuards(JwtAuthGuard)
@Controller('/clients/:clientId/equipment/:equipmentId/parts')
export class PartsController {
  constructor(private partsService: PartsService) {}

  @Post()
  create(
    @Param('equipmentId') equipmentId: string,
    @Body() dto: CreatePartDto,
  ): Promise<Part | never> {
    return this.partsService.create(equipmentId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Part | never> {
    return this.partsService.findOne(id);
  }

  @Get()
  findAll(
    @Param('equipmentId') equipmentId: string,
    @Query() dto: FindPartDto,
  ): Promise<FindPart | never> {
    return this.partsService.findAll(equipmentId, dto.page, dto.limit);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePartDto,
  ): Promise<Part | never> {
    return this.partsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Part | never> {
    return this.partsService.delete(id);
  }
}
