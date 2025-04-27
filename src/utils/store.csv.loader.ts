// // src/utils/store.csv.loader.ts
// import * as fs from 'fs/promises';
// import { parse } from 'csv-parse';
// import {
//   ActiveStatus,
//   store_partnership,
//   store_store_type,
//   store_samsung_campaign,
// } from '@prisma/client';

// // --- Helper Functions (Keep as they are) ---
// function safeParseDate(dateString: string | null | undefined): Date | null {
//   if (!dateString) return null;
//   const date = new Date(dateString);
//   return isNaN(date.getTime()) ? null : date;
// }

// function safeParseTime(timeString: string | null | undefined): Date | null {
//   if (!timeString) return null;
//   const date = new Date(`1970-01-01T${timeString}Z`);
//   return isNaN(date.getTime()) ? null : date;
// }

// const getNullableNumber = (value: any): number | null => {
//   if (value === null || value === undefined || value === '' || value === 'NULL')
//     return null;
//   const num = Number(value);
//   return isNaN(num) ? null : num;
// };

// // --- THIS IS THE MAIN FUNCTION TO PARSE REQUIRED INTs ---
// const getRequiredNumber = (
//   value: any,
//   fieldName: string,
//   recordId?: any,
// ): number => {
//   // Use getNullableNumber first to handle various empty/null formats
//   const num = getNullableNumber(value);
//   if (num === null) {
//     // Throw specific error if a *required* number field is missing/invalid
//     throw new Error(
//       `Invalid or missing required number for field '${fieldName}' (value: '${value}') in record ID '${recordId ?? 'UNKNOWN'}'`,
//     );
//   }
//   return num;
// };
// // --- End Helper Functions ---

// // --- Store Data Interface (UPDATED for Int IDs) ---
// export interface TransformedStoreData {
//   store_id: number; // <<< CHANGED TO number
//   company_id: number; // <<< CHANGED TO number
//   region_id: number; // <<< CHANGED TO number
//   cluster_id: number; // <<< CHANGED TO number
//   // --- Other fields remain the same type ---
//   store_name: string;
//   erp_warehouse_name: string | null;
//   address: string;
//   city: string;
//   state: string | null;
//   region_data: string | null;
//   partner: string | null;
//   store_email: string;
//   store_dva: string | null;
//   paystack_customer_code: string | null;
//   paystack_account_name: string | null;
//   paystack_account_number: string | null;
//   paystack_bank_name: string | null;
//   paystack_account_id: number | null; // Still nullable Int
//   paystack_email: string;
//   store_email2: string;
//   store_email3: string;
//   password: string | null;
//   bundle: string;
//   bundle_used: string;
//   insurance_email: string | null;
//   insurance_company: string | null;
//   partnership: store_partnership;
//   store_type: store_store_type;
//   status: ActiveStatus;
//   devfin: ActiveStatus;
//   target: number; // Already number
//   target_reflex: number; // Already number
//   target_android: number; // Already number
//   target_ios: number; // Already number
//   target_slam: number; // Already number
//   target_sentiflex: number; // Already number
//   target_accessories: number; // Already number
//   target_tradein: number; // Already number
//   target_preowned: number; // Already number
//   target_new_device: number; // Already number
//   target_value: number; // Already number
//   store_open: Date;
//   store_close: Date;
//   latitude: string;
//   longitude: string;
//   mou1: string;
//   mou2: string;
//   account_number: string;
//   account_name: string;
//   bank_name: string;
//   bank_code: string;
//   account_number2: string | null;
//   account_name2: string | null;
//   bank_name2: string | null;
//   bank_code2: string;
//   phone_number: string | null;
//   samsung_campaign: store_samsung_campaign;
//   credit_partner: ActiveStatus;
//   royal: ActiveStatus;
//   discount_type: string;
//   discount_value: string;
//   created_at: Date;
//   date_updated: Date;
//   updated_by: string;
// }

// // --- Loader Function for Stores CSV (UPDATED for Int IDs) ---
// export async function loadAndTransformStoreCSV(
//   filePath: string,
// ): Promise<TransformedStoreData[]> {
//   console.log(`[Store Loader] Attempting to load Stores CSV from: ${filePath}`);
//   let records: any[] = [];

//   try {
//     // ... (File reading and parsing logic remains the same) ...
//     const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
//     console.log(
//       `[Store Loader] Read ${fileContent.length} characters from file.`,
//     );
//     await new Promise<void>((resolve, reject) => {
//       /* ... parse logic ... */
//     });
//     if (records.length === 0) {
//       return [];
//     }

//     // Define defaults
//     const defaultOpenTime = new Date('1970-01-01T09:00:00.000Z');
//     const defaultCloseTime = new Date('1970-01-01T17:00:00.000Z');
//     let transformationErrors = 0;

//     // Process records
//     const transformationPromises = records.map(
//       async (record, index): Promise<TransformedStoreData | null> => {
//         const rowNum = index + 2;
//         const tentativeStoreId = record?.store_id ?? 'UNKNOWN_AT_ROW_' + rowNum; // Get ID for logging early
//         try {
//           // --- PARSE REQUIRED IDs AS NUMBERS ---
//           const store_id = getRequiredNumber(
//             record.store_id,
//             'store_id',
//             tentativeStoreId,
//           );
//           const company_id = getRequiredNumber(
//             record.company_id,
//             'company_id',
//             store_id,
//           );
//           const region_id = getRequiredNumber(
//             record.region_id,
//             'region_id',
//             store_id,
//           );
//           const cluster_id = getRequiredNumber(
//             record.cluster_id,
//             'cluster_id',
//             store_id,
//           );
//           // --- END ID PARSING ---

//           // Helper accessors (Use these AFTER IDs are parsed)
//           const getString = (key: string, defaultValue = ''): string =>
//             record[key] ?? defaultValue;
//           const getNullableString = (key: string): string | null =>
//             record[key] ?? null;
//           // Use getRequiredNumber for non-nullable Ints, getNullableNumber for Int?
//           const target = getRequiredNumber(record.target, 'target', store_id);
//           const paystack_account_id = getNullableNumber(
//             record.paystack_account_id,
//           );
//           // ... parse other numbers similarly ...
//           const target_reflex = getRequiredNumber(
//             record.target_reflex,
//             'target_reflex',
//             store_id,
//           );
//           const target_android = getRequiredNumber(
//             record.target_android,
//             'target_android',
//             store_id,
//           );
//           const target_ios = getRequiredNumber(
//             record.target_ios,
//             'target_ios',
//             store_id,
//           );
//           const target_slam = getRequiredNumber(
//             record.target_slam,
//             'target_slam',
//             store_id,
//           );
//           const target_sentiflex = getRequiredNumber(
//             record.target_sentiflex,
//             'target_sentiflex',
//             store_id,
//           );
//           const target_accessories = getRequiredNumber(
//             record.target_accessories,
//             'target_accessories',
//             store_id,
//           );
//           const target_tradein = getRequiredNumber(
//             record.target_tradein,
//             'target_tradein',
//             store_id,
//           );
//           const target_preowned = getRequiredNumber(
//             record.target_preowned,
//             'target_preowned',
//             store_id,
//           );
//           const target_new_device = getRequiredNumber(
//             record.target_new_device,
//             'target_new_device',
//             store_id,
//           );
//           const target_value = getRequiredNumber(
//             record.target_value,
//             'target_value',
//             store_id,
//           );

//           // Parse Enums (Ensure logic matches CSV values like '1'/'0' or 'ACTIVE'/'INACTIVE')
//           const status =
//             record.status === '1' || record.status?.toUpperCase() === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE;
//           const devfin =
//             record.devfin === '1' || record.devfin?.toUpperCase() === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE; // Check '1' vs '0' in CSV
//           const partnership =
//             record.partnership?.toUpperCase() === 'CORPORATE'
//               ? store_partnership.Corporate
//               : store_partnership.Retail;
//           const store_type_raw = record.store_type?.toLowerCase();
//           const store_type =
//             store_type_raw === 'ios'
//               ? store_store_type.ios
//               : store_type_raw === 'all'
//                 ? store_store_type.all
//                 : store_store_type.android;
//           const samsung_campaign =
//             record.samsung_campaign?.toLowerCase() === 'yes'
//               ? store_samsung_campaign.yes
//               : store_samsung_campaign.no;
//           const credit_partner =
//             record.credit_partner === '1' ||
//             record.credit_partner?.toUpperCase() === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE; // Check '1' vs '0' in CSV
//           const royal =
//             record.royal === '1' || record.royal?.toUpperCase() === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE; // Check '1' vs '0' in CSV

//           // Parse Dates/Times
//           const created_at = safeParseDate(record.created_at) ?? new Date();
//           const date_updated = safeParseDate(record.date_updated) ?? created_at;
//           const store_open =
//             safeParseTime(record.store_open) ?? defaultOpenTime;
//           const store_close =
//             safeParseTime(record.store_close) ?? defaultCloseTime;

//           // --- Return Transformed Object with Correct Types ---
//           return {
//             store_id: store_id, // number
//             company_id: company_id, // number
//             region_id: region_id, // number
//             cluster_id: cluster_id, // number
//             store_name: getString('store_name', 'Unknown Store'),
//             erp_warehouse_name: getNullableString('erp_warehouse_name'),
//             address: getString('address'),
//             city: getString('city'),
//             state: getNullableString('state'),
//             region_data: getNullableString('region'),
//             partner: getNullableString('partner'),
//             store_email: getString('store_email'),
//             store_dva: getNullableString('store_dva'),
//             paystack_customer_code: getNullableString('paystack_customer_code'),
//             paystack_account_name: getNullableString('paystack_account_name'),
//             paystack_account_number: getNullableString(
//               'paystack_account_number',
//             ),
//             paystack_bank_name: getNullableString('paystack_bank_name'),
//             paystack_account_id: paystack_account_id, // number | null
//             paystack_email: getString('paystack_email'),
//             store_email2: getString('store_email2'),
//             store_email3: getString('store_email3'),
//             password: getNullableString('password'),
//             bundle: getString('bundle', '0'),
//             bundle_used: getString('bundle_used', '0'),
//             insurance_email: getNullableString('insurance_email'),
//             insurance_company: getNullableString('insurance_company'),
//             partnership: partnership, // Enum
//             store_type: store_type, // Enum
//             status: status, // Enum
//             devfin: devfin, // Enum
//             target: target, // number
//             target_reflex: target_reflex, // number
//             target_android: target_android, // number
//             target_ios: target_ios, // number
//             target_slam: target_slam, // number
//             target_sentiflex: target_sentiflex, // number
//             target_accessories: target_accessories, // number
//             target_tradein: target_tradein, // number
//             target_preowned: target_preowned, // number
//             target_new_device: target_new_device, // number
//             target_value: target_value, // number
//             store_open: store_open, // Date
//             store_close: store_close, // Date
//             latitude: getString('latitude', '0'),
//             longitude: getString('longitude', '0'),
//             mou1: getString('mou1'),
//             mou2: getString('mou2'),
//             account_number: getString('account_number'),
//             account_name: getString('account_name'),
//             bank_name: getString('bank_name'),
//             bank_code: getString('bank_code'),
//             account_number2: getNullableString('account_number2'),
//             account_name2: getNullableString('account_name2'),
//             bank_name2: getNullableString('bank_name2'),
//             bank_code2: getString('bank_code2'),
//             phone_number: getNullableString('phone_number'),
//             samsung_campaign: samsung_campaign, // Enum
//             credit_partner: credit_partner, // Enum
//             royal: royal, // Enum
//             discount_type: getString('discount_type'),
//             discount_value: getString('discount_value'),
//             created_at: created_at, // Date
//             date_updated: date_updated, // Date
//             updated_by: getString('updated_by', 'migration_script'),
//           };
//         } catch (transformError: any) {
//           console.error(
//             `[Store Loader] Transformation Error at Row ${rowNum} (Store ID: ${tentativeStoreId}): ${transformError.message}`,
//           );
//           transformationErrors++;
//           return null; // Failed record transformation
//         }
//       },
//     ); // End of records.map

//     // ... (Filtering and returning successfullyTransformedData remains the same) ...
//     const settledResults = await Promise.allSettled(transformationPromises);
//     const successfullyTransformedData = settledResults
//       .filter(
//         (result): result is PromiseFulfilledResult<TransformedStoreData> =>
//           result.status === 'fulfilled' && result.value !== null,
//       )
//       .map((result) => result.value);
//     console.log(
//       `[Store Loader] Transformation Summary: ${successfullyTransformedData.length} records transformed successfully, ${transformationErrors} records failed.`,
//     );
//     return successfullyTransformedData;
//   } catch (error) {
//     console.error(
//       '[Store Loader] Critical Error during Store CSV loading or initial parsing:',
//       error,
//     );
//     throw error;
//   }
// }
