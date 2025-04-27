import fs from 'fs';
import * as path from 'path'; // Correct the import for 'path'
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function importCompanies() {
  const companies: any[] = [];

  // Correct the path to use __dirname properly
  const filePath = path.join(__dirname, '../company.csv');

  // Read and parse the company CSV file
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      // Prepare data to be inserted into the database
      const company = {
        company_id: parseInt(row.company_id),
        country_id: parseInt(row.country_id),
        company_type: row.company_type,
        company_name: row.company_name,
        company_phone: row.company_phone,
        erp_supplier_name: row.erp_supplier_name,
        api_key: row.api_key,
        username: row.username,
        password: row.password,
        ims_company: row.ims_company === '1',
        domino_company: row.domino_company === '1',
        status: row.status,
        date_created: new Date(row.date_created),
      };
      companies.push(company);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');

      try {
        // Insert companies into the database
        for (const company of companies) {
          await prisma.company.create({
            data: company,
          });
        }
        console.log('Companies inserted successfully!');
      } catch (error) {
        console.error('Error inserting companies:', error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

importCompanies();
