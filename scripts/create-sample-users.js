/**
 * Script to create sample users in Supabase for testing
 * 
 * This script creates sample users with different roles (student, teacher, admin)
 * and inserts their profile data into the profiles table.
 */

// Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // This should be set as an environment variable

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is not set');
  console.error('You need to set the service key (not the anon key) to create users');
  console.error('Get this from your Supabase dashboard under Project Settings > API');
  console.error('You can also create a .env file based on .env.example and set it there.');
  process.exit(1);
}

// Initialize Supabase client with service key for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Sample user data
const sampleUsers = [
  // Admin users
  {
    email: 'admin@stemstars.edu.gh',
    password: 'Admin123!',
    profile: {
      full_name: 'Admin User',
      school: 'STEM Stars Ghana',
      role: 'admin',
      avatar_url: null
    }
  },
  
  // Teacher users
  {
    email: 'teacher.math@stemstars.edu.gh',
    password: 'Teacher123!',
    profile: {
      full_name: 'Kofi Mensah',
      school: 'Accra Academy',
      role: 'teacher',
      avatar_url: null
    }
  },
  {
    email: 'teacher.science@stemstars.edu.gh',
    password: 'Teacher123!',
    profile: {
      full_name: 'Abena Osei',
      school: 'Wesley Girls High School',
      role: 'teacher',
      avatar_url: null
    }
  },
  
  // Student users
  {
    email: 'student1@stemstars.edu.gh',
    password: 'Student123!',
    profile: {
      full_name: 'Kwame Adu',
      school: 'Accra Academy',
      role: 'student',
      avatar_url: null
    }
  },
  {
    email: 'student2@stemstars.edu.gh',
    password: 'Student123!',
    profile: {
      full_name: 'Ama Darko',
      school: 'Wesley Girls High School',
      role: 'student',
      avatar_url: null
    }
  },
  {
    email: 'student3@stemstars.edu.gh',
    password: 'Student123!',
    profile: {
      full_name: 'Yaw Boateng',
      school: 'Prempeh College',
      role: 'student',
      avatar_url: null
    }
  },
  {
    email: 'student4@stemstars.edu.gh',
    password: 'Student123!',
    profile: {
      full_name: 'Akua Manu',
      school: 'Achimota School',
      role: 'student',
      avatar_url: null
    }
  },
  {
    email: 'student5@stemstars.edu.gh',
    password: 'Student123!',
    profile: {
      full_name: 'Kwesi Appiah',
      school: 'Presbyterian Boys Secondary School',
      role: 'student',
      avatar_url: null
    }
  }
];

// Function to create a user and their profile
async function createUserWithProfile(userData) {
  try {
    // Create the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true // Auto-confirm email so users can login immediately
    });

    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError.message);
      return false;
    }

    console.log(`Created user: ${userData.email} with ID: ${authData.user.id}`);

    // Create the user profile in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        full_name: userData.profile.full_name,
        school: userData.profile.school,
        role: userData.profile.role,
        avatar_url: userData.profile.avatar_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error(`Error creating profile for ${userData.email}:`, profileError.message);
      return false;
    }

    console.log(`Created profile for: ${userData.email}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error for ${userData.email}:`, error.message);
    return false;
  }
}

// Main function to create all sample users
async function createSampleUsers() {
  console.log('Starting to create sample users...');
  
  let successCount = 0;
  
  for (const userData of sampleUsers) {
    const success = await createUserWithProfile(userData);
    if (success) successCount++;
  }
  
  console.log(`Completed! Successfully created ${successCount}/${sampleUsers.length} users.`);
}

// Run the script
createSampleUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});