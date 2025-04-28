// store.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to get all stores from the database with pagination
  async getAllStores(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: store[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    // Validate page and limit parameters
    if (page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }

    if (limit < 1) {
      throw new BadRequestException('Limit must be greater than 0');
    }

    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.store.findMany({
          skip,
          take: limit,
          orderBy: {
            store_name: 'asc',
          },
        }),
        this.prisma.store.count(),
      ]);

      const lastPage = Math.ceil(total / limit);

      // Check if requested page exists
      if (page > lastPage) {
        throw new BadRequestException(
          `Page ${page} does not exist. Last page is ${lastPage}`,
        );
      }

      return {
        data,
        total,
        page,
        lastPage,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch stores: ${error.message}`);
    }
  }
}
