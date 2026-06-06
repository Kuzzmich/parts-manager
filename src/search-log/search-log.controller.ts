import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchLogService } from './search-log.service';
import { CreateSearchLogDto } from './dto/create-search-log.dto';
import type { Request } from 'express';
import { FindSearchLogDto } from './dto/find-search-log.dto';
import { SearchLog } from '@prisma/client';
import { FindSearchLogs } from './dto/interfaces/find-search-logs.interface';
import { UpdateSearchLogDto } from './dto/update-search-log.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search-log')
export class SearchLogController {
  constructor(private searchLogService: SearchLogService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() dto: CreateSearchLogDto,
  ): Promise<SearchLog | never> {
    return this.searchLogService.create(req.user.id, dto);
  }

  @Get()
  findAll(
    @Req() req: Request,
    @Query() dto: FindSearchLogDto,
  ): Promise<FindSearchLogs> {
    return this.searchLogService.findAll(
      dto.page,
      dto.limit,
      req.user.id,
      dto.equipmentId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSearchLogDto,
  ): Promise<SearchLog | never> {
    return this.searchLogService.update(id, dto);
  }
}
