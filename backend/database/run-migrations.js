#!/usr/bin/env node

/**
 * Database Migration Runner
 * Executes SQL migration files in order
 * Usage: node run-migrations.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
  
  try {
    // Get all migration files sorted by name
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No migration files found in', MIGRATIONS_DIR);
      return;
    }

    console.log(`Found ${files.length} migration files:\n`);

    // Execute each migration
    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`📄 Running: ${file}`);
      
      try {
        await pool.query(sql);
        console.log(`✅ Success: ${file}\n`);
      } catch (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        throw error;
      }
    }

    console.log('🎉 All migrations completed successfully!\n');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
