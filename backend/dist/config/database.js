import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
// Supabase PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'postgres',
    // Enable SSL for Supabase connection
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Return error after 10 seconds if connection cannot be established
});
// Test database connection on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    }
    else {
        console.log('✅ Database connected successfully at:', res.rows[0].now);
    }
});
// Handle unexpected errors on idle clients
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle database client:', err);
    process.exit(-1);
});
export default pool;
//# sourceMappingURL=database.js.map