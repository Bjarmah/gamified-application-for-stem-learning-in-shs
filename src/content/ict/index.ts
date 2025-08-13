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

export const mapByTitle: Record<string, StructuredModule> = {
    'Programming Fundamentals': module1,
    'Computer Networks & Internet': module2,
    'Database Management': module3,
};

export const findICTModuleByTitle = (title: string): StructuredModule | undefined => {
    return mapByTitle[title];
};

export const ictModules: StructuredModule[] = [module1, module2, module3];

export default ictModules;
