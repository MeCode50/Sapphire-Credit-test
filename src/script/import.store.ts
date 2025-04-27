import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { PrismaClient, ActiveStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function importStores() {
  const stores: any[] = [];
  let rowCount = 0;

  const filePath = path.join(__dirname, '../store.csv');

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      rowCount++;
      // Function to check if a date is valid
      function parseDate(dateString: string) {
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      }

      // Helper function to parse ActiveStatus enum
      function parseActiveStatus(value: string): ActiveStatus {
        return value?.toUpperCase() === 'ACTIVE'
          ? ActiveStatus.ACTIVE
          : ActiveStatus.INACTIVE;
      }

      // Prepare data for store creation
      const store = {
        store_id_int: parseInt(row.store_id) || null,
        store_name: row.store_name,
        erp_warehouse_name: row.erp_warehouse_name || null,
        address: row.address,
        city: row.city,
        state: row.state || null,
        region_data: row.region_data || null,
        partner: row.partner || null,
        store_email: row.store_email,
        store_dva: row.store_dva || null,
        paystack_customer_code: row.paystack_customer_code || null,
        paystack_account_name: row.paystack_account_name || null,
        paystack_account_number: row.paystack_account_number || null,
        paystack_bank_name: row.paystack_bank_name || null,
        paystack_account_id: row.paystack_account_id
          ? parseInt(row.paystack_account_id)
          : null,
        paystack_email: row.paystack_email,
        store_email2: row.store_email2 || '',
        store_email3: row.store_email3 || '',
        password: row.password || null,
        bundle: row.bundle || '0',
        bundle_used: row.bundle_used || '0',
        insurance_email: row.insurance_email || null,
        insurance_company: row.insurance_company || null,
        partnership: row.partnership || 'Retail',
        store_type: row.store_type || 'android',
        status: parseActiveStatus(row.status || 'ACTIVE'),
        devfin: parseActiveStatus(row.devfin || 'ACTIVE'),
        target: parseInt(row.target) || 0,
        target_reflex: parseInt(row.target_reflex) || 0,
        target_android: parseInt(row.target_android) || 0,
        target_ios: parseInt(row.target_ios) || 0,
        target_slam: parseInt(row.target_slam) || 0,
        target_sentiflex: parseInt(row.target_sentiflex) || 0,
        target_accessories: parseInt(row.target_accessories) || 0,
        target_tradein: parseInt(row.target_tradein) || 0,
        target_preowned: parseInt(row.target_preowned) || 0,
        target_new_device: parseInt(row.target_new_device) || 0,
        target_value: parseInt(row.target_value) || 0,
        store_open: parseDate(row.store_open || new Date().toISOString()),
        store_close: parseDate(row.store_close),
        latitude: row.latitude || '0',
        longitude: row.longitude || '0',
        mou1: row.mou1 || '',
        mou2: row.mou2 || '',
        account_number: row.account_number || '',
        account_name: row.account_name || '',
        bank_name: row.bank_name || '',
        bank_code: row.bank_code || '',
        account_number2: row.account_number2 || null,
        account_name2: row.account_name2 || null,
        bank_name2: row.bank_name2 || null,
        bank_code2: row.bank_code2 || '',
        phone_number: row.phone_number || null,
        samsung_campaign: row.samsung_campaign || 'no',
        credit_partner: parseActiveStatus(row.credit_partner || 'ACTIVE'),
        royal: parseActiveStatus(row.royal || 'ACTIVE'),
        discount_type: row.discount_type || '',
        discount_value: row.discount_value || '',
        created_at: parseDate(row.created_at || new Date().toISOString()),
        date_updated: parseDate(row.date_updated || new Date().toISOString()),
        updated_by: row.updated_by || '',
        company_id: row.company_id?.toString() || '0',
        region_id: row.region_id?.toString() || '0',
        cluster_id: row.cluster_id?.toString() || '0',
      };

      stores.push(store);
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Found ${rowCount} rows.`);
      try {
        for (const store of stores) {
          await prisma.store.create({
            data: store,
          });
        }
        console.log(`${stores.length} stores inserted successfully!`);
      } catch (error) {
        console.error('Error inserting stores:', error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

importStores();
