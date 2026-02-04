#!/usr/bin/env node

/**
 * Database Seed Runner
 * Populates database with sample data for development
 * Usage: node run-seeds.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEEDS_DIR = path.join(__dirname, 'seeds');

async function runSeeds() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    // Get all seed files sorted by name
    const files = fs.readdirSync(SEEDS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No seed files found in', SEEDS_DIR);
      return;
    }

    console.log(`Found ${files.length} seed files:\n`);

    // Execute each seed file
    for (const file of files) {
      const filePath = path.join(SEEDS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`📄 Running: ${file}`);
      
      try {
        await pool.query(sql);
        console.log(`✅ Success: ${file}\n`);
      } catch (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        console.error('   This may be expected if data already exists.');
      }
    }

    console.log('🎉 Database seeding completed!\n');
    
    // Show summary
    console.log('📊 Database Summary:');
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const listingCount = await pool.query('SELECT COUNT(*) FROM listings');
    const bookingCount = await pool.query('SELECT COUNT(*) FROM bookings');
    
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Listings: ${listingCount.rows[0].count}`);
    console.log(`   Bookings: ${bookingCount.rows[0].count}\n`);

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeds
runSeeds();
