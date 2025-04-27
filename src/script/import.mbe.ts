import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import {
  PrismaClient,
  PaymentFrequency,
  TrackingStatus,
  DeviceType,
  AccountLevel,
  EmploymentStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function importMBE() {
  const mbes: any[] = [];
  let rowCount = 0;

  const filePath = path.join(__dirname, '../mbe.csv');

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      rowCount++;

      // Function to parse boolean fields
      function parseBoolean(value: string): boolean {
        return value?.toLowerCase() === 'yes' || value === '1';
      }

      // Function to parse date fields
      function parseDate(dateString: string) {
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      }

      // Function to parse enums
      function parsePaymentFrequency(value: string): PaymentFrequency {
        if (!value) return PaymentFrequency.Monthly;
        const val = value.toLowerCase();
        if (val.includes('daily')) return PaymentFrequency.Daily;
        if (val.includes('weekly')) return PaymentFrequency.Weekly;
        return PaymentFrequency.Monthly;
      }

      function parseTrackingStatus(value: string): TrackingStatus {
        if (!value) return TrackingStatus.Absent;
        const val = value.toUpperCase();
        if (val.includes('GPS_OFF')) return TrackingStatus.GPS_Off;
        if (val.includes('IN_STORE')) return TrackingStatus.In_Store;
        if (val.includes('OUT_OF_STORE')) return TrackingStatus.Out_Of_Store;
        return TrackingStatus.Absent;
      }

      function parseDeviceType(value: string): DeviceType {
        if (!value) return DeviceType.ANDROID;
        const val = value.toLowerCase();
        if (val.includes('ios')) return DeviceType.IOS;
        return DeviceType.ANDROID;
      }

      function parseAccountLevel(value: string): AccountLevel {
        if (value?.toString() === '5') return AccountLevel.Five;
        return AccountLevel.One;
      }

      function parseEmploymentStatus(value: string): EmploymentStatus {
        return value?.toLowerCase() === 'not_employed'
          ? EmploymentStatus.Not_Employed
          : EmploymentStatus.Employed;
      }

      const mbe = {
        mbe_id_int: parseInt(row.mbe_id_int) || null,
        store_id: row.store_id,
        store_id2: row.store_id2 || null,
        store_id3: row.store_id3 || null,
        store_id4: row.store_id4 || null,
        store_id5: row.store_id5 || null,
        firstname: row.firstname,
        lastname: row.lastname,
        username: row.username,
        password: row.password,
        pt_status: parseBoolean(row.pt_status),
        tt_status: row.tt_status ? parseBoolean(row.tt_status) : false,
        trainer_id: parseInt(row.trainer_id),
        phone: row.phone,
        state: row.state || null,
        title: row.title,
        is_probation: parseBoolean(row.is_probation),
        vendor_id: row.vendor_id ? parseInt(row.vendor_id) : null,
        grade_name: row.grade_name || null,
        latitude: row.latitude || '0',
        longitude: row.longitude || '0',
        profile_picture: row.profile_picture,
        accessories_target: parseInt(row.accessories_target) || 0,
        new_device_target: parseInt(row.new_device_target) || 0,
        preowned_target: parseInt(row.preowned_target) || 0,
        sentiflex_target: parseInt(row.sentiflex_target) || 0,
        sentinel_target: parseInt(row.sentinel_target) || 0,
        trade_in_target: parseInt(row.trade_in_target) || 0,
        daily_hours: parseInt(row.daily_hours) || 8,
        days_per_week: parseInt(row.days_per_week) || 6,
        monthly_salary: parseInt(row.monthly_salary) || 25000,
        payment_frequency: parsePaymentFrequency(row.payment_frequency),
        bank_account_number: row.bank_account_number,
        bank_name: row.bank_name,
        bank_code: row.bank_code,
        total_commission: parseFloat(row.total_commission) || 0,
        commission_paid: parseFloat(row.commission_paid) || 0,
        commission_unpaid: parseFloat(row.commission_unpaid) || 0,
        tracking_status: parseTrackingStatus(row.tracking_status),
        device_type: parseDeviceType(row.device_type),
        status: parseBoolean(row.status),
        account_level: parseAccountLevel(row.account_level),
        guarantor_form: row.guarantor_form,
        guarantor_form2: row.guarantor_form2 || null,
        referral_id: row.referral_id ? parseInt(row.referral_id) : null,
        referral_channel: row.referral_channel || null,
        referral_paid: parseBoolean(row.referral_paid),
        employment_status: parseEmploymentStatus(row.employment_status),
        employment_date: row.employment_date
          ? parseDate(row.employment_date)
          : null,
        volume_target: row.volume_target || '0',
        value_target: row.value_target || '0',
        date_created: parseDate(row.date_created),
        updated_by: row.updated_by || '',
        updated_at: parseDate(row.updated_at),
        date_resigned: row.date_resigned
          ? parseDate(row.date_resigned)
          : new Date(),
        date_deactivated: row.date_deactivated
          ? parseDate(row.date_deactivated)
          : new Date(),
      };

      mbes.push(mbe);
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Found ${rowCount} rows.`);
      try {
        for (const mbe of mbes) {
          await prisma.mbe.create({
            data: mbe,
          });
        }
        console.log(`${mbes.length} MBEs inserted successfully!`);
      } catch (error) {
        console.error('Error inserting MBEs:', error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

importMBE();
