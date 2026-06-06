import { CreateEquipmentDto } from './create-equipment.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}
