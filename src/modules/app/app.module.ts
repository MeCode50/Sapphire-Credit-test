// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../../lib/prisma/prisma.module';
import { StoreModule } from '../store/stoe.module';
import { MbeModule } from '../agents/mbe.module';
import { LockModule } from 'src/lib/scheduleLock/lock.module';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StoreModule,
    MbeModule,
    LockModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
