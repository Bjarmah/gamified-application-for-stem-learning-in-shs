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

// Format duration to "N minutes"
export function formatDuration(minutes: number | null): string {
  if (!minutes) return '30 minutes';
  return `${minutes} minutes`;
}

// Format time limit from seconds to "N minutes"
export function formatTimeLimit(seconds: number | null): string {
  if (!seconds) return '5 minutes';
  return `${Math.ceil(seconds / 60)} minutes`;
}
