// src/utils/store.csv.loader.ts
import * as fs from 'fs/promises';
import { parse } from 'csv-parse';
import {
  // Import ONLY the enums needed for stores
  ActiveStatus,
  store_partnership,
  store_store_type,
  store_samsung_campaign,
} from '@prisma/client';

// --- Helper Functions (Keep if only used for store, or move to a shared util file) ---
function safeParseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

function safeParseTime(timeString: string | null | undefined): Date | null {
  if (!timeString) return null;
  const date = new Date(`1970-01-01T${timeString}Z`); // Use UTC
  return isNaN(date.getTime()) ? null : date;
}

const getNullableNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};
// --- End Helper Functions ---

// --- Store Data Interface ---
export interface TransformedStoreData {
  store_id: string;
  company_id: string; // Keep FKs, needed by service
  region_id: string; // Keep FKs, needed by service
  cluster_id: string; // Keep FKs, needed by service
  store_name: string;
  erp_warehouse_name?: string | null;
  address: string;
  city: string;
  state?: string | null;
  region_data?: string | null; // Assuming this comes from CSV 'region' column
  partner?: string | null;
  store_email: string;
  store_dva?: string | null;
  paystack_customer_code?: string | null;
  paystack_account_name?: string | null;
  paystack_account_number?: string | null;
  paystack_bank_name?: string | null;
  paystack_account_id?: number | null;
  paystack_email: string;
  store_email2: string;
  store_email3: string;
  password?: string | null;
  bundle: string;
  bundle_used: string;
  insurance_email?: string | null;
  insurance_company?: string | null;
  partnership: store_partnership;
  store_type: store_store_type;
  status: ActiveStatus;
  devfin: ActiveStatus;
  target: number;
  target_reflex: number;
  target_android: number;
  target_ios: number;
  target_slam: number;
  target_sentiflex: number;
  target_accessories: number;
  target_tradein: number;
  target_preowned: number;
  target_new_device: number;
  target_value: number;
  store_open: Date; // Guaranteed Date by loader logic
  store_close: Date; // Guaranteed Date by loader logic
  latitude: string;
  longitude: string;
  mou1: string;
  mou2: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  account_number2?: string | null;
  account_name2?: string | null;
  bank_name2?: string | null;
  bank_code2: string;
  phone_number?: string | null;
  samsung_campaign: store_samsung_campaign;
  credit_partner: ActiveStatus;
  royal: ActiveStatus;
  discount_type: string;
  discount_value: string;
  created_at: Date;
  date_updated: Date;
  updated_by: string;
}

// --- Loader Function for Stores CSV ---
export async function loadAndTransformStoreCSV(
  filePath: string,
): Promise<TransformedStoreData[]> {
  console.log(`[Store Loader] Attempting to load Stores CSV from: ${filePath}`);
  let records: any[] = [];

  try {
    const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
    console.log(
      `[Store Loader] Read ${fileContent.length} characters from file.`,
    );

    await new Promise<void>((resolve, reject) => {
      parse(
        fileContent,
        {
          columns: true,
          skip_empty_lines: true,
          trim: true,
          cast: (value) => (value === 'NULL' || value === '' ? null : value),
        },
        (err, output) => {
          if (err) {
            console.error('[Store Loader] CSV Parse Error:', err);
            return reject(new Error(`Store CSV Parse Error: ${err.message}`));
          }
          records = output;
          console.log(
            `[Store Loader] Initial Parsing Complete. Parsed ${records.length} raw records from CSV.`,
          );
          resolve();
        },
      );
    });

    if (records.length === 0) {
      console.warn('[Store Loader] No records found after parsing CSV.');
      return [];
    }

    // Define defaults
    const defaultOpenTime = new Date('1970-01-01T09:00:00.000Z');
    const defaultCloseTime = new Date('1970-01-01T17:00:00.000Z');
    let transformationErrors = 0;

    // Use Promise.allSettled for robust mapping
    const settledResults = await Promise.allSettled(
      records.map(async (record, index) => {
        const rowNum = index + 2;
        try {
          // --- Validation & Transformation ---
          if (!record.store_id)
            throw new Error(`Missing store_id at row ${rowNum}`);
          if (!record.company_id)
            throw new Error(
              `Missing company_id for store ${record.store_id} at row ${rowNum}`,
            );
          if (!record.region_id)
            throw new Error(
              `Missing region_id for store ${record.store_id} at row ${rowNum}`,
            );
          if (!record.cluster_id)
            throw new Error(
              `Missing cluster_id for store ${record.store_id} at row ${rowNum}`,
            );

          // Helper accessors
          const getString = (key: string, defaultValue = ''): string =>
            record[key] ?? defaultValue;
          const getNullableString = (key: string): string | null =>
            record[key] ?? null;
          const getNumber = (key: string, defaultValue = 0): number => {
            const val = Number(record[key]);
            return isNaN(val) ? defaultValue : val;
          };

          // Parse Enums (CRITICAL - ensure these match CSV values)
          const status =
            record.status === '1' || record.status?.toUpperCase() === 'ACTIVE'
              ? ActiveStatus.ACTIVE
              : ActiveStatus.INACTIVE;
          const devfin =
            record.devfin === '1' || record.devfin?.toUpperCase() === 'ACTIVE'
              ? ActiveStatus.ACTIVE
              : ActiveStatus.INACTIVE;
          const partnership =
            record.partnership?.toUpperCase() === 'CORPORATE'
              ? store_partnership.Corporate
              : store_partnership.Retail;
          const store_type_raw = record.store_type?.toLowerCase();
          const store_type =
            store_type_raw === 'ios'
              ? store_store_type.ios
              : store_type_raw === 'all'
                ? store_store_type.all
                : store_store_type.android;
          const samsung_campaign =
            record.samsung_campaign?.toLowerCase() === 'yes'
              ? store_samsung_campaign.yes
              : store_samsung_campaign.no;
          const credit_partner =
            record.credit_partner === '1' ||
            record.credit_partner?.toUpperCase() === 'ACTIVE'
              ? ActiveStatus.ACTIVE
              : ActiveStatus.INACTIVE;
          const royal =
            record.royal === '1' || record.royal?.toUpperCase() === 'ACTIVE'
              ? ActiveStatus.ACTIVE
              : ActiveStatus.INACTIVE;

          // Parse Dates/Times (with defaults)
          const created_at = safeParseDate(record.created_at) ?? new Date();
          const date_updated = safeParseDate(record.date_updated) ?? created_at;
          const store_open =
            safeParseTime(record.store_open) ?? defaultOpenTime;
          const store_close =
            safeParseTime(record.store_close) ?? defaultCloseTime;

          // Log if defaults used (optional)
          if (!safeParseTime(record.store_open))
            console.warn(
              `[Store Loader] Store ID ${record.store_id}: Using default open time.`,
            );
          if (!safeParseTime(record.store_close))
            console.warn(
              `[Store Loader] Store ID ${record.store_id}: Using default close time.`,
            );

          // --- Return Transformed Object ---
          return {
            store_id: getString('store_id'),
            company_id: getString('company_id'), // Pass FKs through
            region_id: getString('region_id'), // Pass FKs through
            cluster_id: getString('cluster_id'), // Pass FKs through
            store_name: getString('store_name', 'Unknown Store'),
            erp_warehouse_name: getNullableString('erp_warehouse_name'),
            address: getString('address'),
            city: getString('city'),
            state: getNullableString('state'),
            region_data: getNullableString('region'),
            partner: getNullableString('partner'),
            store_email: getString('store_email'),
            store_dva: getNullableString('store_dva'),
            paystack_customer_code: getNullableString('paystack_customer_code'),
            paystack_account_name: getNullableString('paystack_account_name'),
            paystack_account_number: getNullableString(
              'paystack_account_number',
            ),
            paystack_bank_name: getNullableString('paystack_bank_name'),
            paystack_account_id: getNullableNumber(record.paystack_account_id),
            paystack_email: getString('paystack_email'),
            store_email2: getString('store_email2'),
            store_email3: getString('store_email3'),
            password: getNullableString('password'),
            bundle: getString('bundle', '0'),
            bundle_used: getString('bundle_used', '0'),
            insurance_email: getNullableString('insurance_email'),
            insurance_company: getNullableString('insurance_company'),
            partnership: partnership, // Assign parsed enum
            store_type: store_type, // Assign parsed enum
            status: status, // Assign parsed enum
            devfin: devfin, // Assign parsed enum
            target: getNumber('target'),
            target_reflex: getNumber('target_reflex'),
            target_android: getNumber('target_android'),
            target_ios: getNumber('target_ios'),
            target_slam: getNumber('target_slam'),
            target_sentiflex: getNumber('target_sentiflex'),
            target_accessories: getNumber('target_accessories'),
            target_tradein: getNumber('target_tradein'),
            target_preowned: getNumber('target_preowned'),
            target_new_device: getNumber('target_new_device'),
            target_value: getNumber('target_value'),
            store_open: store_open, // Assign guaranteed Date
            store_close: store_close, // Assign guaranteed Date
            latitude: getString('latitude', '0'),
            longitude: getString('longitude', '0'),
            mou1: getString('mou1'),
            mou2: getString('mou2'),
            account_number: getString('account_number'),
            account_name: getString('account_name'),
            bank_name: getString('bank_name'),
            bank_code: getString('bank_code'),
            account_number2: getNullableString('account_number2'),
            account_name2: getNullableString('account_name2'),
            bank_name2: getNullableString('bank_name2'),
            bank_code2: getString('bank_code2'),
            phone_number: getNullableString('phone_number'),
            samsung_campaign: samsung_campaign, // Assign parsed enum
            credit_partner: credit_partner, // Assign parsed enum
            royal: royal, // Assign parsed enum
            discount_type: getString('discount_type'),
            discount_value: getString('discount_value'),
            created_at: created_at, // Assign parsed Date
            date_updated: date_updated, // Assign parsed Date
            updated_by: getString('updated_by', 'migration_script'),
          } as TransformedStoreData;
        } catch (transformError: any) {
          console.error(
            `[Store Loader] Transformation Error at Row ${rowNum} (Store ID: ${record.store_id || 'UNKNOWN'}): ${transformError.message}`,
          );
          transformationErrors++;
          return null; // Indicate failure for this record
        }
      }),
    ); // End of map

    // Filter out failed transformations and log summary
    const successfullyTransformedData = settledResults
      .filter(
        (result) => result.status === 'fulfilled' && result.value !== null,
      )
      .map(
        (result) =>
          (result as PromiseFulfilledResult<TransformedStoreData>).value,
      );

    console.log(
      `[Store Loader] Transformation Summary: ${successfullyTransformedData.length} records transformed successfully, ${transformationErrors} records failed.`,
    );

    return successfullyTransformedData;
  } catch (error) {
    console.error(
      '[Store Loader] Critical Error during Store CSV loading or initial parsing:',
      error,
    );
    throw error;
  }
}
