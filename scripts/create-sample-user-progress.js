/**
 * Script to create sample user progress data in Supabase
 * 
 * This script creates sample user progress records for students
 * to demonstrate learning progress across different modules.
 */

// Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // This should be set as an environment variable

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is not set');
  console.error('You need to set the service key (not the anon key) to create data');
  console.error('Get this from your Supabase dashboard under Project Settings > API');
  console.error('You can also create a .env file based on .env.example and set it there.');
  process.exit(1);
}

// Initialize Supabase client with service key for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Function to get all student users
async function getStudentUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'student');

  if (error) {
    console.error('Error fetching student users:', error.message);
    return [];
  }

  return data;
}

// Function to get all modules
async function getAllModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('id, title, subject_id, difficulty_level');

  if (error) {
    console.error('Error fetching modules:', error.message);
    return [];
  }

  return data;
}

// Function to create random progress data for a student across modules
async function createProgressForStudent(studentId, modules) {
  console.log(`Creating progress data for student ID: ${studentId}`);
  
  // Determine how many modules this student has interacted with (between 40-80% of all modules)
  const moduleCount = Math.floor(modules.length * (0.4 + Math.random() * 0.4));
  const selectedModules = [...modules]
    .sort(() => 0.5 - Math.random()) // Shuffle modules
    .slice(0, moduleCount); // Take a random subset
  
  // Sort modules by difficulty to simulate natural progression
  selectedModules.sort((a, b) => {
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    return difficultyOrder[a.difficulty_level] - difficultyOrder[b.difficulty_level];
  });
  
  const progressRecords = [];
  
  // Create progress records with decreasing completion rates as difficulty increases
  for (let i = 0; i < selectedModules.length; i++) {
    const module = selectedModules[i];
    const difficultyFactor = { 'beginner': 0.9, 'intermediate': 0.7, 'advanced': 0.5 };
    const progressChance = difficultyFactor[module.difficulty_level] * (1 - (i / selectedModules.length * 0.5));
    
    // Determine if module is completed based on difficulty and position in learning path
    const completed = Math.random() < progressChance;
    
    // Generate realistic time spent (between 15-90 minutes in seconds)
    const timeSpent = Math.floor((15 + Math.random() * 75) * 60);
    
    // Generate score (higher for completed modules)
    const score = completed ? Math.floor(70 + Math.random() * 30) : Math.floor(30 + Math.random() * 40);
    
    // Create a date in the past few weeks
    const daysAgo = Math.floor(Math.random() * 21); // Up to 3 weeks ago
    const lastAccessed = new Date();
    lastAccessed.setDate(lastAccessed.getDate() - daysAgo);
    
    progressRecords.push({
      user_id: studentId,
      module_id: module.id,
      completed,
      score,
      time_spent: timeSpent,
      last_accessed: lastAccessed.toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  return progressRecords;
}

// Function to insert progress records in batches
async function insertProgressRecords(progressRecords) {
  // Insert in batches of 50 to avoid request size limits
  const batchSize = 50;
  let insertedCount = 0;
  
  for (let i = 0; i < progressRecords.length; i += batchSize) {
    const batch = progressRecords.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('user_progress')
      .upsert(batch);
    
    if (error) {
      console.error('Error inserting progress records:', error.message);
    } else {
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${progressRecords.length} progress records`);
    }
  }
  
  return insertedCount;
}

// Main function to create sample progress data
async function createSampleProgressData() {
  try {
    console.log('Starting to create sample user progress data...');
    
    // Get all student users
    const students = await getStudentUsers();
    if (students.length === 0) {
      console.error('No student users found. Please run create-sample-users.js first.');
      return;
    }
    
    // Get all modules
    const modules = await getAllModules();
    if (modules.length === 0) {
      console.error('No modules found in the database.');
      return;
    }
    
    console.log(`Found ${students.length} students and ${modules.length} modules`);
    
    // Create progress data for each student
    let allProgressRecords = [];
    for (const student of students) {
      const studentProgress = await createProgressForStudent(student.id, modules);
      allProgressRecords = [...allProgressRecords, ...studentProgress];
    }
    
    // Insert all progress records
    const insertedCount = await insertProgressRecords(allProgressRecords);
    
    console.log(`Completed! Successfully created ${insertedCount} user progress records.`);
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
createSampleProgressData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});