import { PartsService } from './parts.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('partService', () => {
  let service: PartsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PartsService,
        {
          provide: PrismaService,
          useValue: {
            db: {
              part: {
                findUnique: jest.fn(),
                softDelete: jest.fn(),
                // другие методы которые используешь
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<PartsService>(PartsService);
  });

  describe('findOne', () => {
    it('should return part if found', async () => {
      const mockpart = { id: '1', brand: 'Komatsu', model: 'PC200' };

      jest
        .spyOn(service['prismaService'].db.part, 'findUnique')
        .mockResolvedValue(mockpart as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockpart);
    });

    it('should throw NotFoundException if not found', async () => {
      jest
        .spyOn(service['prismaService'].db.part, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Not found',
        {
          code: 'P2025',
          clientVersion: '7.0.0',
        },
      );

      jest
        .spyOn(service['prismaService'].db.part, 'softDelete')
        .mockRejectedValue(prismaError);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
