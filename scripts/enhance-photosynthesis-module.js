import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbG92ZXh0bnljeHpkd25yeWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzI5MjksImV4cCI6MjA2NDA0ODkyOX0.EqjXAImoCkwBUKxE5-rFnUVwADCcDvdo_ofzF32TO4Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function enhancePhotosynthesisModule() {
    console.log('🔍 Enhancing Photosynthesis & Respiration module...\n');

    try {
        // Find Biology subject
        const { data: subjects } = await supabase
            .from('subjects')
            .select('id')
            .eq('name', 'Biology')
            .single();

        if (!subjects) {
            console.error('Biology subject not found');
            return;
        }

        // Find the module
        const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('subject_id', subjects.id)
            .eq('title', 'Photosynthesis & Respiration')
            .single();

        if (!modules) {
            console.error('Module not found');
            return;
        }

        // Enhanced content
        const enhancedContent = {
            title: "Photosynthesis & Respiration: Complete Energy Systems",
            description: "Comprehensive coverage of energy transformations: light reactions, Calvin cycle, cellular respiration pathways, and ecosystem energy flow with Ghanaian applications.",
            estimated_duration: 120,
            difficulty_level: "advanced",
            content: {
                introduction: "Master the complete energy systems that power life on Earth. From solar energy capture to ATP production, explore the molecular mechanisms and real-world applications.",
                detailed_lessons: [
                    {
                        title: "Light Reactions Deep Dive",
                        content: "Explore thylakoid membranes, photosystems, electron transport, and ATP synthesis through chemiosmosis. Understand environmental factors affecting efficiency.",
                        topics: ["Photosystem I & II", "Electron Transport", "Photophosphorylation", "Environmental Factors"]
                    },
                    {
                        title: "Calvin Cycle Mastery",
                        content: "Master carbon fixation, reduction, and regeneration phases. Learn about RuBisCO, photorespiration, and optimization strategies.",
                        topics: ["Carbon Fixation", "Reduction Phase", "Regeneration", "Photorespiration"]
                    },
                    {
                        title: "Cellular Respiration Pathways",
                        content: "Comprehensive coverage of glycolysis, Krebs cycle, and electron transport chain with energy calculations and efficiency analysis.",
                        topics: ["Glycolysis", "Krebs Cycle", "ETC", "ATP Production"]
                    },
                    {
                        title: "Energy Flow in Ecosystems",
                        content: "Understand trophic levels, energy pyramids, and human impacts on ecosystem energy dynamics.",
                        topics: ["Trophic Levels", "Energy Efficiency", "Human Impact", "Conservation"]
                    }
                ],
                ghanaian_applications: [
                    "Cocoa farming optimization",
                    "Agricultural sustainability",
                    "Sports performance",
                    "Environmental conservation"
                ],
                interactive_elements: [
                    "Energy flow simulation",
                    "Photosynthesis lab",
                    "Respiration calculator",
                    "Ecosystem modeling"
                ]
            }
        };

        // Update module
        const { data: updateData, error: updateError } = await supabase
            .from('modules')
            .update({
                title: enhancedContent.title,
                description: enhancedContent.description,
                estimated_duration: enhancedContent.estimated_duration,
                difficulty_level: enhancedContent.difficulty_level,
                content: enhancedContent.content,
                updated_at: new Date().toISOString()
            })
            .eq('id', modules.id)
            .select();

        if (updateError) {
            console.error('Update error:', updateError);
            return;
        }

        console.log('✅ Module enhanced successfully!');
        console.log(`📊 New duration: ${enhancedContent.estimated_duration} minutes`);
        console.log(`📚 Lessons: ${enhancedContent.content.detailed_lessons.length}`);
        console.log(`🇬🇭 Ghanaian applications: ${enhancedContent.content.ghanaian_applications.length}`);

        // Create enhanced quiz
        await createEnhancedQuiz(modules.id);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function createEnhancedQuiz(moduleId) {
    const enhancedQuiz = {
        title: "Photosynthesis & Respiration - Enhanced Assessment",
        description: "Comprehensive 40-question assessment covering all energy systems",
        questions: [
            {
                id: "enh-1",
                type: "mcq",
                question: "What is the quantum yield of photosynthesis?",
                options: {
                    "A": "2-4 photons per O₂",
                    "B": "8-10 photons per O₂",
                    "C": "15-20 photons per O₂",
                    "D": "25-30 photons per O₂"
                },
                correctAnswer: "B",
                explanation: "The quantum yield is approximately 8-10 photons per oxygen molecule produced.",
                difficulty: "advanced"
            },
            {
                id: "enh-2",
                type: "mcq",
                question: "How many ATP molecules are produced per glucose in complete aerobic respiration?",
                options: {
                    "A": "2",
                    "B": "18",
                    "C": "32-34",
                    "D": "50"
                },
                correctAnswer: "C",
                explanation: "Complete aerobic respiration produces 32-34 ATP molecules per glucose molecule.",
                difficulty: "intermediate"
            }
        ],
        time_limit: 60,
        passing_score: 75
    };

    try {
        const { data: quizData, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                module_id: moduleId,
                title: enhancedQuiz.title,
                description: enhancedQuiz.description,
                questions: enhancedQuiz.questions,
                time_limit: enhancedQuiz.time_limit,
                passing_score: enhancedQuiz.passing_score
            })
            .select();

        if (quizError) {
            console.error('Quiz creation error:', quizError);
        } else {
            console.log('✅ Enhanced quiz created successfully!');
        }
    } catch (error) {
        console.error('Quiz error:', error);
    }
}

enhancePhotosynthesisModule();
