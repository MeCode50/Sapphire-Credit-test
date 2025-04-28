// mbe.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { MbeService } from './mbe.service';
import { mbe } from '@prisma/client';

@Controller('mbe')
export class MbeController {
  constructor(private readonly mbeService: MbeService) {}

  @Get()
  async getAllMbe(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ): Promise<{ data: mbe[]; total: number; page: number; lastPage: number }> {
    return this.mbeService.getAllMbe(Number(page), Number(limit));
  }
}
