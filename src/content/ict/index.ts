import module1 from './module1.json';
import module2 from './module2.json';
import module3 from './module3.json';

// Programming Fundamentals submodules
import module1a from './module1a.json';
import module1b from './module1b.json';
import module1c from './module1c.json';

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
    'Programming Fundamentals': module1,
    'Computer Networks & Internet': module2,
    'Database Management': module3,
    
    // Submodules
    'Programming Logic & Algorithms': module1a,
    'Introduction to Scratch Programming': module1b,
    'HTML Fundamentals for Web Development': module1c,
};

// Utility function to find a module by title
export const findICTModuleByTitle = (title: string): StructuredModule | undefined => {
    return mapByTitle[title];
};

// Export all ICT modules
export const ictModules: StructuredModule[] = [module1, module2, module3, module1a, module1b, module1c];

// Export individual modules
export { module1, module2, module3 };
