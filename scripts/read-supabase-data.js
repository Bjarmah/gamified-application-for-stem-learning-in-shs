import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbG92ZXh0bnljeHpkd25yeWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzI5MjksImV4cCI6MjA2NDA0ODkyOX0.EqjXAImoCkwBUKxE5-rFnUVwADCcDvdo_ofzF32TO4Y";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function readDatabaseData() {
    console.log('🔍 Reading data from Supabase database...\n');

    try {
        // 1. Read all subjects
        console.log('📚 Reading subjects...');
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('*')
            .order('name');

        if (subjectsError) {
            console.error('Error reading subjects:', subjectsError);
        } else {
            console.log(`Found ${subjects.length} subjects:`);
            subjects.forEach(subject => {
                console.log(`  - ${subject.name} (ID: ${subject.id})`);
            });
        }

        // 2. Read all modules
        console.log('\n📖 Reading modules...');
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('*, subjects(name)')
            .order('order_index');

        if (modulesError) {
            console.error('Error reading modules:', modulesError);
        } else {
            console.log(`Found ${modules.length} modules:`);
            modules.forEach(module => {
                const subjectName = module.subjects?.name || 'Unknown';
                console.log(`  - ${module.title} (${subjectName}) - ${module.difficulty_level || 'No level'}`);
            });
        }

        // 3. Read all quizzes
        console.log('\n🧪 Reading quizzes...');
        const { data: quizzes, error: quizzesError } = await supabase
            .from('quizzes')
            .select('*, modules(title, subjects(name))')
            .order('created_at', { ascending: false });

        if (quizzesError) {
            console.error('Error reading quizzes:', quizzesError);
        } else {
            console.log(`Found ${quizzes.length} quizzes:`);
            quizzes.forEach(quiz => {
                const moduleTitle = quiz.modules?.title || 'Unknown';
                const subjectName = quiz.modules?.subjects?.name || 'Unknown';
                console.log(`  - ${quiz.title} (${moduleTitle} - ${subjectName})`);
            });
        }

        // 4. Read user profiles (limited to first 5 for privacy)
        console.log('\n👥 Reading user profiles (first 5)...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, role, school, created_at')
            .limit(5)
            .order('created_at', { ascending: false });

        if (profilesError) {
            console.error('Error reading profiles:', profilesError);
        } else {
            console.log(`Found ${profiles.length} profiles:`);
            profiles.forEach(profile => {
                console.log(`  - ${profile.full_name || 'Anonymous'} (${profile.role || 'No role'}) - ${profile.school || 'No school'}`);
            });
        }

        // 5. Read quiz attempts (limited to first 10)
        console.log('\n📊 Reading quiz attempts (first 10)...');
        const { data: attempts, error: attemptsError } = await supabase
            .from('quiz_attempts')
            .select('*, quizzes(title), profiles(full_name)')
            .limit(10)
            .order('completed_at', { ascending: false });

        if (attemptsError) {
            console.error('Error reading quiz attempts:', attemptsError);
        } else {
            console.log(`Found ${attempts.length} quiz attempts:`);
            attempts.forEach(attempt => {
                const quizTitle = attempt.quizzes?.title || 'Unknown Quiz';
                const userName = attempt.profiles?.full_name || 'Anonymous';
                const score = attempt.score;
                const total = attempt.total_questions;
                const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
                console.log(`  - ${userName} scored ${score}/${total} (${percentage}%) on "${quizTitle}"`);
            });
        }

        // 6. Read user progress (limited to first 10)
        console.log('\n📈 Reading user progress (first 10)...');
        const { data: progress, error: progressError } = await supabase
            .from('user_progress')
            .select('*, modules(title), profiles(full_name)')
            .limit(10)
            .order('last_accessed', { ascending: false });

        if (progressError) {
            console.error('Error reading user progress:', progressError);
        } else {
            console.log(`Found ${progress.length} progress records:`);
            progress.forEach(record => {
                const moduleTitle = record.modules?.title || 'Unknown Module';
                const userName = record.profiles?.full_name || 'Anonymous';
                const status = record.completed ? '✅ Completed' : '🔄 In Progress';
                const score = record.score ? ` (Score: ${record.score})` : '';
                console.log(`  - ${userName}: ${moduleTitle} - ${status}${score}`);
            });
        }

        console.log('\n✅ Database reading completed successfully!');

    } catch (error) {
        console.error('❌ Error reading database:', error);
    }
}

// Run the function
readDatabaseData();
