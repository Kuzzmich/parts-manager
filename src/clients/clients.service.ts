import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Prisma } from '@prisma/client';
import { FindClients } from './interfaces/find-clients.interface';

@Injectable()
export class ClientsService {
  constructor(private prismaService: PrismaService) {}

  async create(name: string, inn?: string, notes?: string): Promise<Client> {
    return this.prismaService.db.client.create({
      data: { name, inn, notes },
    });
  }

  async findAll(page: number, limit: number): Promise<FindClients> {
    const [data, total] = await Promise.all([
      this.prismaService.db.client.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.db.client.count(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Client | never> {
    const client = await this.prismaService.db.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async update(params: {
    id: string;
    update: Prisma.ClientUpdateInput;
  }): Promise<Client> {
    const { id, update } = params;
    return this.prismaService.db.client.update({ where: { id }, data: update });
  }

  async delete(id: string): Promise<Client> {
    const client = await this.prismaService.db.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return this.prismaService.db.client.softDelete({ where: { id } });
  }
}
