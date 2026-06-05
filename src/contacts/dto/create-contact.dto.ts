import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  email?: string;
}
