import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LockService } from './lock.service';
import { LockController } from './lock.controller';

@Module({
  imports: [ConfigModule],
  providers: [LockService],
  exports: [LockService],
  controllers: [LockController],
})
export class LockModule {}
//
