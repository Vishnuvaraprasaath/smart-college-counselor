/**
 * seedData.js — Entry point for database seeding
 * Delegates to dataLoader.js for verified ingestion from data/ directory.
 */
import { loadAllData } from './dataLoader.js';

export const seedDatabase = async (force = false) => {
  return await loadAllData(force);
};

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase(true).then((res) => {
    console.log('Database seeding complete:', res);
    process.exit(0);
  }).catch(err => {
    console.error('Database seeding error:', err);
    process.exit(1);
  });
}
