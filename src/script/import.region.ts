import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { PrismaClient, ActiveStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function importRegions() {
  const regions: any[] = [];
  let rowCount = 0;

  const filePath = path.join(__dirname, '../region.csv');

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

      // Prepare data for region creation
      const region = {
        region_name: row.region_name,
        region_manager_id: parseInt(row.region_manager_id) || 0,
        status: parseActiveStatus(row.status || 'ACTIVE'),
        date_created: parseDate(row.date_created || new Date().toISOString()),
        updated_by: row.updated_by || '',
      };

      regions.push(region);
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Found ${rowCount} rows.`);
      try {
        for (const region of regions) {
          await prisma.region.create({
            data: region,
          });
        }
        console.log(`${regions.length} regions inserted successfully!`);
      } catch (error) {
        console.error('Error inserting regions:', error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

importRegions();
