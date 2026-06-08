import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartDto } from './dto/create-part.dto';
import { Equipment, Part, Prisma } from '@prisma/client';
import { FindPart } from './interfaces/find-part.interface';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaTopics } from '../kafka/kafka.topics';

@Injectable()
export class PartsService {
  constructor(
    private prismaService: PrismaService,
    private kafkaService: KafkaService,
  ) {}

  async create(
    equipmentId: string,
    payload: CreatePartDto,
  ): Promise<Part | never> {
    const equipment = await this.prismaService.db.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${equipmentId} not found`);
    }

    const part: Part = await this.prismaService.db.part.create({
      data: { equipmentId, ...payload },
    });

    await this.kafkaService.emit(KafkaTopics.PART_ADDED, part);

    return part;
  }

  async findAll(
    equipmentId: string,
    page: number,
    limit: number,
  ): Promise<FindPart | never> {
    const [equipment, data, total] = await Promise.all([
      this.prismaService.db.equipment.findUnique({
        where: { id: equipmentId },
      }),
      this.prismaService.db.part.findMany({
        where: { equipmentId },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.db.part.count({ where: { equipmentId } }),
    ]);

    if (!equipment) {
      throw new NotFoundException(`Equipment with id ${equipmentId} not found`);
    }

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Part | never> {
    const part = await this.prismaService.db.part.findUnique({ where: { id } });

    if (!part) {
      throw new NotFoundException(`Part with id ${id} not found`);
    }

    return part;
  }

  async update(
    id: string,
    update: Prisma.PartUpdateInput,
  ): Promise<Part | never> {
    try {
      return await this.prismaService.db.part.update({
        where: { id },
        data: update,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Part with id ${id} not found`);
      }

      throw e;
    }
  }

  async delete(id: string): Promise<Part | never> {
    try {
      return await this.prismaService.db.part.softDelete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Part with id ${id} not found`);
      }
      throw e;
    }
  }
}
