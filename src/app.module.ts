// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreMigrationService } from './migration/store.migration.service'; // <--- 1. Import the service

@Module({
  imports: [
    // Add other modules like ConfigModule, PrismaModule if you use them
  ],
  controllers: [AppController],
  providers: [
    AppService,
    StoreMigrationService, // <--- 2. Add the service to the providers array
  ],
})
export class AppModule {}
