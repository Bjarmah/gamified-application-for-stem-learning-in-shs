import module1 from './module1.json';
import module2 from './module2.json';
import module3 from './module3.json';

export interface StructuredModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  estimatedTime: number;
  xpReward: number;
  achievement: string;
  achievementDescription: string;
  content: {
    text: {
      introduction: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
    };
    questions: Array<{
      type: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
    exercises: Array<{
      type: string;
      title: string;
      instructions: string;
      hint: string;
    }>;
    scenarioChallenges: Array<{
      title: string;
      scenario: string;
      tasks: string[];
      learningObjectives: string[];
      ghanaContext: string;
    }>;
  };
  gamification: {
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      xpReward: number;
    }>;
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      xpReward: number;
    }>;
    xpRules: {
      correctAnswer: number;
      completedExercise: number;
      scenarioChallenge: number;
      moduleCompletion: number;
    };
  };
  ghanaContext: {
    localExamples: string[];
    culturalConnections: string[];
    realWorldApplications: string[];
  };
  prerequisites: string[];
  nextModule: string | null;
  tags: string[];
}

// Convert the existing chemistry modules to match the expected interface
const convertChemistryModule = (module: any): StructuredModule => {
  return {
    id: module.moduleId || `chemistry-${Math.random().toString(36).substr(2, 9)}`,
    title: module.moduleTitle || 'Chemistry Module',
    description: module.objectives?.join('. ') || 'Chemistry learning module',
    subject: 'Chemistry',
    level: module.level || 'Intermediate',
    estimatedTime: 60, // Default 60 minutes
    xpReward: 100, // Default 100 XP
    achievement: 'Chemistry Explorer',
    achievementDescription: 'Complete chemistry module',
    content: {
      text: {
        introduction: module.lessons?.[0]?.text || 'Introduction to chemistry concepts',
        sections: module.lessons?.map((lesson: any, index: number) => ({
          title: lesson.title || `Lesson ${index + 1}`,
          content: lesson.text || 'Lesson content'
        })) || []
      },
      questions: [], // Convert knowledge checks if available
      exercises: [], // Convert exercises if available
      scenarioChallenges: module.lessons?.flatMap((lesson: any) => 
        lesson.scenarioChallenges?.map((challenge: any) => ({
          title: challenge.title || 'Scenario Challenge',
          scenario: challenge.scenario || 'Challenge description',
          tasks: challenge.tasks || [],
          learningObjectives: challenge.learningObjectives || [],
          ghanaContext: challenge.ghanaContext || 'Local context'
        })) || []
      ) || []
    },
    gamification: {
      achievements: [
        {
          id: 'chemistry-explorer',
          title: 'Chemistry Explorer',
          description: 'Complete chemistry module',
          xpReward: 100
        }
      ],
      milestones: [],
      xpRules: {
        correctAnswer: 10,
        completedExercise: 25,
        scenarioChallenge: 50,
        moduleCompletion: 100
      }
    },
    ghanaContext: {
      localExamples: ['Local chemistry examples'],
      culturalConnections: ['Cultural chemistry connections'],
      realWorldApplications: ['Real-world chemistry applications']
    },
    prerequisites: [],
    nextModule: null,
    tags: ['chemistry', 'science', 'ghana', 'shs']
  };
};

// Create a map for easy lookup by title
const mapByTitle: Record<string, StructuredModule> = {
  'Atomic Structure & Electron Configuration': convertChemistryModule(module1),
  'Chemical Bonding': convertChemistryModule(module2),
  'Acids, Bases & Salts': convertChemistryModule(module3),
};

// Utility function to find a module by title
export const findChemistryModuleByTitle = (title: string): StructuredModule | undefined => {
  return mapByTitle[title];
};

// Export all chemistry modules
export const chemistryModules: StructuredModule[] = [
  convertChemistryModule(module1),
  convertChemistryModule(module2),
  convertChemistryModule(module3)
];

// Export individual modules
export { module1, module2, module3 };
