import { Controller, Get } from '@nestjs/common';
import { MbeService } from './mbe.service';
import { mbe } from '@prisma/client';

@Controller('mbe')
export class MbeController {
  constructor(private readonly mbeService: MbeService) {}

  @Get()
  async getAllMbe(): Promise<mbe[]> {
    return this.mbeService.getAllMbe();
  }
}
