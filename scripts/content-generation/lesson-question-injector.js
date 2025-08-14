#!/usr/bin/env node

/**
 * Lesson Question Injector for STEM Learning Application
 * Automatically inserts questions into lesson JSON files using templates
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../../src/content');
const TEMPLATES_FILE = path.join(__dirname, 'subject-question-templates.json');
const OUTPUT_DIR = path.join(__dirname, 'enhanced-lessons');

/**
 * Load question templates
 */
function loadTemplates() {
  try {
    const templatesData = fs.readFileSync(TEMPLATES_FILE, 'utf8');
    return JSON.parse(templatesData);
  } catch (error) {
    console.error(`❌ Error loading templates: ${error.message}`);
    return null;
  }
}

/**
 * Get appropriate questions for a lesson based on topic and difficulty
 */
function getQuestionsForLesson(templates, subject, lessonTitle, targetCount = 15) {
  const subjectTemplates = templates.templates[subject];
  if (!subjectTemplates) {
    console.log(`⚠️  No templates found for subject: ${subject}`);
    return [];
  }
  
  const questions = [];
  const distribution = {
    mcq: Math.floor(targetCount * 0.45), // 45%
    trueFalse: Math.floor(targetCount * 0.20), // 20%
    shortAnswer: Math.floor(targetCount * 0.20), // 20%
    scenario: Math.floor(targetCount * 0.15) // 15%
  };
  
  // Add questions from each type
  Object.entries(distribution).forEach(([type, count]) => {
    const typeTemplates = subjectTemplates[type] || [];
    const selectedQuestions = selectRandomQuestions(typeTemplates, count);
    questions.push(...selectedQuestions);
  });
  
  return questions;
}

/**
 * Select random questions from templates
 */
function selectRandomQuestions(templates, count) {
  const shuffled = [...templates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, templates.length));
}

/**
 * Enhance a lesson with additional questions
 */
function enhanceLesson(lesson, questions, subject) {
  const enhancedLesson = { ...lesson };
  
  // Initialize knowledgeChecks if it doesn't exist
  if (!enhancedLesson.knowledgeChecks) {
    enhancedLesson.knowledgeChecks = {};
  }
  
  // Group questions by type
  const questionsByType = {};
  questions.forEach(q => {
    if (!questionsByType[q.type]) {
      questionsByType[q.type] = [];
    }
    questionsByType[q.type].push(q);
  });
  
  // Add questions to knowledgeChecks
  Object.entries(questionsByType).forEach(([type, typeQuestions]) => {
    if (type === 'mcq') {
      enhancedLesson.knowledgeChecks.mcq = [
        ...(enhancedLesson.knowledgeChecks.mcq || []),
        ...typeQuestions.map(q => ({
          id: q.id,
          type: q.type,
          stem: q.stem,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topic: q.topic,
          wassceCategory: q.wassceCategory,
          ghanaContext: q.ghanaContext,
          tags: q.tags
        }))
      ];
    } else if (type === 'trueFalse') {
      enhancedLesson.knowledgeChecks.trueFalse = [
        ...(enhancedLesson.knowledgeChecks.trueFalse || []),
        ...typeQuestions.map(q => ({
          id: q.id,
          type: q.type,
          statement: q.statement,
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topic: q.topic,
          wassceCategory: q.wassceCategory,
          ghanaContext: q.ghanaContext,
          tags: q.tags
        }))
      ];
    } else if (type === 'shortAnswer') {
      enhancedLesson.knowledgeChecks.shortAnswer = [
        ...(enhancedLesson.knowledgeChecks.shortAnswer || []),
        ...typeQuestions.map(q => ({
          id: q.id,
          type: q.type,
          stem: q.stem,
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          topic: q.topic,
          wassceCategory: q.wassceCategory,
          ghanaContext: q.ghanaContext,
          tags: q.tags
        }))
      ];
    } else if (type === 'scenario') {
      enhancedLesson.knowledgeChecks.scenario = [
        ...(enhancedLesson.knowledgeChecks.scenario || []),
        ...typeQuestions.map(q => ({
          id: q.id,
          type: q.type,
          title: q.title,
          scenario: q.scenario,
          tasks: q.tasks,
          learningObjectives: q.learningObjectives,
          difficulty: q.difficulty,
          topic: q.topic,
          wassceCategory: q.wassceCategory,
          ghanaContext: q.ghanaContext,
          tags: q.tags
        }))
      ];
    }
  });
  
  // Add metadata
  enhancedLesson.enhancedAt = new Date().toISOString();
  enhancedLesson.totalQuestions = Object.values(enhancedLesson.knowledgeChecks)
    .reduce((sum, type) => sum + (Array.isArray(type) ? type.length : 0), 0);
  
  return enhancedLesson;
}

/**
 * Process a module file
 */
function processModule(modulePath, templates, subject) {
  try {
    const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
    const enhancedModule = { ...moduleData };
    
    if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
      // Lesson-based module
      console.log(`  📚 Processing ${moduleData.lessons.length} lessons...`);
      
      enhancedModule.lessons = moduleData.lessons.map(lesson => {
        const questions = getQuestionsForLesson(templates, subject, lesson.title);
        return enhanceLesson(lesson, questions, subject);
      });
      
    } else if (moduleData.questions && Array.isArray(moduleData.questions)) {
      // Question-based module
      console.log(`  📚 Processing module with ${moduleData.questions.length} existing questions...`);
      
      const questions = getQuestionsForLesson(templates, subject, moduleData.title);
      const enhancedLesson = enhanceLesson({
        id: 'main-lesson',
        title: moduleData.title || 'Main Content',
        text: moduleData.content?.text?.introduction || ''
      }, questions, subject);
      
      enhancedModule.lessons = [enhancedLesson];
      
    } else if (moduleData.content?.questions && Array.isArray(moduleData.content.questions)) {
      // Content-based module
      console.log(`  📚 Processing module with ${moduleData.content.questions.length} existing questions...`);
      
      const questions = getQuestionsForLesson(templates, subject, moduleData.title);
      const enhancedLesson = enhanceLesson({
        id: 'main-lesson',
        title: moduleData.title || 'Main Content',
        text: moduleData.content?.text?.introduction || ''
      }, questions, subject);
      
      enhancedModule.lessons = [enhancedLesson];
    }
    
    return enhancedModule;
    
  } catch (error) {
    console.error(`❌ Error processing ${modulePath}: ${error.message}`);
    return null;
  }
}

/**
 * Save enhanced module
 */
function saveEnhancedModule(enhancedModule, subject, originalPath) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filename = path.basename(originalPath, '.json');
  const outputPath = path.join(OUTPUT_DIR, `${subject}-${filename}-enhanced.json`);
  
  fs.writeFileSync(outputPath, JSON.stringify(enhancedModule, null, 2));
  return outputPath;
}

/**
 * Process all modules for a subject
 */
function processSubject(subject, templates) {
  console.log(`🚀 Processing ${subject.toUpperCase()}...`);
  
  const subjectDir = path.join(CONTENT_DIR, subject);
  if (!fs.existsSync(subjectDir)) {
    console.log(`❌ Subject directory not found: ${subjectDir}`);
    return;
  }
  
  const files = fs.readdirSync(subjectDir)
    .filter(file => file.endsWith('.json') && file !== 'index.ts' && !file.includes('quiz'));
  
  const results = [];
  
  files.forEach(file => {
    const modulePath = path.join(subjectDir, file);
    console.log(`📖 Processing ${file}...`);
    
    const enhancedModule = processModule(modulePath, templates, subject);
    if (enhancedModule) {
      const outputPath = saveEnhancedModule(enhancedModule, subject, modulePath);
      results.push({
        file: file,
        originalQuestions: countOriginalQuestions(enhancedModule),
        enhancedQuestions: enhancedModule.totalQuestions,
        outputPath: outputPath
      });
      console.log(`✅ Enhanced ${file} - ${enhancedModule.totalQuestions} total questions`);
    }
  });
  
  return results;
}

/**
 * Count original questions in a module
 */
function countOriginalQuestions(module) {
  if (module.lessons) {
    return module.lessons.reduce((sum, lesson) => {
      if (lesson.knowledgeChecks) {
        return sum + Object.values(lesson.knowledgeChecks)
          .reduce((s, type) => s + (Array.isArray(type) ? type.length : 0), 0);
      }
      return sum;
    }, 0);
  }
  return 0;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting Lesson Question Injection...\n');
  
  // Load templates
  const templates = loadTemplates();
  if (!templates) {
    console.error('❌ Failed to load templates. Exiting.');
    return;
  }
  
  console.log(`📚 Loaded templates for ${Object.keys(templates.templates).length} subjects`);
  
  // Process each subject
  const subjects = Object.keys(templates.templates);
  const allResults = {};
  
  subjects.forEach(subject => {
    console.log(`\n--- Processing ${subject.toUpperCase()} ---`);
    const results = processSubject(subject, templates);
    allResults[subject] = results;
  });
  
  // Generate summary report
  generateSummaryReport(allResults);
  
  console.log('\n🎉 Lesson enhancement complete!');
  console.log(`📁 Check the '${OUTPUT_DIR}' folder for enhanced modules.`);
}

/**
 * Generate summary report
 */
function generateSummaryReport(allResults) {
  const reportPath = path.join(OUTPUT_DIR, 'enhancement-summary.md');
  
  let report = `# Lesson Enhancement Summary\n*Generated on: ${new Date().toISOString()}*\n\n`;
  
  Object.entries(allResults).forEach(([subject, results]) => {
    report += `## ${subject.toUpperCase()}\n\n`;
    
    if (results.length === 0) {
      report += `No modules processed.\n\n`;
      return;
    }
    
    report += `| Module | Original Questions | Enhanced Questions | Increase |\n`;
    report += `|--------|-------------------|-------------------|----------|\n`;
    
    results.forEach(result => {
      const increase = result.enhancedQuestions - result.originalQuestions;
      const increasePercent = ((increase / result.originalQuestions) * 100).toFixed(1);
      report += `| ${result.file} | ${result.originalQuestions} | ${result.enhancedQuestions} | +${increase} (+${increasePercent}%) |\n`;
    });
    
    const totalOriginal = results.reduce((sum, r) => sum + r.originalQuestions, 0);
    const totalEnhanced = results.reduce((sum, r) => sum + r.enhancedQuestions, 0);
    const totalIncrease = totalEnhanced - totalOriginal;
    
    report += `\n**Total**: ${totalOriginal} → ${totalEnhanced} (+${totalIncrease})\n\n`;
  });
  
  fs.writeFileSync(reportPath, report);
  console.log(`📊 Summary report saved to: ${reportPath}`);
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    main();
  } else if (args[0] === '--subject' && args[1]) {
    // Process single subject
    const templates = loadTemplates();
    if (templates) {
      processSubject(args[1], templates);
    }
  } else if (args[0] === '--help') {
    console.log(`
Usage: node lesson-question-injector.js [options]

Options:
  --subject <subject>    Process specific subject only
  --help                 Show this help message

Examples:
  node lesson-question-injector.js                    # Process all subjects
  node lesson-question-injector.js --subject biology # Process biology only
    `);
  } else {
    console.log('❌ Invalid arguments. Use --help for usage information.');
  }
}

module.exports = {
  processSubject,
  enhanceLesson,
  getQuestionsForLesson
};
