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

// Convert the existing physics modules to match the expected interface
const convertPhysicsModule = (module: any, index: number): StructuredModule => {
  // Ensure consistent, trackable ID
  const generateId = () => {
    if (module.moduleId && typeof module.moduleId === 'string') {
      return module.moduleId;
    }
    const title = module.moduleTitle || `Module ${index + 1}`;
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 30);
    return `physics-${cleanTitle}`;
  };
  
  return {
    id: generateId(),
    title: module.moduleTitle || 'Physics Module',
    description: module.objectives?.join('. ') || 'Physics learning module',
    subject: 'Physics',
    level: module.level || 'Intermediate',
    estimatedTime: 60, // Default 60 minutes
    xpReward: 100, // Default 100 XP
    achievement: 'Physics Explorer',
    achievementDescription: 'Complete physics module',
    content: {
      text: {
        introduction: module.lessons?.[0]?.text || 'Introduction to physics concepts',
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
          id: 'physics-explorer',
          title: 'Physics Explorer',
          description: 'Complete physics module',
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
      localExamples: ['Local physics examples'],
      culturalConnections: ['Cultural physics connections'],
      realWorldApplications: ['Real-world physics applications']
    },
    prerequisites: [],
    nextModule: null,
    tags: ['physics', 'science', 'ghana', 'shs']
  };
};

// Create a map for easy lookup by title
const mapByTitle: Record<string, StructuredModule> = {
  'Forces and Motion': convertPhysicsModule(module1, 0),
  'Waves and Sound': convertPhysicsModule(module2, 1),
  'Electricity and Magnetism': convertPhysicsModule(module3, 2),
};

// Utility function to find a module by title
export const findPhysicsModuleByTitle = (title: string): StructuredModule | undefined => {
  return mapByTitle[title];
};

// Export all physics modules
export const physicsModules: StructuredModule[] = [
  convertPhysicsModule(module1, 0),
  convertPhysicsModule(module2, 1),
  convertPhysicsModule(module3, 2)
];

// Export individual modules
export { module1, module2, module3 };
