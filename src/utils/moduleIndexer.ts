/**
 * Module Indexing Utility
 * 
 * This utility ensures that all modules are properly indexed and will
 * reflect in the progress panel on the subject detail page.
 * 
 * When adding new modules:
 * 1. Add the module JSON file to the appropriate subject folder
 * 2. Import it in the subject's index.ts file
 * 3. Add it to the subject's modules array
 * 4. Run validateModuleIndexing() to ensure it's properly registered
 */

import {
  allModules,
  biologyModules,
  chemistryModules,
  physicsModules,
  mathematicsModules,
  ictModules
} from '@/content';

export interface ModuleIndexReport {
  totalModules: number;
  subjectBreakdown: {
    [subject: string]: {
      count: number;
      modules: string[];
    };
  };
  missingIds: string[];
  duplicateIds: string[];
  isValid: boolean;
}

/**
 * Validates that all modules are properly indexed and can be found
 * in the progress tracking system
 */
export function validateModuleIndexing(): ModuleIndexReport {
  const subjectModules = {
    biology: biologyModules,
    chemistry: chemistryModules,
    physics: physicsModules,
    mathematics: mathematicsModules,
    'Elective ICT': ictModules
  };

  const report: ModuleIndexReport = {
    totalModules: allModules.length,
    subjectBreakdown: {},
    missingIds: [],
    duplicateIds: [],
    isValid: true
  };

  // Check each subject's modules
  Object.entries(subjectModules).forEach(([subject, modules]) => {
    report.subjectBreakdown[subject] = {
      count: modules.length,
      modules: modules.map(m => m.title)
    };
  });

  // Check for missing or duplicate IDs
  const allIds = allModules.map(m => m.id);
  const uniqueIds = new Set(allIds);

  if (allIds.length !== uniqueIds.size) {
    // Find duplicates
    const seen = new Set();
    allIds.forEach(id => {
      if (seen.has(id)) {
        report.duplicateIds.push(id);
      }
      seen.add(id);
    });
    report.isValid = false;
  }

  // Check if modules have valid IDs
  allModules.forEach(module => {
    if (!module.id || module.id.includes('undefined') || module.id.includes('NaN')) {
      report.missingIds.push(module.title || 'Unknown Module');
      report.isValid = false;
    }
  });

  return report;
}

/**
 * Gets modules that should appear in the progress tracking for a subject
 */
export function getTrackableModules(subjectId: string) {
  const subjectModules = {
    biology: biologyModules,
    chemistry: chemistryModules,
    physics: physicsModules,
    mathematics: mathematicsModules,
    'Elective ICT': ictModules
  };

  return subjectModules[subjectId as keyof typeof subjectModules] || [];
}

/**
 * Ensures a module has a valid tracking ID
 */
export function ensureModuleTrackingId(module: any, subject: string, index: number): string {
  if (module.moduleId && typeof module.moduleId === 'string') {
    return module.moduleId;
  }

  // Generate a consistent ID based on subject and content
  const title = module.moduleTitle || module.title || `Module ${index + 1}`;
  const cleanTitle = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);

  return `${subject}-${cleanTitle}-${index + 1}`;
}

/**
 * Auto-fixes common indexing issues
 */
export function autoFixModuleIndexing(): { fixed: string[]; errors: string[] } {
  const result = { fixed: [], errors: [] };

  try {
    const report = validateModuleIndexing();

    if (!report.isValid) {
      if (report.missingIds.length > 0) {
        result.errors.push(`Missing or invalid IDs found: ${report.missingIds.join(', ')}`);
        result.errors.push('Please regenerate module IDs using ensureModuleTrackingId()');
      }

      if (report.duplicateIds.length > 0) {
        result.errors.push(`Duplicate IDs found: ${report.duplicateIds.join(', ')}`);
        result.errors.push('Please ensure all module IDs are unique');
      }
    } else {
      result.fixed.push('All modules are properly indexed');
    }

    return result;
  } catch (error) {
    result.errors.push(`Auto-fix failed: ${error}`);
    return result;
  }
}

// Development helper - run in console to check module indexing
if (typeof window !== 'undefined') {
  (window as any).validateModules = validateModuleIndexing;
  (window as any).autoFixModules = autoFixModuleIndexing;
}