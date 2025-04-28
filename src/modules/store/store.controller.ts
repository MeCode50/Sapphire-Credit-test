import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from '@prisma/client';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAllStores(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ): Promise<{ data: Store[]; total: number; page: number; lastPage: number }> {
    return this.storeService.getAllStores(Number(page), Number(limit));
  }
}
