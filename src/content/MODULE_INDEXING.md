# Module Indexing System

This document explains how modules are indexed and tracked for progress in the STEM Learning application.

## How Module Indexing Works

The module indexing system ensures that all educational modules are properly registered and can be tracked in the progress panel on subject detail pages.

### Architecture

1. **Subject-specific index files** (`src/content/{subject}/index.ts`)
   - Import individual module JSON files
   - Convert them to the StructuredModule interface
   - Generate consistent, trackable IDs
   - Export as arrays for the main content system

2. **Main content aggregator** (`src/content/index.ts`)
   - Imports all subject modules
   - Combines them into a unified `allModules` array
   - Creates searchable content for the application

3. **Module hooks** (`src/hooks/use-modules.tsx`)
   - Maps subject IDs to their local modules
   - Fetches modules for display in subject detail pages
   - Falls back to database if local modules not available

4. **Progress tracking** (`src/pages/SubjectDetail.tsx`)
   - Uses modules from the indexing system
   - Tracks completion status in user progress
   - Displays progress in the subject detail panel

## Adding New Modules

When adding a new module to any subject:

### Step 1: Create the Module JSON
Add your module JSON file to the appropriate subject folder:
```
src/content/{subject}/module4.json
```

### Step 2: Update the Subject Index
Edit `src/content/{subject}/index.ts`:

```typescript
// Import the new module
import module4 from './module4.json';

// Update the modules array
export const {subject}Modules: StructuredModule[] = [
  convert{Subject}Module(module1, 0),
  convert{Subject}Module(module2, 1),
  convert{Subject}Module(module3, 2),
  convert{Subject}Module(module4, 3), // Add new module
];

// Update the title map if needed
const mapByTitle: Record<string, StructuredModule> = {
  'Existing Module 1': convert{Subject}Module(module1, 0),
  'Existing Module 2': convert{Subject}Module(module2, 1),
  'Existing Module 3': convert{Subject}Module(module3, 2),
  'New Module Title': convert{Subject}Module(module4, 3), // Add new mapping
};

// Export the new module
export { module1, module2, module3, module4 };
```

### Step 3: Verify Indexing
The module will automatically be:
- ✅ Added to the main content system
- ✅ Available in the useModules hook
- ✅ Displayed in subject detail pages
- ✅ Trackable in progress system

## Module ID Generation

Modules now use consistent IDs generated from their titles:
- Format: `{subject}-{clean-title}`
- Example: `biology-cell-structure-function`
- Fallback: `{subject}-module-{index}` if no title available

## Validation

Use the module indexing utility to validate your setup:

```typescript
import { validateModuleIndexing, autoFixModuleIndexing } from '@/utils/moduleIndexer';

// Check if all modules are properly indexed
const report = validateModuleIndexing();
console.log(report);

// Auto-fix common issues
const result = autoFixModuleIndexing();
console.log(result);
```

Or run in browser console:
```javascript
window.validateModules();
window.autoFixModules();
```

## Troubleshooting

### Module Not Appearing in Progress Panel
1. Check if module is properly imported in subject index
2. Verify module has a valid ID (not random/undefined)
3. Ensure subject mapping includes the module
4. Run validation utility to check for issues

### Duplicate Module IDs
1. Check that all modules have unique titles or manual IDs
2. Run `autoFixModuleIndexing()` for guidance
3. Update module titles or add explicit `moduleId` in JSON

### Progress Not Tracking
1. Verify module ID matches between content and database
2. Check that user_progress table uses the same module IDs
3. Ensure RLS policies allow progress reading/writing

## Best Practices

1. **Consistent Naming**: Use descriptive, unique titles for modules
2. **Index Order**: Add new modules at the end to maintain order
3. **Validation**: Always run validation after adding modules
4. **Testing**: Check subject detail page shows new modules
5. **Progress**: Verify progress tracking works for new modules

## ICT Subject Note

The ICT subject uses a different structure where modules are already in the correct format in JSON files, so no conversion function is needed. Simply add the module to the imports and exports arrays.