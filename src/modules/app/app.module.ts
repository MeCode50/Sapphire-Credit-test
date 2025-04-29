// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../../lib/prisma/prisma.module';
import { StoreModule } from '../store/stoe.module';
import { MbeModule } from '../agents/mbe.module';
import { CloudinaryModule } from '../../lib/cloudinary/cloudinary.module';
import { DatacultrModule } from '../../lib/dataculture/dc.module';
import { LockModule } from '../scheduleLock/lock.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StoreModule,
    MbeModule,
    CloudinaryModule,
    DatacultrModule,
    LockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
