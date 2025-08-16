import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbG92ZXh0bnljeHpkd25yeWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzI5MjksImV4cCI6MjA2NDA0ODkyOX0.EqjXAImoCkwBUKxE5-rFnUVwADCcDvdo_ofzF32TO4Y";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Example queries you can use
async function exampleQueries() {
  console.log('🔍 Supabase Query Examples\n');

  try {
    // 1. Get all subjects with their modules count
    console.log('1. Subjects with module counts:');
    const { data: subjectsWithCounts, error: countError } = await supabase
      .from('subjects')
      .select(`
        *,
        modules:modules(count)
      `);
    
    if (!countError && subjectsWithCounts) {
      subjectsWithCounts.forEach(subject => {
        const moduleCount = subject.modules?.[0]?.count || 0;
        console.log(`  - ${subject.name}: ${moduleCount} modules`);
      });
    }

    // 2. Get modules by difficulty level
    console.log('\n2. Modules grouped by difficulty:');
    const { data: modulesByDifficulty, error: diffError } = await supabase
      .from('modules')
      .select('difficulty_level, count')
      .not('difficulty_level', 'is', null)
      .group('difficulty_level');
    
    if (!diffError && modulesByDifficulty) {
      modulesByDifficulty.forEach(item => {
        console.log(`  - ${item.difficulty_level}: ${item.count} modules`);
      });
    }

    // 3. Get recent quiz attempts with scores
    console.log('\n3. Recent quiz attempts (last 5):');
    const { data: recentAttempts, error: recentError } = await supabase
      .from('quiz_attempts')
      .select(`
        score,
        total_questions,
        completed_at,
        quizzes(title)
      `)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(5);
    
    if (!recentError && recentAttempts) {
      recentAttempts.forEach(attempt => {
        const percentage = attempt.total_questions > 0 
          ? Math.round((attempt.score / attempt.total_questions) * 100) 
          : 0;
        const date = new Date(attempt.completed_at).toLocaleDateString();
        console.log(`  - ${attempt.quizzes?.title || 'Unknown'}: ${attempt.score}/${attempt.total_questions} (${percentage}%) - ${date}`);
      });
    }

    // 4. Get user progress summary
    console.log('\n4. User progress summary:');
    const { data: progressSummary, error: progressError } = await supabase
      .from('user_progress')
      .select('completed, count')
      .group('completed');
    
    if (!progressError && progressSummary) {
      progressSummary.forEach(item => {
        const status = item.completed ? 'Completed' : 'In Progress';
        console.log(`  - ${status}: ${item.count} records`);
      });
    }

    // 5. Search for specific content
    console.log('\n5. Search for modules containing "cell":');
    const { data: searchResults, error: searchError } = await supabase
      .from('modules')
      .select('title, description, difficulty_level')
      .or('title.ilike.%cell%,description.ilike.%cell%')
      .limit(3);
    
    if (!searchError && searchResults) {
      searchResults.forEach(module => {
        console.log(`  - ${module.title} (${module.difficulty_level || 'No level'})`);
        if (module.description) {
          console.log(`    Description: ${module.description.substring(0, 100)}...`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error in queries:', error);
  }
}

// Function to get data for a specific subject
async function getSubjectData(subjectName) {
  console.log(`\n📚 Getting data for subject: ${subjectName}`);
  
  try {
    const { data: subjectData, error: subjectError } = await supabase
      .from('subjects')
      .select(`
        *,
        modules:modules(
          *,
          quizzes:quizzes(*)
        )
      `)
      .eq('name', subjectName)
      .single();
    
    if (subjectError) {
      console.error('Error fetching subject:', subjectError);
      return;
    }
    
    if (subjectData) {
      console.log(`Subject: ${subjectData.name}`);
      console.log(`Description: ${subjectData.description || 'No description'}`);
      console.log(`Modules: ${subjectData.modules?.length || 0}`);
      
      subjectData.modules?.forEach((module, index) => {
        console.log(`\n  Module ${index + 1}: ${module.title}`);
        console.log(`    Difficulty: ${module.difficulty_level || 'Not specified'}`);
        console.log(`    Duration: ${module.estimated_duration || 'Not specified'} minutes`);
        console.log(`    Quizzes: ${module.quizzes?.length || 0}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to get user statistics
async function getUserStats(userId) {
  console.log(`\n👤 Getting stats for user: ${userId}`);
  
  try {
    // Get quiz attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('score, total_questions, time_spent')
      .eq('user_id', userId);
    
    if (!attemptsError && attempts && attempts.length > 0) {
      const totalQuizzes = attempts.length;
      const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
      const totalQuestions = attempts.reduce((sum, a) => sum + a.total_questions, 0);
      const totalTime = attempts.reduce((sum, a) => sum + (a.time_spent || 0), 0);
      const averageScore = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      
      console.log(`  Total quizzes taken: ${totalQuizzes}`);
      console.log(`  Average score: ${averageScore}%`);
      console.log(`  Total time spent: ${Math.round(totalTime / 60)} minutes`);
    }
    
    // Get progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('completed, score')
      .eq('user_id', userId);
    
    if (!progressError && progress) {
      const completed = progress.filter(p => p.completed).length;
      const total = progress.length;
      console.log(`  Modules completed: ${completed}/${total}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run examples
exampleQueries();

// Uncomment these to test specific functions:
// getSubjectData('Biology');
// getUserStats('some-user-id');
