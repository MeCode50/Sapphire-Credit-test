import { Controller, Get } from '@nestjs/common';
import { StoreService } from './store.service';
import { store } from '@prisma/client';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAllStores(): Promise<store[]> {
    return this.storeService.getAllStores();
  }
}
