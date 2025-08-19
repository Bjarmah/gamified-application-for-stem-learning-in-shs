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

async function createRoomsTable() {
    console.log('🚀 Creating rooms table...\n');

    try {
        // Check if rooms table exists
        const { data: existingTable, error: checkError } = await supabase
            .from('rooms')
            .select('*')
            .limit(1);

        if (checkError && checkError.code === '42P01') { // Table doesn't exist
            console.log('📋 Rooms table does not exist, creating it...');

            // Create rooms table
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS rooms (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    room_code TEXT UNIQUE NOT NULL,
                    max_members INTEGER DEFAULT 50,
                    is_public BOOLEAN DEFAULT false,
                    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
                    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `;

            const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });

            if (createError) {
                console.error('❌ Error creating rooms table:', createError);
                console.log('\n💡 Alternative: Run this SQL directly in your Supabase SQL editor:');
                console.log(createTableSQL);
                return;
            }

            console.log('✅ Rooms table created successfully!');
        } else if (checkError) {
            console.error('❌ Error checking rooms table:', checkError);
            return;
        } else {
            console.log('✅ Rooms table already exists!');
        }

        // Check if room_members table exists
        const { data: membersTable, error: membersCheckError } = await supabase
            .from('room_members')
            .select('*')
            .limit(1);

        if (membersCheckError && membersCheckError.code === '42P01') {
            console.log('📋 Room members table does not exist, creating it...');

            const createMembersTableSQL = `
                CREATE TABLE IF NOT EXISTS room_members (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
                    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    is_online BOOLEAN DEFAULT false,
                    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    UNIQUE(room_id, user_id)
                );
            `;

            const { error: createMembersError } = await supabase.rpc('exec_sql', { sql: createMembersTableSQL });

            if (createMembersError) {
                console.error('❌ Error creating room_members table:', createMembersError);
                console.log('\n💡 Alternative: Run this SQL directly in your Supabase SQL editor:');
                console.log(createMembersTableSQL);
                return;
            }

            console.log('✅ Room members table created successfully!');
        } else if (membersCheckError) {
            console.error('❌ Error checking room_members table:', membersCheckError);
            return;
        } else {
            console.log('✅ Room members table already exists!');
        }

        // Enable RLS
        console.log('🔒 Enabling Row Level Security...');

        const enableRLSSQL = `
            ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
            ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
        `;

        const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL });

        if (rlsError) {
            console.log('⚠️  RLS enable skipped (may already be enabled)');
        } else {
            console.log('✅ RLS enabled successfully!');
        }

        console.log('\n🎉 Rooms system setup completed!');
        console.log('📝 Next steps:');
        console.log('1. Start your development server: npm run dev');
        console.log('2. Navigate to /rooms to test room creation');
        console.log('3. Check the browser console for any errors');

    } catch (error) {
        console.error('❌ Error setting up rooms system:', error);
        console.log('\n💡 Alternative setup method:');
        console.log('1. Copy the SQL from this script');
        console.log('2. Run it directly in your Supabase SQL editor');
        console.log('3. Or use the Supabase CLI: supabase db reset');
    }
}

// Run the setup
createRoomsTable();
