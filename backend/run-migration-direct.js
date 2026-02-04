// Direct migration runner - bypasses TypeScript compilation
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running payment_transactions migration...\n');
    
    const migrationPath = join(__dirname, 'database', 'migrations', '006_create_payment_transactions_table.sql');
    const sql = await readFile(migrationPath, 'utf-8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Created:');
    console.log('   - payment_transactions table');
    console.log('   - generate_transaction_reference() function');
    console.log('   - calculate_host_commission() function');
    console.log('   - host_earnings_summary view');
    console.log('   - 8 performance indexes');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
