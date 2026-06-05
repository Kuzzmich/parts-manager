import { IsBoolean, IsDecimal, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/client';

export class CreatePartDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  partNumber?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  @Type(() => Decimal)
  @IsDecimal()
  price?: number;

  @Type(() => Boolean)
  @IsBoolean()
  inStock: boolean = true;

  @IsOptional()
  notes?: string;

  @IsOptional()
  addedById?: string;
}
