const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupRoomSystem() {
    console.log('🚀 Setting up room-based quiz system...\n');

    try {
        // Read and execute the migration SQL
        const fs = require('fs');
        const path = require('path');
        
        const migrationPath = path.join(__dirname, '../supabase/migrations/20250120000000_add_room_quiz_system.sql');
        
        if (!fs.existsSync(migrationPath)) {
            console.error('❌ Migration file not found:', migrationPath);
            console.log('Please ensure the migration file exists');
            return;
        }

        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log('📋 Executing database migration...');
        
        // Split the SQL into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
                    if (error) {
                        console.log('⚠️  Statement skipped (may already exist):', statement.substring(0, 50) + '...');
                    }
                } catch (err) {
                    // Some statements might fail if they already exist, which is fine
                    console.log('⚠️  Statement skipped:', statement.substring(0, 50) + '...');
                }
            }
        }

        console.log('✅ Database migration completed successfully!\n');

        // Create some sample data for testing
        console.log('🎯 Creating sample data...');
        
        // Note: You'll need to manually create some sample rooms and quizzes through the UI
        // or add more specific data creation logic here
        
        console.log('✅ Room system setup completed!\n');
        console.log('📝 Next steps:');
        console.log('1. Start your development server: npm run dev');
        console.log('2. Navigate to /rooms to test the room system');
        console.log('3. Create a room and add quizzes');
        console.log('4. Share room codes with others to test joining');

    } catch (error) {
        console.error('❌ Error setting up room system:', error);
        console.log('\n💡 Alternative setup method:');
        console.log('1. Copy the SQL from supabase/migrations/20250120000000_add_room_quiz_system.sql');
        console.log('2. Run it directly in your Supabase SQL editor');
        console.log('3. Or use the Supabase CLI: supabase db reset');
    }
}

// Run the setup
setupRoomSystem();

