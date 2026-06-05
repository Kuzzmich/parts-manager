import { Equipment } from '@prisma/client';

export interface FindEquipment {
  data: Equipment[];
  total: number;
  page: number;
  limit: number;
}
