import { NestFactory } from '@nestjs/core';
// Remove StoreMigrationService import since it doesn't exist in the module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrator = app.get('StoreMigrationService');
  await migrator.migrateCompanies();
  await migrator.runMigration();
  await app.close();
}
bootstrap();
