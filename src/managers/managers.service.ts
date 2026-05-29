import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Manager } from '@prisma/client';

@Injectable()
export class ManagersService {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Manager | null> {
    return this.prismaService.db.manager.findUnique({
      where: { email },
    });
  }
}
