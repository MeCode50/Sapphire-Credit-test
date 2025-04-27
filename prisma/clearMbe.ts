import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearMbeData() {
  try {
    console.log('Clearing all data from the mbe table...');
    // Delete all data from the mbe table
    await prisma.mbe.deleteMany({});
    console.log('All data from the mbe table has been cleared.');
  } catch (error) {
    console.error('Error clearing mbe data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearMbeData();
