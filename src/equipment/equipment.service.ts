import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Equipment, Prisma } from '@prisma/client';
import { FindEquipment } from './interfaces/find-equipment.interface';
import { CreateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(private prismaService: PrismaService) {}

  async create(
    clientId: string,
    payload: CreateEquipmentDto,
  ): Promise<Equipment | never> {
    const client = await this.prismaService.db.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    return this.prismaService.db.equipment.create({
      data: { clientId, ...payload },
    });
  }

  async findAll(
    clientId: string,
    page: number,
    limit: number,
  ): Promise<FindEquipment> {
    const [client, data, total] = await Promise.all([
      this.prismaService.db.client.findUnique({ where: { id: clientId } }),
      this.prismaService.db.equipment.findMany({
        where: { clientId },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.db.equipment.count(),
    ]);

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Equipment | never> {
    const equipment = await this.prismaService.db.equipment.findUnique({
      where: { id },
    });

    if (!equipment)
      throw new NotFoundException(`Equipment with id ${id} not found`);

    return equipment;
  }

  async update(params: { id: string; update: Prisma.EquipmentUpdateInput }) {
    const { id, update } = params;

    try {
      return this.prismaService.db.equipment.update({
        where: { id },
        data: update,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Equipment with id ${id} not found`);
      }

      throw error;
    }
  }

  async delete(id: string): Promise<Equipment> {
    return this.prismaService.db.equipment.softDelete({ where: { id } });
  }
}
