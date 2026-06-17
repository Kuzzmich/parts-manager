import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Prisma } from '@prisma/client';
import { FindClients } from './interfaces/find-clients.interface';

@Injectable()
export class ClientsService {
  constructor(private prismaService: PrismaService) {}

  async create(name: string, inn?: string, notes?: string): Promise<Client> {
    try {
      return await this.prismaService.db.client.create({
        data: { name, inn, notes },
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('Клиент с таким ИНН уже существует');
      }
      {
        throw new NotFoundException(`Client with name ${name} already exists`);
      }
      throw e;
    }
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

    try {
      return this.prismaService.db.client.update({
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
