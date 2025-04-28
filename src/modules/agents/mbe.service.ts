import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Mbe } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class MbeService {
  constructor(private prisma: PrismaService) {}

  async getAllMbe(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Mbe[];
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

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.mbe.findMany({
        skip,
        take: limit,
        orderBy: {
          firstname: 'asc',
        },
      }),
      this.prisma.mbe.count(),
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
  }
}
