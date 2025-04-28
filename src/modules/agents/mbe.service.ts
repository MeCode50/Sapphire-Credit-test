import { Injectable } from '@nestjs/common';
import { mbe } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class MbeService {
  constructor(private prisma: PrismaService) {}

  async getAllMbe(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: mbe[];
    total: number;
    page: number;
    lastPage: number;
  }> {
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

    return {
      data,
      total,
      page,
      lastPage,
    };
  }
}
