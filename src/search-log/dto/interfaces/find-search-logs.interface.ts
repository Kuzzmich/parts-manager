import { SearchLog } from '@prisma/client';

export interface FindSearchLogs {
  data: SearchLog[];
  total: number;
  page: number;
  limit: number;
}
