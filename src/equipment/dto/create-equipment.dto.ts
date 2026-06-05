import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
