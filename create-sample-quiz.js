import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qqlovextnycxzdwnrydq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbG92ZXh0bnljeHpkd25yeWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NzI5MjksImV4cCI6MjA2NDA0ODkyOX0.EqjXAImoCkwBUKxE5-rFnUVwADCcDvdo_ofzF32TO4Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createSampleQuiz() {
  try {
    const sampleQuiz = {
      title: 'Biology Basics Quiz',
      description: 'Test your knowledge of basic biology concepts',
      time_limit: 300,
      passing_score: 70,
      questions: [
        {
          id: 'q1',
          question: 'What is the basic unit of life?',
          options: ['Atom', 'Cell', 'Molecule', 'Tissue'],
          correctOption: 1,
          explanation: 'The cell is the basic structural and functional unit of all living organisms.'
        },
        {
          id: 'q2',
          question: 'Which organelle is responsible for photosynthesis?',
          options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'],
          correctOption: 2,
          explanation: 'Chloroplasts contain chlorophyll and are responsible for photosynthesis in plant cells.'
        },
        {
          id: 'q3',
          question: 'What is DNA?',
          options: ['A protein', 'A carbohydrate', 'A nucleic acid', 'A lipid'],
          correctOption: 2,
          explanation: 'DNA (Deoxyribonucleic acid) is a nucleic acid that carries genetic information.'
        }
      ]
    };

    const { data, error } = await supabase
      .from('quizzes')
      .upsert(sampleQuiz)
      .select();

    if (error) {
      console.error('Error creating quiz:', error);
    } else {
      console.log('Sample quiz created successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createSampleQuiz();