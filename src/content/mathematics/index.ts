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

// Create a map for easy lookup by title
const mapByTitle: Record<string, StructuredModule> = {
  [module1.title]: module1,
  [module2.title]: module2,
  [module3.title]: module3,
};

// Utility function to find a module by title
export const findMathematicsModuleByTitle = (title: string): StructuredModule | undefined => {
  return mapByTitle[title];
};

// Export all mathematics modules
export const mathematicsModules: StructuredModule[] = [module1, module2, module3];

// Export individual modules
export { module1, module2, module3 };
