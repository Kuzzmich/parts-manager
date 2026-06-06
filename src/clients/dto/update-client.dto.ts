import { CreateClientDto } from './create-client.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateClientDto extends PartialType(CreateClientDto) {}
