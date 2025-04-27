// src/run-migration.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StoreMigrationService } from './migration/store.migration.service';

async function bootstrap() {
  console.log('[DEBUG] Script started.');
  console.log('[DEBUG] Initializing NestJS application context...');
  const appContext = await NestFactory.createApplicationContext(AppModule);
  console.log('[DEBUG] Application context created successfully.');

  try {
    console.log('[DEBUG] Attempting to get StoreMigrationService instance...');
    const migrationService = appContext.get(StoreMigrationService);
    console.log(
      '[DEBUG] StoreMigrationService instance retrieved successfully.',
    );

    console.log('\n--- Starting Full Legacy Data Migration ---'); // Updated title

    // --- Run Store Migration ---
    // console.log('\nSTEP 1: Migrating Companies...');
    // await migrationService.migrateCompanies();

    // console.log('\nSTEP 2: Migrating Regions...');
    // await migrationService.migrateRegions();

    // console.log('\nSTEP 3: Migrating Clusters...');
    // await migrationService.migrateClusters();

    // **** ADDED STORE MIGRATION STEP ****
    // console.log('\nSTEP 4: Migrating Stores...');
    // await migrationService.migrateStores(); // Ensure this method exists and works

    // console.log('\n--- Store Migration Script Finished ---');
  } catch (error) {
    console.error('\n--- ERROR DURING MIGRATION EXECUTION ---');
    console.error(error); // Log the actual error
    process.exitCode = 1; // Indicate failure
  } finally {
    console.log('\n[DEBUG] Closing application context...');
    await appContext.close();
    console.log('[DEBUG] Application context closed.');
  }
}

bootstrap();
