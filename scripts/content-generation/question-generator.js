#!/usr/bin/env node

/**
 * Automated Question Generator for STEM Learning Application
 * Generates questions based on standardized templates and content analysis
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TEMPLATES_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'generated-questions');

// Question generation patterns
const QUESTION_PATTERNS = {
  mcq: {
    basic: [
      "What is the main function of {concept}?",
      "Which of the following best describes {concept}?",
      "What happens when {scenario}?",
      "Identify the correct definition of {term}.",
      "What is the primary purpose of {process}?",
      "Which structure is responsible for {function}?",
      "What type of transport is {process}?",
      "In which organelle does {process} occur?",
      "What is the role of {component} in {system}?",
      "Which statement about {concept} is correct?"
    ],
    intermediate: [
      "How does {concept} relate to {related_concept}?",
      "What would be the result if {condition} changes?",
      "Which factor most significantly affects {outcome}?",
      "Compare and contrast {concept1} and {concept2}.",
      "What evidence supports the idea that {statement}?",
      "How does {process} contribute to {function}?",
      "What would happen if {component} was removed?",
      "Which condition would lead to {outcome}?",
      "How do {concept1} and {concept2} work together?",
      "What is the relationship between {factor} and {result}?"
    ],
    advanced: [
      "Analyze the implications of {complex_scenario}.",
      "Evaluate the effectiveness of {method} in {context}.",
      "What conclusions can be drawn from {data}?",
      "How would you design an experiment to test {hypothesis}?",
      "What are the limitations of {theory} in {real_world_context}?",
      "How would {change} affect the overall {system}?",
      "What are the long-term consequences of {action}?",
      "How does {theory} explain {phenomenon}?",
      "What alternative approaches could be used for {goal}?",
      "How would you modify {process} to achieve {outcome}?"
    ]
  },
  trueFalse: {
    basic: [
      "{concept} is essential for {process}.",
      "{term} refers to {definition}.",
      "{scenario} always results in {outcome}."
    ],
    intermediate: [
      "The relationship between {concept1} and {concept2} is {relationship_type}.",
      "{method} can be applied to {different_context}.",
      "{condition} influences {outcome} in {specific_way}."
    ],
    advanced: [
      "{complex_theory} explains {phenomenon} completely.",
      "{advanced_concept} is more effective than {alternative} in {context}.",
      "{real_world_application} demonstrates {scientific_principle}."
    ]
  },
  fillInTheBlank: {
    basic: [
      "The process of {concept} involves {blank}.",
      "{term} is defined as {blank}.",
      "When {scenario}, the result is {blank}."
    ],
    intermediate: [
      "The relationship between {concept1} and {concept2} can be expressed as {blank}.",
      "In {context}, {process} requires {blank}.",
      "The main difference between {concept1} and {concept2} is {blank}."
    ],
    advanced: [
      "The complex interaction between {multiple_concepts} results in {blank}.",
      "Advanced analysis of {phenomenon} reveals {blank}.",
      "The theoretical framework suggests that {blank}."
    ]
  },
  shortAnswer: {
    intermediate: [
      "Explain how {concept} contributes to {process} in 2-3 sentences.",
      "Describe the relationship between {concept1} and {concept2}.",
      "What are the key factors that influence {outcome}?",
      "How does {method} work in {context}?"
    ],
    advanced: [
      "Analyze the implications of {complex_scenario} for {real_world_application}.",
      "Evaluate the effectiveness of {approach} in addressing {challenge}.",
      "What conclusions can be drawn from {data} about {phenomenon}?",
      "How would you apply {theory} to solve {practical_problem}?"
    ]
  },
  problemSolving: {
    intermediate: [
      "Calculate {quantity} given {given_information}.",
      "Determine {unknown} using {formula} and {data}.",
      "Find {result} when {conditions} are applied to {system}."
    ],
    advanced: [
      "Design a solution for {complex_problem} considering {multiple_factors}.",
      "Analyze {scenario} and determine the optimal {approach}.",
      "Evaluate {multiple_solutions} and recommend the best option for {context}."
    ]
  }
};

// Ghana context examples by subject
const GHANA_CONTEXTS = {
  biology: [
    "cassava farming in the Ashanti region",
    "cocoa production in Western Ghana",
    "traditional medicine practices",
    "coastal ecosystem conservation",
    "agricultural biotechnology in Ghana"
  ],
  chemistry: [
    "gold mining and processing",
    "petroleum refining in Tema",
    "traditional soap making",
    "food preservation methods",
    "water treatment in Accra"
  ],
  physics: [
    "hydroelectric power at Akosombo Dam",
    "solar energy in northern Ghana",
    "transportation systems in Kumasi",
    "construction projects in Accra",
    "renewable energy initiatives"
  ],
  mathematics: [
    "business calculations in Makola market",
    "construction planning in Ghana",
    "financial planning for small businesses",
    "agricultural yield calculations",
    "transportation route optimization"
  ],
  ict: [
    "mobile money systems like M-Pesa",
    "digital agriculture platforms",
    "e-learning in rural schools",
    "e-commerce in Ghana",
    "digital government services"
  ]
};

// Content generation helpers
const CONTENT_TEMPLATES = {
  biology: {
    'cell structure': {
      scenario: 'a cell is placed in a hypotonic solution',
      process: 'cell division',
      function: 'energy production',
      component: 'mitochondria',
      system: 'cellular respiration',
      condition: 'oxygen levels decrease',
      outcome: 'cell death',
      relatedConcept: 'mitosis',
      concept1: 'prokaryotic cells',
      concept2: 'eukaryotic cells',
      statement: 'cells require energy to function',
      method: 'microscopy',
      context: 'medical research',
      data: 'cell growth rates',
      hypothesis: 'cells grow faster in nutrient-rich media',
      theory: 'cell theory',
      complexScenario: 'a cell loses its nucleus',
      phenomenon: 'cell differentiation',
      goal: 'understanding cell function',
      action: 'removing cell organelles',
      change: 'temperature increase',
      factor: 'nutrient availability',
      result: 'increased cell growth'
    },
    'membrane transport': {
      scenario: 'substances move across a membrane',
      process: 'osmosis',
      function: 'selective permeability',
      component: 'transport proteins',
      system: 'cell membrane',
      condition: 'concentration gradient exists',
      outcome: 'net movement of molecules',
      relatedConcept: 'diffusion',
      concept1: 'passive transport',
      concept2: 'active transport',
      statement: 'membranes control what enters and exits cells',
      method: 'dialysis',
      context: 'kidney function',
      data: 'membrane permeability measurements',
      hypothesis: 'membrane proteins facilitate transport',
      theory: 'fluid mosaic model',
      complexScenario: 'a cell membrane becomes damaged',
      phenomenon: 'membrane potential',
      goal: 'maintaining cell homeostasis',
      action: 'blocking transport channels',
      change: 'pH alteration',
      factor: 'membrane composition',
      result: 'altered transport rates'
    },
    'genetics': {
      scenario: 'a gene mutation occurs',
      process: 'DNA replication',
      function: 'protein synthesis',
      component: 'chromosomes',
      system: 'genetic inheritance',
      condition: 'mutation present',
      outcome: 'altered protein function',
      relatedConcept: 'transcription',
      concept1: 'dominant traits',
      concept2: 'recessive traits',
      statement: 'genes control inherited characteristics',
      method: 'genetic testing',
      context: 'medical diagnosis',
      data: 'inheritance patterns',
      hypothesis: 'mutations affect protein function',
      theory: 'central dogma',
      complexScenario: 'multiple gene interactions',
      phenomenon: 'genetic variation',
      goal: 'understanding inheritance',
      action: 'gene editing',
      change: 'mutation rate',
      factor: 'environmental factors',
      result: 'phenotype changes'
    },
    'physiology': {
      scenario: 'body temperature rises',
      process: 'homeostasis',
      function: 'regulation',
      component: 'organs',
      system: 'nervous system',
      condition: 'stress response',
      outcome: 'increased heart rate',
      relatedConcept: 'feedback loops',
      concept1: 'positive feedback',
      concept2: 'negative feedback',
      statement: 'the body maintains internal balance',
      method: 'physiological monitoring',
      context: 'health assessment',
      data: 'vital signs',
      hypothesis: 'stress affects body systems',
      theory: 'homeostasis theory',
      complexScenario: 'multiple system failure',
      phenomenon: 'adaptation',
      goal: 'maintaining health',
      action: 'exercise',
      change: 'environmental conditions',
      factor: 'genetic predisposition',
      result: 'health outcomes'
    }
  }
};

/**
 * Generate realistic content based on topic and difficulty
 */
function generateRealisticContent(type, topic, difficulty, subject) {
  const template = CONTENT_TEMPLATES[subject]?.[topic] || CONTENT_TEMPLATES[subject]?.['cell structure'] || CONTENT_TEMPLATES.biology['cell structure'];

  return {
    ...template,
    correctAnswer: generateCorrectAnswer(topic, difficulty),
    explanation: generateExplanation(topic, difficulty, subject),
    isTrue: Math.random() > 0.5
  };
}

/**
 * Generate realistic options for MCQ questions
 */
function generateRealisticOptions(topic, correctAnswer, difficulty) {
  const options = {
    A: generateDistractor(topic, 'A'),
    B: correctAnswer,
    C: generateDistractor(topic, 'C'),
    D: generateDistractor(topic, 'D')
  };

  return options;
}

/**
 * Generate distractors (incorrect options)
 */
function generateDistractor(topic, option) {
  const distractors = {
    'cell structure': {
      A: 'Only found in animal cells',
      C: 'Not essential for cell function',
      D: 'Located outside the cell membrane'
    },
    'membrane transport': {
      A: 'Requires energy input',
      C: 'Only occurs in one direction',
      D: 'Involves breaking down molecules'
    }
  };

  return distractors[topic]?.[option] || `Incorrect option about ${topic}`;
}

/**
 * Generate correct answers based on topic and difficulty
 */
function generateCorrectAnswer(topic, difficulty) {
  const answers = {
    'cell structure': {
      basic: 'The basic unit of life',
      intermediate: 'A complex system of organelles working together',
      advanced: 'A highly organized structure with specialized compartments for different functions'
    },
    'membrane transport': {
      basic: 'Movement of substances across membranes',
      intermediate: 'Selective movement of molecules through membrane proteins',
      advanced: 'Regulated transport mechanisms that maintain cellular homeostasis'
    },
    'genetics': {
      basic: 'The study of inherited characteristics',
      intermediate: 'The molecular basis of inheritance and gene expression',
      advanced: 'Complex interactions between genes, environment, and phenotype expression'
    },
    'physiology': {
      basic: 'The study of how living organisms function',
      intermediate: 'The coordinated function of organ systems to maintain homeostasis',
      advanced: 'Complex regulatory mechanisms that adapt to changing conditions'
    },
    'organelles': {
      basic: 'Specialized structures within cells',
      intermediate: 'Organized compartments with specific functions',
      advanced: 'Highly specialized structures that work together for cell survival'
    },
    'mitosis': {
      basic: 'Cell division process',
      intermediate: 'Controlled cell division for growth and repair',
      advanced: 'Complex process ensuring accurate genetic material distribution'
    },
    'homeostasis': {
      basic: 'Maintaining internal balance',
      intermediate: 'Dynamic equilibrium maintained by feedback systems',
      advanced: 'Complex regulatory networks maintaining optimal conditions'
    }
  };

  return answers[topic]?.[difficulty] || `Answer about ${topic}`;
}

/**
 * Generate explanations based on topic and difficulty
 */
function generateExplanation(topic, difficulty, subject) {
  const explanations = {
    'cell structure': {
      basic: `This question tests basic understanding of ${topic} and its fundamental role in biology.`,
      intermediate: `This question requires understanding of how ${topic} components work together and their relationships.`,
      advanced: `This advanced question tests deep understanding of ${topic} complexity and its implications for cellular function.`
    },
    'membrane transport': {
      basic: `This question tests basic understanding of ${topic} processes and their importance for cell survival.`,
      intermediate: `This question requires understanding of ${topic} mechanisms and their regulation.`,
      advanced: `This advanced question tests understanding of ${topic} complexity and its role in cellular homeostasis.`
    }
  };

  return explanations[topic]?.[difficulty] || `This question tests understanding of ${topic} in the context of ${subject}.`;
}

/**
 * Generate a question based on template and context
 */
function generateQuestion(template, subject, topic, difficulty, questionNumber) {
  const ghanaContext = GHANA_CONTEXTS[subject][Math.floor(Math.random() * GHANA_CONTEXTS[subject].length)];

  // Generate realistic content based on topic and difficulty
  const content = generateRealisticContent(template.type, topic, difficulty, subject);

  // Replace placeholders with actual content
  let questionText = template.pattern;
  questionText = questionText.replace(/{concept}/g, topic);
  questionText = questionText.replace(/{scenario}/g, content.scenario);
  questionText = questionText.replace(/{process}/g, content.process);
  questionText = questionText.replace(/{function}/g, content.function);
  questionText = questionText.replace(/{component}/g, content.component);
  questionText = questionText.replace(/{system}/g, content.system);
  questionText = questionText.replace(/{condition}/g, content.condition);
  questionText = questionText.replace(/{outcome}/g, content.outcome);
  questionText = questionText.replace(/{related_concept}/g, content.relatedConcept);
  questionText = questionText.replace(/{concept1}/g, content.concept1);
  questionText = questionText.replace(/{concept2}/g, content.concept2);
  questionText = questionText.replace(/{statement}/g, content.statement);
  questionText = questionText.replace(/{method}/g, content.method);
  questionText = questionText.replace(/{context}/g, content.context);
  questionText = questionText.replace(/{data}/g, content.data);
  questionText = questionText.replace(/{hypothesis}/g, content.hypothesis);
  questionText = questionText.replace(/{theory}/g, content.theory);
  questionText = questionText.replace(/{real_world_context}/g, ghanaContext);
  questionText = questionText.replace(/{complex_scenario}/g, content.complexScenario);
  questionText = questionText.replace(/{phenomenon}/g, content.phenomenon);
  questionText = questionText.replace(/{goal}/g, content.goal);
  questionText = questionText.replace(/{action}/g, content.action);
  questionText = questionText.replace(/{change}/g, content.change);
  questionText = questionText.replace(/{factor}/g, content.factor);
  questionText = questionText.replace(/{result}/g, content.result);
  questionText = questionText.replace(/{term}/g, topic);
  questionText = questionText.replace(/{blank}/g, '_____');

  // Generate unique ID
  const questionId = `${template.type}-${subject}-${topic.replace(/\s+/g, '-')}-${questionNumber}`;

  // Create question object based on type
  const question = {
    id: questionId,
    type: template.type,
    difficulty: difficulty,
    topic: topic,
    ghanaContext: ghanaContext,
    stem: questionText
  };

  // Add type-specific fields
  if (template.type === 'mcq') {
    question.options = generateRealisticOptions(topic, content.correctAnswer, difficulty);
    question.answer = 'B'; // Default answer
    question.explanation = content.explanation;
  } else if (template.type === 'trueFalse') {
    question.statement = questionText;
    question.answer = content.isTrue;
    question.explanation = content.explanation;
  } else if (template.type === 'fillInTheBlank') {
    question.stem = questionText;
    question.answer = content.correctAnswer;
    question.explanation = content.explanation;
  } else if (template.type === 'shortAnswer') {
    question.stem = questionText;
    question.answer = content.correctAnswer;
    question.explanation = content.explanation;
  } else if (template.type === 'problemSolving') {
    question.stem = questionText;
    question.answer = content.correctAnswer;
    question.explanation = content.explanation;
  }

  return question;
}

/**
 * Generate questions for a specific lesson
 */
function generateLessonQuestions(subject, lessonTitle, topics, targetCount = 20) {
  const questions = [];
  let questionNumber = 1;

  // Calculate distribution based on target
  const distribution = {
    mcq: Math.floor(targetCount * 0.45), // 45%
    trueFalse: Math.floor(targetCount * 0.20), // 20%
    fillInTheBlank: Math.floor(targetCount * 0.15), // 15%
    shortAnswer: Math.floor(targetCount * 0.10), // 10%
    problemSolving: Math.floor(targetCount * 0.10) // 10%
  };

  // Generate questions for each type
  Object.entries(distribution).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const difficulty = i < count * 0.4 ? 'basic' : i < count * 0.8 ? 'intermediate' : 'advanced';

      const template = getQuestionTemplate(type, difficulty);
      if (template) {
        const question = generateQuestion(template, subject, topic, difficulty, questionNumber++);
        questions.push(question);
      }
    }
  });

  return questions;
}

/**
 * Get question template based on type and difficulty
 */
function getQuestionTemplate(type, difficulty) {
  const patterns = QUESTION_PATTERNS[type];
  if (!patterns || !patterns[difficulty]) return null;

  const pattern = patterns[difficulty][Math.floor(Math.random() * patterns[difficulty].length)];

  return {
    type: type,
    pattern: pattern,
    difficulty: difficulty
  };
}

/**
 * Generate complete question set for a module
 */
function generateModuleQuestions(subject, moduleTitle, lessons) {
  const moduleQuestions = {};

  lessons.forEach(lesson => {
    console.log(`  📖 Processing lesson: ${lesson.title}`);

    // Extract topics from lesson content or use defaults
    const topics = extractTopicsFromLesson(lesson, subject);

    // Check if lesson already has questions
    const existingQuestions = lesson.knowledgeChecks ?
      Object.values(lesson.knowledgeChecks).flat().length : 0;

    // Calculate how many additional questions we need
    const targetCount = Math.max(15 - existingQuestions, 8); // At least 8 new questions

    console.log(`    📊 Existing questions: ${existingQuestions}, Target additional: ${targetCount}`);

    const questions = generateLessonQuestions(subject, lesson.title, topics, targetCount);
    moduleQuestions[lesson.id] = {
      lessonTitle: lesson.title,
      existingQuestions: existingQuestions,
      newQuestions: questions.length,
      questions: questions
    };
  });

  return moduleQuestions;
}

/**
 * Extract topics from lesson content (simplified)
 */
function extractTopicsFromLesson(lesson, subject) {
  // This is a simplified topic extraction - in practice, you'd use NLP
  const commonTopics = {
    biology: ['cell structure', 'genetics', 'ecosystems', 'evolution', 'physiology', 'membrane transport', 'organelles', 'mitosis', 'homeostasis'],
    chemistry: ['atomic structure', 'bonding', 'reactions', 'acids', 'bases', 'molecules', 'chemical equations', 'stoichiometry'],
    physics: ['motion', 'forces', 'energy', 'waves', 'electricity', 'mechanics', 'thermodynamics', 'optics'],
    mathematics: ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry', 'equations', 'functions', 'graphs'],
    ict: ['programming', 'networks', 'databases', 'algorithms', 'web development', 'computer systems', 'data structures']
  };

  // Try to extract topics from lesson text if available
  if (lesson.text) {
    const text = lesson.text.toLowerCase();
    const subjectTopics = commonTopics[subject] || [];

    // Find which topics are mentioned in the lesson
    const mentionedTopics = subjectTopics.filter(topic =>
      text.includes(topic.replace(' ', '')) ||
      text.includes(topic.split(' ')[0]) ||
      text.includes(topic.split(' ')[1])
    );

    if (mentionedTopics.length > 0) {
      return mentionedTopics;
    }
  }

  // If no specific topics found, use lesson title to determine relevant topics
  const lessonTitle = lesson.title.toLowerCase();
  if (lessonTitle.includes('membrane') || lessonTitle.includes('transport')) {
    return ['membrane transport'];
  } else if (lessonTitle.includes('nucleus') || lessonTitle.includes('genetic')) {
    return ['genetics', 'cell structure'];
  } else if (lessonTitle.includes('organelle')) {
    return ['organelles', 'cell structure'];
  } else if (lessonTitle.includes('division') || lessonTitle.includes('mitosis')) {
    return ['mitosis', 'cell structure'];
  } else if (lessonTitle.includes('photosynthesis')) {
    return ['ecosystems', 'physiology'];
  } else if (lessonTitle.includes('respiration')) {
    return ['physiology', 'cell structure'];
  } else if (lessonTitle.includes('energy')) {
    return ['physiology', 'ecosystems'];
  } else if (lessonTitle.includes('circulatory') || lessonTitle.includes('respiratory') || lessonTitle.includes('coordination')) {
    return ['physiology', 'homeostasis'];
  }

  return commonTopics[subject] || ['cell structure'];
}

/**
 * Save generated questions to file
 */
function saveQuestions(subject, moduleTitle, questions) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const filename = `${subject}-${moduleTitle.replace(/\s+/g, '-')}-questions.json`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const output = {
    subject: subject,
    moduleTitle: moduleTitle,
    generatedAt: new Date().toISOString(),
    totalQuestions: Object.values(questions).reduce((sum, lesson) => sum + lesson.questions.length, 0),
    lessons: questions
  };

  fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
  console.log(`✅ Generated ${output.totalQuestions} questions for ${moduleTitle}`);

  return filepath;
}

/**
 * Main generation function
 */
function generateQuestionsForSubject(subject) {
  console.log(`🚀 Generating questions for ${subject.toUpperCase()}...`);

  const subjectDir = path.join(__dirname, '../../src/content', subject);
  if (!fs.existsSync(subjectDir)) {
    console.log(`❌ Subject directory not found: ${subjectDir}`);
    return;
  }

  const files = fs.readdirSync(subjectDir).filter(file => file.endsWith('.json') && file !== 'index.ts');

  files.forEach(file => {
    try {
      const modulePath = path.join(subjectDir, file);
      const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));

      // Skip quiz files and index files
      if (file.includes('quiz') || file === 'index.ts') {
        console.log(`⏭️  Skipping ${file} (quiz or index file)`);
        return;
      }

      if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
        console.log(`📚 Processing ${file} with ${moduleData.lessons.length} lessons...`);
        const questions = generateModuleQuestions(subject, moduleData.moduleTitle || moduleData.title, moduleData.lessons);
        const outputPath = saveQuestions(subject, moduleData.moduleTitle || moduleData.title, questions);
        console.log(`📁 Saved to: ${outputPath}`);
      } else if (moduleData.questions && Array.isArray(moduleData.questions)) {
        console.log(`📚 Processing ${file} with ${moduleData.questions.length} existing questions...`);
        // Convert to lesson format for consistency
        const lesson = {
          id: 'main-lesson',
          title: moduleData.title || 'Main Content',
          text: moduleData.content?.text?.introduction || '',
          knowledgeChecks: {
            existing: moduleData.questions
          }
        };
        const questions = generateModuleQuestions(subject, moduleData.title, [lesson]);
        const outputPath = saveQuestions(subject, moduleData.title, questions);
        console.log(`📁 Saved to: ${outputPath}`);
      } else if (moduleData.content?.questions && Array.isArray(moduleData.content.questions)) {
        console.log(`📚 Processing ${file} with ${moduleData.content.questions.length} existing questions...`);
        // Convert to lesson format for consistency
        const lesson = {
          id: 'main-lesson',
          title: moduleData.title || 'Main Content',
          text: moduleData.content?.text?.introduction || '',
          knowledgeChecks: {
            existing: moduleData.content.questions
          }
        };
        const questions = generateModuleQuestions(subject, moduleData.title, [lesson]);
        const outputPath = saveQuestions(subject, moduleData.title, questions);
        console.log(`📁 Saved to: ${outputPath}`);
      } else {
        console.log(`⚠️  No lessons or questions found in ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
    }
  });
}

/**
 * Generate questions for all subjects
 */
function generateAllQuestions() {
  const subjects = ['biology', 'chemistry', 'physics', 'mathematics', 'ict'];

  console.log('🎯 Starting Question Generation for All Subjects\n');

  subjects.forEach(subject => {
    generateQuestionsForSubject(subject);
    console.log('');
  });

  console.log('🎉 Question generation complete!');
  console.log(`📁 Check the '${OUTPUT_DIR}' folder for generated files.`);
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    generateAllQuestions();
  } else if (args[0] === '--subject' && args[1]) {
    generateQuestionsForSubject(args[1]);
  } else if (args[0] === '--help') {
    console.log(`
Usage: node question-generator.js [options]

Options:
  --subject <subject>    Generate questions for specific subject only
  --help                 Show this help message

Examples:
  node question-generator.js                    # Generate for all subjects
  node question-generator.js --subject biology # Generate for biology only
    `);
  } else {
    console.log('❌ Invalid arguments. Use --help for usage information.');
  }
}

module.exports = {
  generateQuestionsForSubject,
  generateAllQuestions,
  generateLessonQuestions,
  saveQuestions
};
