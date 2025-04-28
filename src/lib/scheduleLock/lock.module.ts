import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatacultrConfigService } from './lock.service';

@Module({
  imports: [ConfigModule],
  providers: [DatacultrConfigService],
  exports: [DatacultrConfigService],
})
export class DatacultrConfigModule {}
