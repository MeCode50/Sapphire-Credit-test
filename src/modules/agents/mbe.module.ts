import { Module } from '@nestjs/common';
import { MbeController } from './mbe.controller';
import { MbeService } from './mbe.service';

@Module({
  controllers: [MbeController],
  providers: [MbeService],
  exports: [MbeService],
})
export class MbeModule {}
