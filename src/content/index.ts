// Import all subject modules
import { chemistryModules } from './chemistry';
import { ictModules } from './ict';
import { mathematicsModules } from './mathematics';
import { physicsModules } from './physics';
import { biologyModules } from './biology';

// Import TryHackMe-style rooms
import atomicStructureRoom from './chemistry/module1_thm.json';
import programmingRoom from './ict/module1_thm.json';
import quadraticRoom from './mathematics/module1_thm.json';
import forcesMotionRoom from './physics/module1_thm.json';

// Import room index
import thmRoomsIndex from './thm_rooms_index.json';

// Define interfaces for both module types
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

export interface TryHackMeRoom {
  roomId: string;
  roomName: string;
  difficulty: string;
  category: string;
  tags: string[];
  description: string;
  estimatedTime: string;
  points: number;
  creator: string;
  status: string;
  tasks: Array<{
    taskId: string;
    taskNumber: number;
    title: string;
    description: string;
    questions: Array<{
      questionId: string;
      type: string;
      question: string;
      options?: string[];
      correctAnswer: number | string;
      explanation: string;
      points: number;
    }>;
    hints: string[];
    completionMessage: string;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
  }>;
  roomInfo: {
    prerequisites: string;
    tools: string;
    learningOutcomes: string[];
    estimatedCompletionTime: string;
    difficultyProgression: string;
    relatedRooms: string[];
  };
  ghanaContext: {
    localExamples: string[];
    culturalConnections: string[];
    realWorldApplications: string[];
  };
}

// Combined content type for search and display
export interface SearchableContent {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'module' | 'room';
  difficulty?: string;
  estimatedTime: string | number;
  points?: number;
  xpReward?: number;
  tags: string[];
  category?: string;
  level?: string;
  content?: any;
  achievements?: any[];
  ghanaContext?: any;
}

// Combine all modules
export const allModules: StructuredModule[] = [
  ...chemistryModules,
  ...ictModules,
  ...mathematicsModules,
  ...physicsModules,
  ...biologyModules,
];

// Combine all TryHackMe rooms
export const allRooms: TryHackMeRoom[] = [
  atomicStructureRoom,
  programmingRoom,
  quadraticRoom,
  forcesMotionRoom,
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
    achievements: module.gamification.achievements,
    ghanaContext: module.ghanaContext,
  })),
  
  // Add TryHackMe rooms
  ...allRooms.map(room => ({
    id: room.roomId,
    title: room.roomName,
    description: room.description,
    subject: room.category,
    type: 'room' as const,
    difficulty: room.difficulty,
    estimatedTime: room.estimatedTime,
    points: room.points,
    tags: room.tags,
    category: room.category,
    content: room.tasks,
    achievements: room.achievements,
    ghanaContext: room.ghanaContext,
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

export const searchByDifficulty = (difficulty: string): SearchableContent[] => {
  return searchableContent.filter(content => 
    content.difficulty?.toLowerCase() === difficulty.toLowerCase()
  );
};

export const searchByType = (type: 'module' | 'room'): SearchableContent[] => {
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

// Get rooms by category
export const getRoomsByCategory = (category: string): TryHackMeRoom[] => {
  return allRooms.filter(room => room.category === category);
};

// Get all subjects
export const getAllSubjects = (): string[] => {
  const subjects = new Set(searchableContent.map(content => content.subject));
  return Array.from(subjects);
};

// Get all difficulties
export const getAllDifficulties = (): string[] => {
  const difficulties = new Set(
    searchableContent
      .filter(content => content.difficulty)
      .map(content => content.difficulty!)
  );
  return Array.from(difficulties);
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
  const totalRooms = allRooms.length;
  const totalContent = searchableContent.length;
  
  const subjects = getAllSubjects();
  const difficulties = getAllDifficulties();
  const tags = getAllTags();
  
  return {
    totalModules,
    totalRooms,
    totalContent,
    subjects,
    difficulties,
    tags,
    subjectBreakdown: subjects.map(subject => ({
      subject,
      count: searchBySubject(subject).length,
      modules: searchBySubject(subject).filter(c => c.type === 'module').length,
      rooms: searchBySubject(subject).filter(c => c.type === 'room').length,
    })),
    difficultyBreakdown: difficulties.map(difficulty => ({
      difficulty,
      count: searchByDifficulty(difficulty).length,
    })),
  };
};

// Export individual subject modules
export { chemistryModules, ictModules, mathematicsModules, physicsModules, biologyModules };

// Export TryHackMe rooms
export { allRooms as thmRooms, thmRoomsIndex };

// Export default as searchable content
export default searchableContent;
