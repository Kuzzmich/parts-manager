import { PartialType } from '@nestjs/swagger';
import { CreateSearchLogDto } from './create-search-log.dto';

export class UpdateSearchLogDto extends PartialType(CreateSearchLogDto) {}
