import { Client } from '@prisma/client';

export interface FindClients {
  data: Client[];
  total: number;
  page: number;
  limit: number;
}