import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateSearchLogDto } from './dto/create-search-log.dto';
import { Prisma, SearchLog } from '@prisma/client';
import { FindSearchLogs } from './dto/interfaces/find-search-logs.interface';

@Injectable()
export class SearchLogService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
    private kafkaService: KafkaService,
  ) {}

  async create(
    managerId: string,
    payload: CreateSearchLogDto,
  ): Promise<SearchLog | never> {
    const { query, equipmentId } = payload;

    try {
      const log = await this.prismaService.db.searchLog.create({
        data: { managerId, query, equipmentId },
      });

      await this.kafkaService.emit('search-log', {
        searchLogId: log.id,
        managerId,
        query,
        equipmentId,
        createdAt: log.createdAt,
      });

      return log;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        throw new NotFoundException(
          `Equipment with id ${equipmentId} not found`,
        );
      }

      throw e;
    }
  }

  async update(
    id: string,
    payload: Prisma.SearchLogUpdateInput,
  ): Promise<SearchLog | never> {
    try {
      return await this.prismaService.db.searchLog.update({
        where: { id },
        data: payload,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Search log with id ${id} not found`);
      }

      throw e;
    }
  }

  async findAll(
    page: number,
    limit: number,
    managerId?: string,
    equipmentId?: string,
  ): Promise<FindSearchLogs> {
    const where = {
      ...(managerId && { managerId }),
      ...(equipmentId && { equipmentId }),
    };

    const cacheKey = `search-log:${managerId ?? 'all'}:${equipmentId ?? 'all'}:${page}:${limit}`;
    const cached: FindSearchLogs | null =
      await this.redisService.getJson(cacheKey);

    if (cached) {
      return cached;
    }

    const [data, total] = await Promise.all([
      this.prismaService.db.searchLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.db.searchLog.count({ where }),
    ]);

    const result = { data, total, page, limit };
    await this.redisService.setJson(cacheKey, result, 60);

    return result;
  }
}
