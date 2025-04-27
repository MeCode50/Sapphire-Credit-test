// store.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to get all stores from the database
  async getAllStores(): Promise<store[]> {
    try {
      const stores = await this.prisma.store.findMany(); // Fetch all stores
      return stores;
    } catch (error) {
      throw new Error('Error fetching stores: ' + error.message);
    }
  }
}
