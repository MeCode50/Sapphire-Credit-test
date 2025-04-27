// // src/run-store-migration.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// // Import the NEW JSON-based service
// import { StoreJsonMigrationService } from './migration/store-json.migration.service';

// async function runStoreMigration() {
//   console.log('Initializing application context for JSON store migration...');
//   const app = await NestFactory.createApplicationContext(AppModule);
//   console.log('Application context initialized.');

//   // Get the JSON-based store migration service instance
//   const storeMigrationService = app.get(StoreJsonMigrationService);
//   console.log('StoreJsonMigrationService obtained.');

//   console.log('--- Starting Store Migration Script (JSON Approach) ---');
//   try {
//     // Execute the JSON migration method
//     await storeMigrationService.migrateStoresFromJson(); // Call the new method
//   } catch (error) {
//     console.error(
//       '!!! Store migration script (JSON Approach) encountered a fatal error:',
//       error,
//     );
//     process.exitCode = 1;
//   } finally {
//     console.log('--- Store Migration Script (JSON Approach) Finished ---');
//     await app.close();
//     console.log('Application context closed.');
//   }
// }

// runStoreMigration();
