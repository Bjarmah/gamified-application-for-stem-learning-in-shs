/**
 * Script to create sample quiz attempt data in Supabase
 * 
 * This script creates sample quiz attempt records for students
 * to demonstrate quiz performance across different modules.
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

// Function to get all quizzes with their questions
async function getAllQuizzes() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, module_id, questions, passing_score');

  if (error) {
    console.error('Error fetching quizzes:', error.message);
    return [];
  }

  return data;
}

// Function to get user progress to determine which quizzes a student might have taken
async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_id, completed')
    .eq('user_id', userId);

  if (error) {
    console.error(`Error fetching progress for user ${userId}:`, error.message);
    return [];
  }

  return data;
}

// Function to simulate a quiz attempt
function simulateQuizAttempt(quiz, userSkillLevel) {
  // Parse the questions JSON if it's a string
  const questions = typeof quiz.questions === 'string' 
    ? JSON.parse(quiz.questions) 
    : quiz.questions;
  
  // If no questions, return null
  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn(`Quiz ${quiz.id} has no questions, skipping`);
    return null;
  }
  
  const totalQuestions = questions.length;
  
  // Calculate correct answers based on user skill level (0.0 to 1.0)
  // Add some randomness but keep it weighted toward the skill level
  const correctAnswerProbability = userSkillLevel * 0.7 + Math.random() * 0.3;
  const correctAnswers = Math.round(totalQuestions * correctAnswerProbability);
  
  // Calculate score as percentage
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Simulate time spent (between 30 seconds to 2 minutes per question)
  const timePerQuestion = 30 + Math.floor(Math.random() * 90);
  const timeSpent = timePerQuestion * totalQuestions;
  
  // Generate simulated answers
  const answers = {};
  let correctCount = 0;
  
  questions.forEach((question, index) => {
    // Determine if this answer is correct (prioritize getting to our target correctAnswers count)
    const shouldBeCorrect = correctCount < correctAnswers && 
      (Math.random() < (correctAnswers - correctCount) / (totalQuestions - index));
    
    // If the question has options, pick one
    if (question.options && Array.isArray(question.options) && question.options.length > 0) {
      const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
      
      // If we know the correct answer and should answer correctly, use it
      if (shouldBeCorrect && correctOptionIndex !== -1) {
        answers[question.id] = correctOptionIndex;
        correctCount++;
      } else {
        // Otherwise pick a random wrong answer
        const wrongOptions = question.options
          .map((_, i) => i)
          .filter(i => i !== correctOptionIndex);
        
        if (wrongOptions.length > 0) {
          const randomWrongIndex = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
          answers[question.id] = randomWrongIndex;
        } else {
          // If somehow all options are correct, just pick one
          answers[question.id] = Math.floor(Math.random() * question.options.length);
        }
      }
    } else {
      // For questions without options (e.g., text input), just mark as correct or incorrect
      answers[question.id] = shouldBeCorrect ? 'correct_answer' : 'wrong_answer';
      if (shouldBeCorrect) correctCount++;
    }
  });
  
  // Create a date in the past few weeks
  const daysAgo = Math.floor(Math.random() * 21); // Up to 3 weeks ago
  const completedAt = new Date();
  completedAt.setDate(completedAt.getDate() - daysAgo);
  
  return {
    quiz_id: quiz.id,
    answers,
    score,
    correct_answers: correctCount,
    total_questions: totalQuestions,
    time_spent: timeSpent,
    completed_at: completedAt.toISOString()
  };
}

// Function to create quiz attempts for a student
async function createQuizAttemptsForStudent(student, quizzes) {
  console.log(`Creating quiz attempts for student: ${student.full_name}`);
  
  // Get the modules this student has interacted with
  const progress = await getUserProgress(student.id);
  const completedModuleIds = progress
    .filter(p => p.completed)
    .map(p => p.module_id);
  
  // Filter quizzes to those in modules the student has completed or attempted
  const relevantQuizzes = quizzes.filter(quiz => 
    progress.some(p => p.module_id === quiz.module_id)
  );
  
  if (relevantQuizzes.length === 0) {
    console.log(`No relevant quizzes found for student ${student.full_name}`);
    return [];
  }
  
  // Assign a random skill level to this student (0.6 to 0.95)
  const studentSkillLevel = 0.6 + Math.random() * 0.35;
  
  const quizAttempts = [];
  
  // For each relevant quiz, create 1-3 attempts with improving scores
  for (const quiz of relevantQuizzes) {
    // Determine if this module was completed by the student
    const moduleCompleted = completedModuleIds.includes(quiz.module_id);
    
    // Students are more likely to attempt quizzes for completed modules
    const shouldAttempt = moduleCompleted || Math.random() < 0.7;
    
    if (shouldAttempt) {
      // Determine number of attempts (more likely to have multiple attempts if module not completed)
      const attemptCount = moduleCompleted 
        ? 1 + Math.floor(Math.random() * 2) // 1-2 attempts for completed modules
        : 1 + Math.floor(Math.random() * 3); // 1-3 attempts for incomplete modules
      
      // Create multiple attempts with improving scores
      for (let i = 0; i < attemptCount; i++) {
        // Skill level improves with each attempt
        const attemptSkillLevel = studentSkillLevel * (0.8 + (i * 0.1));
        
        const attempt = simulateQuizAttempt(quiz, attemptSkillLevel);
        if (attempt) {
          quizAttempts.push({
            ...attempt,
            user_id: student.id
          });
        }
      }
    }
  }
  
  return quizAttempts;
}

// Function to insert quiz attempts in batches
async function insertQuizAttempts(attempts) {
  // Insert in batches of 50 to avoid request size limits
  const batchSize = 50;
  let insertedCount = 0;
  
  for (let i = 0; i < attempts.length; i += batchSize) {
    const batch = attempts.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('quiz_attempts')
      .upsert(batch);
    
    if (error) {
      console.error('Error inserting quiz attempts:', error.message);
    } else {
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${attempts.length} quiz attempts`);
    }
  }
  
  return insertedCount;
}

// Main function to create sample quiz attempt data
async function createSampleQuizAttempts() {
  try {
    console.log('Starting to create sample quiz attempt data...');
    
    // Get all student users
    const students = await getStudentUsers();
    if (students.length === 0) {
      console.error('No student users found. Please run create-sample-users.js first.');
      return;
    }
    
    // Get all quizzes
    const quizzes = await getAllQuizzes();
    if (quizzes.length === 0) {
      console.error('No quizzes found in the database.');
      return;
    }
    
    console.log(`Found ${students.length} students and ${quizzes.length} quizzes`);
    
    // Create quiz attempts for each student
    let allAttempts = [];
    for (const student of students) {
      const studentAttempts = await createQuizAttemptsForStudent(student, quizzes);
      allAttempts = [...allAttempts, ...studentAttempts];
    }
    
    // Insert all quiz attempts
    const insertedCount = await insertQuizAttempts(allAttempts);
    
    console.log(`Completed! Successfully created ${insertedCount} quiz attempts.`);
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
createSampleQuizAttempts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});