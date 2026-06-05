import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact, Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    clientId: string,
    payload: CreateContactDto,
  ): Promise<Contact | never> {
    const client = await this.prismaService.db.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${clientId} not found`);
    }

    return this.prismaService.db.contact.create({
      data: { clientId, ...payload },
    });
  }

  async find(clientId: string): Promise<Contact | never> {
    const contact = await this.prismaService.db.contact.findUnique({
      where: { clientId },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with id ${clientId} not found`);
    }

    return contact;
  }

  async update(params: {
    clientId: string;
    payload: Prisma.ContactUpdateInput;
  }): Promise<Contact | never> {
    const { clientId, payload } = params;
    try {
      return await this.prismaService.db.contact.update({
        where: { clientId },
        data: payload,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Contact with id ${clientId} not found`);
      }
      throw error;
    }
  }

  async delete(clientId: string): Promise<Contact | never> {
    try {
      return await this.prismaService.db.contact.delete({
        where: { clientId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Contact for client ${clientId} not found`);
      }
      throw error;
    }
  }
}
