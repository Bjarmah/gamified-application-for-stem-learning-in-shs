// Import all subject modules
import { chemistryModules } from './chemistry';
import { ictModules } from './ict';
import { mathematicsModules } from './mathematics';
import { physicsModules } from './physics';
import { biologyModules } from './biology';

// Define interfaces for modules
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

// Combined content type for search and display
export interface SearchableContent {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'module';
  estimatedTime: number;
  xpReward: number;
  tags: string[];
  level: string;
  content: any;
  achievements: any[];
  ghanaContext: any;
}

// Combine all modules
export const allModules: StructuredModule[] = [
  ...chemistryModules,
  ...ictModules,
  ...mathematicsModules,
  ...physicsModules,
  ...biologyModules,
];

// Create searchable content array
export const searchableContent: SearchableContent[] = [
  // Add structured modules
  ...allModules.map(module => ({
    id: module.id,
    title: module.title,
    description: module.description,
    subject: module.subject,
    type: 'module' as const,
    estimatedTime: module.estimatedTime,
    xpReward: module.xpReward,
    tags: module.tags,
    level: module.level,
    content: module.content,
    achievements: module.gamification?.achievements || [],
    ghanaContext: module.ghanaContext,
  })),
];

// Search functions
export const searchContent = (query: string): SearchableContent[] => {
  const searchTerm = query.toLowerCase();

  return searchableContent.filter(content =>
    content.title.toLowerCase().includes(searchTerm) ||
    content.description.toLowerCase().includes(searchTerm) ||
    content.subject.toLowerCase().includes(searchTerm) ||
    content.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    content.ghanaContext?.localExamples.some(example =>
      example.toLowerCase().includes(searchTerm)
    ) ||
    content.ghanaContext?.realWorldApplications.some(app =>
      app.toLowerCase().includes(searchTerm)
    )
  );
};

export const searchBySubject = (subject: string): SearchableContent[] => {
  return searchableContent.filter(content =>
    content.subject.toLowerCase() === subject.toLowerCase()
  );
};

export const searchByType = (type: 'module'): SearchableContent[] => {
  return searchableContent.filter(content => content.type === type);
};

export const searchByTags = (tags: string[]): SearchableContent[] => {
  return searchableContent.filter(content =>
    tags.some(tag => content.tags.includes(tag))
  );
};

// Get content by ID
export const getContentById = (id: string): SearchableContent | undefined => {
  return searchableContent.find(content => content.id === id);
};

// Get modules by subject
export const getModulesBySubject = (subject: string): StructuredModule[] => {
  return allModules.filter(module => module.subject === subject);
};

// Get all subjects
export const getAllSubjects = (): string[] => {
  const subjects = new Set(searchableContent.map(content => content.subject));
  return Array.from(subjects);
};

// Get all levels
export const getAllLevels = (): string[] => {
  const levels = new Set(
    searchableContent
      .filter(content => content.level)
      .map(content => content.level!)
  );
  return Array.from(levels);
};

// Get all tags
export const getAllTags = (): string[] => {
  const tags = new Set(
    searchableContent.flatMap(content => content.tags)
  );
  return Array.from(tags);
};

// Get content statistics
export const getContentStats = () => {
  const totalModules = allModules.length;
  const totalContent = searchableContent.length;

  const subjects = getAllSubjects();
  const levels = getAllLevels();
  const tags = getAllTags();

  // Create subject breakdown, but filter out ICT to replace with biology focus
  const subjectBreakdown = subjects
    .filter(subject => subject !== 'Elective ICT') // Remove ICT
    .map(subject => ({
      subject,
      count: searchBySubject(subject).length,
      modules: searchBySubject(subject).filter(c => c.type === 'module').length,
    }));

  // Ensure biology is prioritized in the breakdown
  const biologySubject = subjectBreakdown.find(s => s.subject === 'Biology');
  if (biologySubject) {
    // Move biology to the front to ensure it appears in featured modules
    const otherSubjects = subjectBreakdown.filter(s => s.subject !== 'Biology');
    subjectBreakdown.length = 0;
    subjectBreakdown.push(biologySubject, ...otherSubjects);
  }

  return {
    totalModules,
    totalContent,
    subjects, // Keep all subjects including Elective ICT for accurate count
    levels,
    tags,
    subjectBreakdown,
    levelBreakdown: levels.map(level => ({
      level,
      count: searchableContent.filter(c => c.level === level).length,
    })),
  };
};

// Export individual subject modules
export { chemistryModules, ictModules, mathematicsModules, physicsModules, biologyModules };

// Export default as searchable content
export default searchableContent;
