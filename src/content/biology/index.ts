import module1 from './module1.json';
import module2 from './module2.json';
import module3 from './module3.json';

export interface StructuredModule {
  moduleId?: string;
  moduleTitle?: string;
  subject?: string;
  level?: string;
  objectives?: string[];
  learningPath?: string[];
  lessons?: Array<{
    id: string;
    title: string;
    text?: string;
    knowledgeChecks?: {
      mcq?: Array<any>;
      trueFalse?: Array<any>;
      workedExamples?: Array<any>;
      matching?: Array<any>;
    };
    scenarioChallenges?: Array<any>;
  }>;
  finalAssessment?: unknown;
  xpRules?: unknown;
  milestones?: unknown;
  achievements?: unknown;
  alignment?: unknown;
}


const mapByTitle: Record<string, StructuredModule> = {
  'Cell Structure & Function': module1,
  'Photosynthesis & Respiration': module2,
  'Human Body Systems': module3,
};

export function findBiologyModuleByTitle(title?: string | null): StructuredModule | null {
  if (!title) return null;
  const key = title.trim().toLowerCase();
  for (const [t, mod] of Object.entries(mapByTitle)) {
    if (t.toLowerCase() === key) return mod;
  }
  return null;
}
