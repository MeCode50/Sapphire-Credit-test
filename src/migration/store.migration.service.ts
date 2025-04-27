// src/migration/store.migration.service.ts
import { Injectable } from '@nestjs/common';
import { ActiveStatus, PrismaClient } from '@prisma/client';
// Import ALL loader functions and interfaces needed
import {
  loadCompanyCSV,
  TransformedCompanyData,
  loadRegionCSV,
  TransformedRegionData,
  loadClusterCSV,
  TransformedClusterData,
  // loadAndTransformStoreCSV,
  // TransformedStoreData,
} from '../utils/csv.loader';

@Injectable()
export class StoreMigrationService {
  private prisma = new PrismaClient();
  // File paths (ensure they are correct and files exist)
  private readonly companyCsvPath = '/home/muna/Music/company.csv';
  private readonly regionCsvPath = '/home/muna/Music/region.csv';
  private readonly clusterCsvPath = '/home/muna/Music/cluster.csv';
  private readonly storeCsvPath = '/home/muna/Music/store.csv';

  // --- Method to Migrate Companies ---
  //   async migrateCompanies(): Promise<void> {
  //     console.log(
  //       `\n--- Starting Company Migration from ${this.companyCsvPath} ---`,
  //     );
  //     let processedCount = 0;
  //     let errorCount = 0;

  //     try {
  //       const companiesToMigrate = await loadCompanyCSV(this.companyCsvPath);
  //       console.log(
  //         `Loaded ${companiesToMigrate.length} transformed company records.`,
  //       );
  //       if (companiesToMigrate.length === 0) return;

  //       for (const companyData of companiesToMigrate) {
  //         try {
  //           await this.prisma.company.upsert({
  //             where: { company_id: companyData.company_id },
  //             update: {
  //               country_id: companyData.country_id,
  //               company_type: companyData.company_type,
  //               company_name: companyData.company_name,
  //               company_phone: companyData.company_phone,
  //               erp_supplier_name: companyData.erp_supplier_name,
  //               api_key: companyData.api_key,
  //               username: companyData.username,
  //               password: companyData.password,
  //               ims_company: companyData.ims_company as ActiveStatus,
  //               domino_company: companyData.domino_company as ActiveStatus,
  //               status: companyData.status as ActiveStatus,
  //             },
  //             create: {
  //               company_id: companyData.company_id,
  //               country_id: companyData.country_id,
  //               company_type: companyData.company_type,
  //               company_name: companyData.company_name,
  //               company_phone: companyData.company_phone,
  //               erp_supplier_name: companyData.erp_supplier_name,
  //               api_key: companyData.api_key,
  //               username: companyData.username,
  //               password: companyData.password,
  //               ims_company: companyData.ims_company as ActiveStatus,
  //               domino_company: companyData.domino_company as ActiveStatus,
  //               status: companyData.status as ActiveStatus,
  //               date_created: companyData.date_created,
  //             },
  //           });
  //           processedCount++;
  //         } catch (error: any) {
  //           errorCount++;
  //           console.error(
  //             `\n--- Error processing company ID: ${companyData.company_id} ---`,
  //           );
  //           if (error.code) console.error(`Prisma Error Code: ${error.code}`);
  //           if (error.meta?.target)
  //             console.error(`Prisma Error Target: ${error.meta.target}`);
  //           console.error(`Error Message: ${error.message}`);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(
  //         'A critical error occurred during the Company migration process:',
  //         error,
  //       );
  //       errorCount++;
  //     } finally {
  //       console.log(`--- Company Migration Summary ---`);
  //       console.log(`Processed (Created/Updated): ${processedCount}`);
  //       console.log(`Errors/Skipped: ${errorCount}`);
  //       console.log(`-------------------------------\n`);
  //     }
  //   }

  //   // --- Method to Migrate Regions ---
  //   async migrateRegions(): Promise<void> {
  //     console.log(
  //       `\n--- Starting Region Migration from ${this.regionCsvPath} ---`,
  //     );
  //     let processedCount = 0;
  //     let errorCount = 0;
  //     try {
  //       const regionsToMigrate = await loadRegionCSV(this.regionCsvPath);
  //       console.log(
  //         `Loaded ${regionsToMigrate.length} transformed region records.`,
  //       );
  //       if (regionsToMigrate.length === 0) return;
  //       for (const regionData of regionsToMigrate) {
  //         // date_created and updated_by guaranteed by loader
  //         try {
  //           await this.prisma.region.upsert({
  //             where: { region_id: regionData.region_id },
  //             update: {
  //               region_name: regionData.region_name,
  //               region_manager_id: regionData.region_manager_id,
  //               status: regionData.status,
  //               updated_by: regionData.updated_by,
  //             },
  //             create: { ...regionData },
  //           });
  //           processedCount++;
  //         } catch (error: any) {
  //           errorCount++;
  //           console.error(
  //             `\n--- Error processing region ID: ${regionData.region_id} ---`,
  //           );
  //           console.error(`Error Message: ${error.message}`);
  //         }
  //       }
  //     } catch (error) {
  //       // Catch errors during loading/setup
  //       console.error('Critical error during Region migration:', error);
  //       errorCount++;
  //     } finally {
  //       console.log(`--- Region Migration Summary ---`);
  //       console.log(`Processed (Created/Updated): ${processedCount}`);
  //       console.log(`Errors/Skipped: ${errorCount}`);
  //       console.log(`----------------------------\n`);
  //     }
  //   }

  //   // --- Method to Migrate Clusters ---
  //   async migrateClusters(): Promise<void> {
  //     console.log(
  //       `\n--- Starting Cluster Migration from ${this.clusterCsvPath} ---`,
  //     );
  //     let processedCount = 0;
  //     let errorCount = 0;
  //     try {
  //       const clustersToMigrate = await loadClusterCSV(this.clusterCsvPath);
  //       console.log(
  //         `Loaded ${clustersToMigrate.length} transformed cluster records.`,
  //       );
  //       if (clustersToMigrate.length === 0) return;
  //       for (const clusterData of clustersToMigrate) {
  //         // date_created and updated_by guaranteed by loader
  //         try {
  //           await this.prisma.cluster.upsert({
  //             where: { cluster_id: clusterData.cluster_id },
  //             update: {
  //               region_id: clusterData.region_id,
  //               cluster_name: clusterData.cluster_name,
  //               cluster_supervisor_id: clusterData.cluster_supervisor_id,
  //               cluster_supervisor_id_2: clusterData.cluster_supervisor_id_2,
  //               status: clusterData.status,
  //               updated_by: clusterData.updated_by,
  //             },
  //             create: { ...clusterData },
  //           });
  //           processedCount++;
  //         } catch (error: any) {
  //           errorCount++;
  //           console.error(
  //             `\n--- Error processing cluster ID: ${clusterData.cluster_id} ---`,
  //           );
  //           if (error.code === 'P2003') {
  //             // Foreign Key Constraint Failed
  //             console.error(
  //               `Foreign Key Constraint Failed: Does Region with ID ${clusterData.region_id} exist?`,
  //             );
  //           }
  //           console.error(`Error Message: ${error.message}`);
  //         }
  //       }
  //     } catch (error) {
  //       // Catch errors during loading/setup
  //       console.error('Critical error during Cluster migration:', error);
  //       errorCount++;
  //     } finally {
  //       console.log(`--- Cluster Migration Summary ---`);
  //       console.log(`Processed (Created/Updated): ${processedCount}`);
  //       console.log(`Errors/Skipped: ${errorCount}`);
  //       console.log(`-----------------------------\n`);
  //     }
  //   }

  // =============================================
  // IMPLEMENTED: Method to Migrate Stores
  // =============================================
  // =============================================
  // IMPLEMENTED: Method to Migrate Stores (Corrected)
  // =============================================
  // =============================================
  // IMPLEMENTED: Method to Migrate Stores (Corrected Again)
  // =============================================
  // async migrateStores(): Promise<void> {
  //   console.log(`\n--- Starting Store Migration from ${this.storeCsvPath} ---`);
  //   let processedCount = 0;
  //   let errorCount = 0;

  //   try {
  //     console.log('Attempting to load and transform stores...');
  //     const storesToMigrate = await loadAndTransformStoreCSV(this.storeCsvPath);
  //     console.log(
  //       `Loaded ${storesToMigrate.length} transformed store records.`,
  //     );

  //     if (storesToMigrate.length === 0) {
  //       console.log('No store records found to migrate.');
  //       return;
  //     }

  //     for (const storeData of storesToMigrate) {
  //       // Basic validation
  //       if (
  //         !storeData.company_id ||
  //         !storeData.region_id ||
  //         !storeData.cluster_id
  //       ) {
  //         console.warn(
  //           `Skipping store ${storeData.store_id}: Missing company_id, region_id, or cluster_id.`,
  //         );
  //         errorCount++;
  //         continue;
  //       }

  //       try {
  //         // Destructure relationship IDs and metadata fields
  //         const {
  //           company_id,
  //           region_id,
  //           cluster_id,
  //           store_id,
  //           created_at,
  //           updated_by,
  //           date_updated,
  //           ...restOfStoreData
  //         } = storeData;

  //         await this.prisma.store.upsert({
  //           where: { store_id: storeData.store_id },
  //           update: {
  //             ...restOfStoreData,
  //             store_open: storeData.store_open,
  //             store_close: storeData.store_close,
  //             date_updated: new Date(),
  //             updated_by: 'migration_script_update',
  //           },
  //           create: {
  //             // REQUIRED Fields from Schema (must be listed):
  //             store_id: storeData.store_id,
  //             store_name: storeData.store_name,
  //             address: storeData.address,
  //             city: storeData.city,
  //             store_email: storeData.store_email,
  //             paystack_email: storeData.paystack_email,
  //             store_email2: storeData.store_email2,
  //             store_email3: storeData.store_email3,
  //             target: storeData.target,
  //             target_android: storeData.target_android,
  //             target_ios: storeData.target_ios,
  //             target_slam: storeData.target_slam,
  //             target_sentiflex: storeData.target_sentiflex,
  //             target_accessories: storeData.target_accessories,
  //             target_tradein: storeData.target_tradein,
  //             target_preowned: storeData.target_preowned,
  //             target_new_device: storeData.target_new_device,
  //             target_value: storeData.target_value,
  //             store_open: storeData.store_open, // Loader ensures Date
  //             store_close: storeData.store_close, // Loader ensures Date
  //             mou1: storeData.mou1,
  //             mou2: storeData.mou2,
  //             account_number: storeData.account_number,
  //             account_name: storeData.account_name,
  //             bank_name: storeData.bank_name,
  //             bank_code: storeData.bank_code,
  //             bank_code2: storeData.bank_code2,
  //             discount_type: storeData.discount_type,
  //             discount_value: storeData.discount_value,
  //             created_at: storeData.created_at, // Loader ensures Date
  //             date_updated: storeData.date_updated, // Loader ensures Date
  //             updated_by: storeData.updated_by,

  //             // Fields with Defaults (good practice to include if available in CSV):
  //             bundle: storeData.bundle,
  //             bundle_used: storeData.bundle_used,
  //             partnership: storeData.partnership, // Loader ensures Enum
  //             store_type: storeData.store_type, // Loader ensures Enum
  //             status: storeData.status, // Loader ensures Enum
  //             devfin: storeData.devfin, // Loader ensures Enum
  //             target_reflex: storeData.target_reflex,
  //             latitude: storeData.latitude,
  //             longitude: storeData.longitude,
  //             samsung_campaign: storeData.samsung_campaign, // Loader ensures Enum
  //             credit_partner: storeData.credit_partner, // Loader ensures Enum
  //             royal: storeData.royal, // Loader ensures Enum

  //             // Optional Fields (include if available in CSV):
  //             erp_warehouse_name: storeData.erp_warehouse_name,
  //             state: storeData.state,
  //             region_data: storeData.region_data,
  //             partner: storeData.partner,
  //             store_dva: storeData.store_dva,
  //             paystack_customer_code: storeData.paystack_customer_code,
  //             paystack_account_name: storeData.paystack_account_name,
  //             paystack_account_number: storeData.paystack_account_number,
  //             paystack_bank_name: storeData.paystack_bank_name,
  //             paystack_account_id: storeData.paystack_account_id, // Loader ensures number | null
  //             password: storeData.password,
  //             insurance_email: storeData.insurance_email,
  //             insurance_company: storeData.insurance_company,
  //             account_number2: storeData.account_number2,
  //             account_name2: storeData.account_name2,
  //             bank_name2: storeData.bank_name2,
  //             phone_number: storeData.phone_number,

  //             // Connect Relationships:
  //             company: { connect: { company_id: storeData.company_id } },
  //             region: { connect: { region_id: storeData.region_id } },
  //             cluster: { connect: { cluster_id: storeData.cluster_id } },
  //           },
  //         });
  //         processedCount++;
  //       } catch (error: any) {
  //         errorCount++;
  //         console.error(
  //           `\n--- Error processing store ID: ${storeData.store_id} ---`,
  //         );
  //         if (error.code === 'P2003') {
  //           console.error(
  //             `Foreign Key Constraint Failed: Check if company_id: ${storeData.company_id}, region_id: ${storeData.region_id}, or cluster_id: ${storeData.cluster_id} exists`,
  //           );
  //         } else if (error.code === 'P2002') {
  //           console.error(
  //             `Unique constraint violation for store_id: ${storeData.store_id}`,
  //           );
  //         } else if (error.code === 'P2025') {
  //           console.error(
  //             `Record not found for update operation on store_id: ${storeData.store_id}`,
  //           );
  //         }
  //         console.error(`Error Message: ${error.message}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Critical error during Store migration process:', error);
  //     errorCount++;
  //   } finally {
  //     console.log(`--- Store Migration Summary ---`);
  //     console.log(`Processed (Created/Updated): ${processedCount}`);
  //     console.log(`Errors/Skipped: ${errorCount}`);
  //     console.log(`---------------------------\n`);
  //   }
  // }
}
