import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSearchLogDto {
  @IsNotEmpty()
  query!: string;

  @IsOptional()
  equipmentId?: string;
}
