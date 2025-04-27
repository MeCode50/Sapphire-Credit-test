import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { PrismaClient, ActiveStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function importClusters() {
  const clusters: any[] = [];
  let rowCount = 0;

  const filePath = path.join(__dirname, '../cluster.csv');

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

      // Prepare data for cluster creation
      const cluster = {
        region_id: parseInt(row.region_id) || 0,
        cluster_name: row.cluster_name,
        cluster_supervisor_id: parseInt(row.cluster_supervisor_id) || 0,
        cluster_supervisor_id_2: row.cluster_supervisor_id_2
          ? parseInt(row.cluster_supervisor_id_2)
          : null,
        status: parseActiveStatus(row.status || 'ACTIVE'),
        date_created: parseDate(row.date_created || new Date().toISOString()),
        updated_by: row.updated_by || '',
      };

      clusters.push(cluster);
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Found ${rowCount} rows.`);
      try {
        for (const cluster of clusters) {
          await prisma.cluster.create({
            data: cluster,
          });
        }
        console.log(`${clusters.length} clusters inserted successfully!`);
      } catch (error) {
        console.error('Error inserting clusters:', error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
    });
}

importClusters();
