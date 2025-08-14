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

// Convert the existing mathematics modules to match the expected interface
const convertMathematicsModule = (module: any): StructuredModule => {
  return {
    id: module.moduleId || `mathematics-${Math.random().toString(36).substr(2, 9)}`,
    title: module.moduleTitle || 'Mathematics Module',
    description: module.objectives?.join('. ') || 'Mathematics learning module',
    subject: 'Mathematics',
    level: module.level || 'Intermediate',
    estimatedTime: 60, // Default 60 minutes
    xpReward: 100, // Default 100 XP
    achievement: 'Mathematics Explorer',
    achievementDescription: 'Complete mathematics module',
    content: {
      text: {
        introduction: module.lessons?.[0]?.text || 'Introduction to mathematics concepts',
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
          id: 'mathematics-explorer',
          title: 'Mathematics Explorer',
          description: 'Complete mathematics module',
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
      localExamples: ['Local mathematics examples'],
      culturalConnections: ['Cultural mathematics connections'],
      realWorldApplications: ['Real-world mathematics applications']
    },
    prerequisites: [],
    nextModule: null,
    tags: ['mathematics', 'math', 'ghana', 'shs']
  };
};

// Create a map for easy lookup by title
const mapByTitle: Record<string, StructuredModule> = {
  'Linear Equations & Inequalities': convertMathematicsModule(module1),
  'Quadratic Functions': convertMathematicsModule(module2),
  'Geometry & Trigonometry': convertMathematicsModule(module3),
};

// Utility function to find a module by title
export const findMathematicsModuleByTitle = (title: string): StructuredModule | undefined => {
  return mapByTitle[title];
};

// Export all mathematics modules
export const mathematicsModules: StructuredModule[] = [
  convertMathematicsModule(module1),
  convertMathematicsModule(module2),
  convertMathematicsModule(module3)
];

// Export individual modules
export { module1, module2, module3 };
