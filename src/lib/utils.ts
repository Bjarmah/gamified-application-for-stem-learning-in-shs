import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format difficulty level to title case
export function formatDifficulty(difficulty: string | null): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (!difficulty) return 'Beginner';

  const normalized = difficulty.toLowerCase();
  switch (normalized) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    default:
      return 'Beginner';
  }
}

// Format duration from minutes to "N minutes"
export function formatDuration(minutes: number | null): string {
  if (!minutes || minutes <= 0) return '15 minutes';
  return `${minutes} minutes`;
}

// Get difficulty color class
export function getDifficultyColor(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): string {
  switch (difficulty) {
    case 'Beginner':
      return "bg-stemGreen/20 text-stemGreen-dark";
    case 'Intermediate':
      return "bg-stemOrange/20 text-stemOrange-dark";
    case 'Advanced':
      return "bg-destructive/20 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Format time limit from seconds to "N minutes"
export function formatTimeLimit(seconds: number | null): string {
  if (!seconds) return '5 minutes';
  return `${Math.ceil(seconds / 60)} minutes`;
}
