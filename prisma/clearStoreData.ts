import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearStoreData() {
  try {
    console.log('Clearing all data from the store table...');
    // Delete all data from the store table
    await prisma.store.deleteMany({});
    console.log('All data from the store table has been cleared.');
  } catch (error) {
    console.error('Error clearing store data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearStoreData();
