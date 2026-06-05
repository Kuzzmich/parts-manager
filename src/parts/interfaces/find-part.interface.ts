import { Part } from '@prisma/client';

export interface FindPart {
  data: Part[];
  total: number;
  page: number;
  limit: number;
}
