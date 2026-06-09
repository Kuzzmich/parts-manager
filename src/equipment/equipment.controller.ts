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
import { EquipmentService } from './equipment.service';
import { Equipment } from '@prisma/client';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { FindEquipmentDto } from './dto/find-equipment.dto';
import { FindEquipment } from './interfaces/find-equipment.interface';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ParseUUIDPipe } from '../common/pipes/parse-uuid.pipe';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients/:clientId/equipment')
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  @Post()
  create(
    @Param('clientId') clientId: string,
    @Body() dto: CreateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentService.create(clientId, dto);
  }

  @Get()
  findAll(
    @Param('clientId') clientId: string,
    @Query() dto: FindEquipmentDto,
  ): Promise<FindEquipment> {
    return this.equipmentService.findAll(clientId, dto.page, dto.limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Equipment | never> {
    return this.equipmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEquipmentDto,
  ): Promise<Equipment | never> {
    return this.equipmentService.update({ id: id, update: dto });
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<Equipment> {
    return this.equipmentService.delete(id);
  }
}
