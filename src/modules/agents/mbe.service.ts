import { Injectable } from '@nestjs/common';
import { mbe } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class MbeService {
  constructor(private prisma: PrismaService) {}

  async getAllMbe(): Promise<mbe[]> {
    return this.prisma.mbe.findMany({
      orderBy: {
        firstname: 'asc',
      },
    });
  }
}
