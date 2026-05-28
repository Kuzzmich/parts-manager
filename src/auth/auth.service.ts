import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ManagersService } from '../managers/managers.service';
import { Manager, Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private managersService: ManagersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ access_token: string } | never> {
    const existingManager = await this.managersService.findByEmail(email);

    if (existingManager) {
      throw new ConflictException('Manager already exists');
    }

    const passwordHash = await hash(password, 10);
    const manager: Manager = await this.prismaService.manager.create({
      data: { email, passwordHash, name } satisfies Prisma.ManagerCreateInput,
    });

    const payload = { sub: manager.id, email: manager.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | never> {
    const manager = await this.managersService.findByEmail(email);

    if (!manager) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, manager.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: manager.id, email: manager.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
