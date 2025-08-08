export interface User {
    id: string;
    email: string;
    full_name?: string;
    school?: string;
    role: 'student' | 'teacher' | 'admin';
}

export interface Subject {
    id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
}

export interface Module {
    id: string;
    title: string;
    description?: string;
    content?: string;
    difficulty_level?: string;
    estimated_duration?: number;
    order_index?: number;
    subject_id: string;
    subject?: Subject;
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: any[];
    time_limit?: number;
    passing_score?: number;
    module_id?: string;
    module?: Module;
}

export interface UserProgress {
    id: string;
    user_id: string;
    module_id: string;
    completed: boolean;
    score?: number;
    time_spent?: number;
    last_accessed?: string;
}

export interface QuizAttempt {
    id: string;
    user_id: string;
    quiz_id: string;
    answers: any;
    score: number;
    correct_answers: number;
    total_questions: number;
    time_spent: number;
    completed_at?: string;
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ContentType = 'module' | 'quiz' | 'lab';
export type UserRole = 'student' | 'teacher' | 'admin';

export interface SearchFilters {
    subjects: string[];
    difficulty: string;
    type: string[];
}

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    subject: string;
    duration: string;
    difficulty: DifficultyLevel;
    type: ContentType;
    isCompleted?: boolean;
    hasQuiz?: boolean;
}
