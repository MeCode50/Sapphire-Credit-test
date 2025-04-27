// src/utils/csv.loader.ts
import * as fs from 'fs/promises';
import { parse } from 'csv-parse';
import {
  ActiveStatus,
  company_company_type,
  store_partnership,
  store_store_type,
  store_samsung_campaign,
} from '@prisma/client';

// Helper functions (keep safeParseDate, safeParseTime, getNullableNumber as they are)
function safeParseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

function safeParseTime(timeString: string | null | undefined): Date | null {
  // Parses time string like "HH:MM:SS" into a Date object on 1970-01-01
  if (!timeString) return null;
  // Try parsing with different potential formats if needed, but basic ISO time works here
  const date = new Date(`1970-01-01T${timeString}Z`); // Add Z for UTC consistency
  return isNaN(date.getTime()) ? null : date;
}

const getNullableNumber = (value: any): number | null => {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

// Company interface and loader
export interface TransformedCompanyData {
  company_id: string;
  country_id: number;
  company_type: company_company_type;
  company_name: string;
  company_phone: string;
  erp_supplier_name: string;
  api_key: string;
  username: string;
  password: string;
  ims_company: ActiveStatus;
  domino_company: ActiveStatus;
  status: ActiveStatus;
  date_created: Date;
}

export async function loadCompanyCSV(
  filePath: string,
): Promise<TransformedCompanyData[]> {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
  const records: any[] = await new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      (err, output) => {
        if (err) reject(new Error(`Company CSV Parse Error: ${err.message}`));
        else resolve(output);
      },
    );
  });
  return records.map((record) => ({
    company_id: record.company_id,
    country_id: Number(record.country_id),
    company_type: record.company_type as company_company_type,
    company_name: record.company_name,
    company_phone: record.company_phone,
    erp_supplier_name: record.erp_supplier_name,
    api_key: record.api_key,
    username: record.username,
    password: record.password,
    ims_company:
      record.ims_company === 'ACTIVE'
        ? ActiveStatus.ACTIVE
        : ActiveStatus.INACTIVE,
    domino_company:
      record.domino_company === 'ACTIVE'
        ? ActiveStatus.ACTIVE
        : ActiveStatus.INACTIVE,
    status:
      record.status === 'ACTIVE' ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE,
    date_created: new Date(record.date_created),
  }));
}

// Region interface and loader
export interface TransformedRegionData {
  region_id: string;
  region_name: string;
  region_manager_id: number;
  status: ActiveStatus;
  date_created: Date;
  updated_by: string;
}

export async function loadRegionCSV(
  filePath: string,
): Promise<TransformedRegionData[]> {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
  const records: any[] = await new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      (err, output) => {
        if (err) reject(new Error(`Region CSV Parse Error: ${err.message}`));
        else resolve(output);
      },
    );
  });
  return records.map((record) => ({
    region_id: record.region_id,
    region_name: record.region_name,
    region_manager_id: Number(record.region_manager_id),
    status:
      record.status === 'ACTIVE' ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE,
    date_created: new Date(record.date_created),
    updated_by: record.updated_by,
  }));
}

// Cluster interface and loader
export interface TransformedClusterData {
  cluster_id: string;
  region_id: number;
  cluster_name: string;
  cluster_supervisor_id: number;
  cluster_supervisor_id_2: number | null;
  status: ActiveStatus;
  date_created: Date;
  updated_by: string;
}

export async function loadClusterCSV(
  filePath: string,
): Promise<TransformedClusterData[]> {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
  const records: any[] = await new Promise((resolve, reject) => {
    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      (err, output) => {
        if (err) reject(new Error(`Cluster CSV Parse Error: ${err.message}`));
        else resolve(output);
      },
    );
  });
  return records.map((record) => ({
    cluster_id: record.cluster_id,
    region_id: Number(record.region_id),
    cluster_name: record.cluster_name,
    cluster_supervisor_id: Number(record.cluster_supervisor_id),
    cluster_supervisor_id_2: record.cluster_supervisor_id_2
      ? Number(record.cluster_supervisor_id_2)
      : null,
    status:
      record.status === 'ACTIVE' ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE,
    date_created: new Date(record.date_created),
    updated_by: record.updated_by,
  }));
}

// Store interface and loader
// export interface TransformedStoreData {
//   store_id: string;
//   company_id: string;
//   region_id: string;
//   cluster_id: string;
//   store_name: string;
//   erp_warehouse_name?: string | null;
//   address: string;
//   city: string;
//   state?: string | null;
//   region_data?: string | null;
//   partner?: string | null;
//   store_email: string;
//   store_dva?: string | null;
//   paystack_customer_code?: string | null;
//   paystack_account_name?: string | null;
//   paystack_account_number?: string | null;
//   paystack_bank_name?: string | null;
//   paystack_account_id?: number | null;
//   paystack_email: string;
//   store_email2: string;
//   store_email3: string;
//   password?: string | null;
//   bundle: string;
//   bundle_used: string;
//   insurance_email?: string | null;
//   insurance_company?: string | null;
//   partnership: store_partnership;
//   store_type: store_store_type;
//   status: ActiveStatus;
//   devfin: ActiveStatus;
//   target: number;
//   target_reflex: number;
//   target_android: number;
//   target_ios: number;
//   target_slam: number;
//   target_sentiflex: number;
//   target_accessories: number;
//   target_tradein: number;
//   target_preowned: number;
//   target_new_device: number;
//   target_value: number;
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
//   account_number2?: string | null;
//   account_name2?: string | null;
//   bank_name2?: string | null;
//   bank_code2: string;
//   phone_number?: string | null;
//   samsung_campaign: store_samsung_campaign;
//   credit_partner: ActiveStatus;
//   royal: ActiveStatus;
//   discount_type: string;
//   discount_value: string;
//   created_at: Date;
//   date_updated: Date;
//   updated_by: string;
// }

// // Loader Function for Stores CSV
// export async function loadAndTransformStoreCSV(
//   filePath: string,
// ): Promise<TransformedStoreData[]> {
//   console.log(`Attempting to load Stores CSV from: ${filePath}`);
//   try {
//     const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });

//     const records: any[] = await new Promise((resolve, reject) => {
//       parse(
//         fileContent,
//         {
//           columns: true,
//           skip_empty_lines: true,
//           trim: true,
//           cast: (value, context) => {
//             return value === 'NULL' || value === '' ? null : value;
//           },
//         },
//         (err, output) =>
//           err
//             ? reject(new Error(`Store CSV Parse Error: ${err.message}`))
//             : resolve(output),
//       );
//     });

//     console.log(
//       `Parsed ${records.length} store records from CSV. Starting transformation...`,
//     );

//     const defaultOpenTime = new Date('1970-01-01T09:00:00.000Z');
//     const defaultCloseTime = new Date('1970-01-01T17:00:00.000Z');

//     const transformedData: TransformedStoreData[] = records.map(
//       (record, index) => {
//         const rowNum = index + 2;

//         if (!record.store_id)
//           throw new Error(`Missing store_id in stores.csv at row ${rowNum}`);

//         const getString = (key: string, defaultValue = ''): string =>
//           record[key] ?? defaultValue;
//         const getNullableString = (key: string): string | null =>
//           record[key] ?? null;
//         const getNumber = (key: string, defaultValue = 0): number => {
//           const val = Number(record[key]);
//           return isNaN(val) ? defaultValue : val;
//         };

//         const created_at = safeParseDate(record.created_at) ?? new Date();
//         const date_updated = safeParseDate(record.date_updated) ?? created_at;

//         const store_open_parsed = safeParseTime(record.store_open);
//         const store_close_parsed = safeParseTime(record.store_close);

//         const store_open = store_open_parsed ?? defaultOpenTime;
//         const store_close = store_close_parsed ?? defaultCloseTime;

//         if (!store_open_parsed) {
//           console.warn(
//             `Store ID ${record.store_id} (Row ${rowNum}): Using default open time (${defaultOpenTime.toISOString()}) as CSV value "${record.store_open}" was invalid or missing.`,
//           );
//         }
//         if (!store_close_parsed) {
//           console.warn(
//             `Store ID ${record.store_id} (Row ${rowNum}): Using default close time (${defaultCloseTime.toISOString()}) as CSV value "${record.store_close}" was invalid or missing.`,
//           );
//         }

//         return {
//           store_id: getString('store_id'),
//           company_id: getString('company_id'),
//           region_id: getString('region_id'),
//           cluster_id: getString('cluster_id'),
//           store_name: getString('store_name', 'Unknown Store'),
//           erp_warehouse_name: getNullableString('erp_warehouse_name'),
//           address: getString('address'),
//           city: getString('city'),
//           state: getNullableString('state'),
//           region_data: getNullableString('region'),
//           partner: getNullableString('partner'),
//           store_email: getString('store_email'),
//           store_dva: getNullableString('store_dva'),
//           paystack_customer_code: getNullableString('paystack_customer_code'),
//           paystack_account_name: getNullableString('paystack_account_name'),
//           paystack_account_number: getNullableString('paystack_account_number'),
//           paystack_bank_name: getNullableString('paystack_bank_name'),
//           paystack_account_id: getNullableNumber(record.paystack_account_id),
//           paystack_email: getString('paystack_email'),
//           store_email2: getString('store_email2'),
//           store_email3: getString('store_email3'),
//           password: getNullableString('password'),
//           bundle: getString('bundle', '0'),
//           bundle_used: getString('bundle_used', '0'),
//           insurance_email: getNullableString('insurance_email'),
//           insurance_company: getNullableString('insurance_company'),
//           partnership:
//             record.partnership === 'Corporate'
//               ? store_partnership.Corporate
//               : store_partnership.Retail,
//           store_type:
//             record.store_type === 'ios'
//               ? store_store_type.ios
//               : record.store_type === 'all'
//                 ? store_store_type.all
//                 : store_store_type.android,
//           status:
//             record.status === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE,
//           devfin:
//             record.devfin === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE,
//           target: getNumber('target'),
//           target_reflex: getNumber('target_reflex'),
//           target_android: getNumber('target_android'),
//           target_ios: getNumber('target_ios'),
//           target_slam: getNumber('target_slam'),
//           target_sentiflex: getNumber('target_sentiflex'),
//           target_accessories: getNumber('target_accessories'),
//           target_tradein: getNumber('target_tradein'),
//           target_preowned: getNumber('target_preowned'),
//           target_new_device: getNumber('target_new_device'),
//           target_value: getNumber('target_value'),
//           store_open: store_open,
//           store_close: store_close,
//           latitude: getString('latitude', '0'),
//           longitude: getString('longitude', '0'),
//           mou1: getString('mou1'),
//           mou2: getString('mou2'),
//           account_number: getString('account_number'),
//           account_name: getString('account_name'),
//           bank_name: getString('bank_name'),
//           bank_code: getString('bank_code'),
//           account_number2: getNullableString('account_number2'),
//           account_name2: getNullableString('account_name2'),
//           bank_name2: getNullableString('bank_name2'),
//           bank_code2: getString('bank_code2'),
//           phone_number: getNullableString('phone_number'),
//           samsung_campaign:
//             record.samsung_campaign === 'yes'
//               ? store_samsung_campaign.yes
//               : store_samsung_campaign.no,
//           credit_partner:
//             record.credit_partner === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE,
//           royal:
//             record.royal === 'ACTIVE'
//               ? ActiveStatus.ACTIVE
//               : ActiveStatus.INACTIVE,
//           discount_type: getString('discount_type'),
//           discount_value: getString('discount_value'),
//           created_at: created_at,
//           date_updated: date_updated,
//           updated_by: getString('updated_by', 'migration_script'),
//         };
//       },
//     );

//     console.log('Store transformation complete.');
//     return transformedData;
//   } catch (error) {
//     console.error('Error during Store CSV loading or transformation:', error);
//     throw error;
//   }
// }
