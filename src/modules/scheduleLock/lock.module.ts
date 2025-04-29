import { Module } from '@nestjs/common';
import { LockController } from './lock.controller';
import { LockService } from './lock.service';
import { DatacultrModule } from '../../lib/dataculture/dc.module';

@Module({
  imports: [DatacultrModule],
  controllers: [LockController],
  providers: [LockService],
})
export class LockModule {}
