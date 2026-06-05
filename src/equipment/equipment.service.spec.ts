import { EquipmentService } from './equipment.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('EquipmentService', () => {
  let service: EquipmentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EquipmentService,
        {
          provide: PrismaService,
          useValue: {
            db: {
              equipment: {
                findUnique: jest.fn(),
                // другие методы которые используешь
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<EquipmentService>(EquipmentService);
  });

  describe('findOne', () => {
    it('should return equipment if found', async () => {
      const mockEquipment = { id: '1', brand: 'Komatsu', model: 'PC200' };

      jest
        .spyOn(service['prismaService'].db.equipment, 'findUnique')
        .mockResolvedValue(mockEquipment as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockEquipment);
    });

    it('should throw NotFoundException if not found', async () => {
      jest
        .spyOn(service['prismaService'].db.equipment, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});
