import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatacultrService } from './dc.service';

@Module({
  imports: [ConfigModule],
  providers: [DatacultrService],
  exports: [DatacultrService],
})
export class DatacultrModule {}
