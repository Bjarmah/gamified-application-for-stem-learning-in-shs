#!/usr/bin/env node

/**
 * Template Generator for STEM Learning Application
 * Automatically generates comprehensive question templates for all subjects
 */

const fs = require('fs');
const path = require('path');

// Template structure
const TEMPLATE_STRUCTURE = {
  biology: {
    topics: ['cell structure', 'genetics', 'ecosystems', 'evolution', 'physiology', 'biotechnology'],
    wassceCategories: ['Cell Biology', 'Genetics', 'Ecology', 'Human Biology', 'Evolution', 'Modern Biology'],
    ghanaContexts: [
      'cassava farming in the Ashanti region',
      'cocoa production in Western Ghana',
      'traditional medicine practices',
      'coastal ecosystem conservation',
      'agricultural biotechnology in Ghana',
      'malaria prevention in rural Ghana'
    ]
  },
  chemistry: {
    topics: ['atomic structure', 'chemical bonding', 'reactions', 'acids and bases', 'organic chemistry', 'electrochemistry'],
    wassceCategories: ['Atomic Structure', 'Chemical Bonding', 'Chemical Kinetics', 'Acids & Bases', 'Organic Chemistry', 'Electrochemistry'],
    ghanaContexts: [
      'gold mining and processing',
      'petroleum refining in Tema',
      'traditional soap making',
      'food preservation methods',
      'water treatment in Accra',
      'industrial chemistry in Ghana'
    ]
  },
  physics: {
    topics: ['mechanics', 'electricity', 'waves', 'energy', 'thermodynamics', 'optics'],
    wassceCategories: ['Mechanics', 'Electricity', 'Waves', 'Energy', 'Thermodynamics', 'Optics'],
    ghanaContexts: [
      'hydroelectric power at Akosombo Dam',
      'solar energy in northern Ghana',
      'transportation systems in Kumasi',
      'construction projects in Accra',
      'renewable energy initiatives',
      'infrastructure development'
    ]
  },
  mathematics: {
    topics: ['algebra', 'geometry', 'calculus', 'statistics', 'trigonometry', 'functions'],
    wassceCategories: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry', 'Functions'],
    ghanaContexts: [
      'business calculations in Makola market',
      'construction planning in Ghana',
      'financial planning for small businesses',
      'agricultural yield calculations',
      'transportation route optimization',
      'economic modeling'
    ]
  },
  ict: {
    topics: ['computer basics', 'programming', 'networks', 'databases', 'algorithms', 'web development'],
    wassceCategories: ['Computer Fundamentals', 'Programming', 'Computer Networks', 'Databases', 'Algorithms', 'Web Development'],
    ghanaContexts: [
      'mobile money systems like M-Pesa',
      'digital agriculture platforms',
      'e-learning in rural schools',
      'e-commerce in Ghana',
      'digital government services',
      'tech innovation hubs'
    ]
  }
};

// Question patterns by type and difficulty
const QUESTION_PATTERNS = {
  mcq: {
    basic: [
      "What is the main function of {topic}?",
      "Which of the following best describes {topic}?",
      "What happens when {scenario} occurs?",
      "Identify the correct definition of {term}.",
      "What is the primary purpose of {process}?",
      "Which structure is responsible for {function}?"
    ],
    intermediate: [
      "How does {topic} relate to {related_concept}?",
      "What would be the result if {condition} changes?",
      "Which factor most significantly affects {outcome}?",
      "Compare and contrast {concept1} and {concept2}.",
      "What evidence supports the idea that {statement}?",
      "How does {process} contribute to {function}?"
    ],
    advanced: [
      "Analyze the implications of {complex_scenario}.",
      "Evaluate the effectiveness of {method} in {context}.",
      "What conclusions can be drawn from {data}?",
      "How would you design an experiment to test {hypothesis}?",
      "What are the limitations of {theory} in {real_world_context}?",
      "How would {change} affect the overall {system}?"
    ]
  },
  trueFalse: {
    basic: [
      "{topic} is essential for {process}.",
      "{term} refers to {definition}.",
      "{scenario} always results in {outcome}.",
      "All {concept} have {characteristic}.",
      "{process} occurs in {location}."
    ],
    intermediate: [
      "The relationship between {concept1} and {concept2} is {relationship_type}.",
      "{method} can be applied to {different_context}.",
      "{condition} influences {outcome} in {specific_way}.",
      "{theory} explains {phenomenon} completely.",
      "{process} requires {specific_condition}."
    ],
    advanced: [
      "{complex_theory} explains {phenomenon} completely.",
      "{advanced_concept} is more effective than {alternative} in {context}.",
      "{real_world_application} demonstrates {scientific_principle}.",
      "{method} can be optimized for {specific_goal}.",
      "{theory} has limitations in {real_world_context}."
    ]
  },
  shortAnswer: {
    intermediate: [
      "Explain how {topic} contributes to {process} in 2-3 sentences.",
      "Describe the relationship between {concept1} and {concept2}.",
      "What are the key factors that influence {outcome}?",
      "How does {method} work in {context}?",
      "Explain the importance of {concept} in {real_world_application}."
    ],
    advanced: [
      "Analyze the implications of {complex_scenario} for {real_world_application}.",
      "Evaluate the effectiveness of {approach} in addressing {challenge}.",
      "What conclusions can be drawn from {data} about {phenomenon}?",
      "How would you apply {theory} to solve {practical_problem}?",
      "Compare and contrast {method1} and {method2} for {goal}."
    ]
  },
  scenario: {
    advanced: [
      "You are working on {real_world_project} in Ghana. {scenario_description}",
      "As a {professional_role} in Ghana, you need to {task_description}",
      "Your team is developing {solution} for {ghanaian_context}",
      "You are researching {topic} in the context of {ghanaian_application}",
      "As an expert in {field}, you must address {challenge} in Ghana"
    ]
  }
};

// Content templates for each subject and topic
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
      result: 'increased cell growth',
      term: 'cell structure',
      definition: 'the basic unit of life',
      characteristic: 'membrane-bound organelles',
      location: 'all living organisms'
    }
  }
  // Add more content templates for other subjects...
};

/**
 * Generate a question template
 */
function generateQuestionTemplate(subject, topic, questionType, difficulty, templateIndex) {
  const subjectData = TEMPLATE_STRUCTURE[subject];
  const ghanaContext = subjectData.ghanaContexts[Math.floor(Math.random() * subjectData.ghanaContexts.length)];
  const wassceCategory = subjectData.wassceCategories[Math.floor(Math.random() * subjectData.wassceCategories.length)];
  
  const templateId = `${subject}-${questionType}-${difficulty}-${String(templateIndex + 1).padStart(3, '0')}`;
  
  // Get pattern based on type and difficulty
  const patterns = QUESTION_PATTERNS[questionType][difficulty];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Generate question content
  const questionContent = generateQuestionContent(subject, topic, questionType, difficulty, pattern);
  
  const template = {
    id: templateId,
    type: questionType,
    difficulty: difficulty,
    topic: topic,
    wassceCategory: wassceCategory,
    ghanaContext: ghanaContext,
    tags: [topic, difficulty, wassceCategory.toLowerCase().replace(/\s+/g, '-')]
  };
  
  // Add type-specific fields
  if (questionType === 'mcq') {
    template.stem = questionContent.stem;
    template.options = questionContent.options;
    template.answer = questionContent.answer;
    template.explanation = questionContent.explanation;
  } else if (questionType === 'trueFalse') {
    template.statement = questionContent.statement;
    template.answer = questionContent.answer;
    template.explanation = questionContent.explanation;
  } else if (questionType === 'shortAnswer') {
    template.stem = questionContent.stem;
    template.answer = questionContent.answer;
    template.explanation = questionContent.explanation;
  } else if (questionType === 'scenario') {
    template.title = questionContent.title;
    template.scenario = questionContent.scenario;
    template.tasks = questionContent.tasks;
    template.learningObjectives = questionContent.learningObjectives;
  }
  
  return template;
}

/**
 * Generate question content based on pattern
 */
function generateQuestionContent(subject, topic, questionType, difficulty, pattern) {
  // This is a simplified content generation
  // In practice, you'd have more sophisticated content templates
  
  const content = {
    stem: pattern.replace(/{topic}/g, topic),
    options: {
      A: `Option A for ${topic}`,
      B: `Option B for ${topic}`,
      C: `Option C for ${topic}`,
      D: `Option D for ${topic}`
    },
    answer: 'B',
    explanation: `This question tests ${difficulty} understanding of ${topic} in the context of ${subject}.`,
    statement: pattern.replace(/{topic}/g, topic),
    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} in Ghana`,
    scenario: `You are working on ${topic} in Ghana. ${pattern}`,
    tasks: [
      `Task 1 related to ${topic}`,
      `Task 2 related to ${topic}`,
      `Task 3 related to ${topic}`,
      `Task 4 related to ${topic}`
    ],
    learningObjectives: [
      `Understand ${topic}`,
      `Apply ${topic} concepts`,
      `Analyze ${topic} in context`
    ]
  };
  
  return content;
}

/**
 * Generate all templates for a subject
 */
function generateSubjectTemplates(subject) {
  const subjectData = TEMPLATE_STRUCTURE[subject];
  const templates = {
    mcq: [],
    trueFalse: [],
    shortAnswer: [],
    scenario: []
  };
  
  // Generate 6 MCQ questions (2 per difficulty level)
  subjectData.topics.forEach((topic, index) => {
    const difficulty = index < 2 ? 'basic' : index < 4 ? 'intermediate' : 'advanced';
    templates.mcq.push(generateQuestionTemplate(subject, topic, 'mcq', difficulty, index));
  });
  
  // Generate 2 True/False questions (1 basic, 1 intermediate)
  subjectData.topics.slice(0, 2).forEach((topic, index) => {
    const difficulty = index === 0 ? 'basic' : 'intermediate';
    templates.trueFalse.push(generateQuestionTemplate(subject, topic, 'trueFalse', difficulty, index));
  });
  
  // Generate 2 Short Answer questions (1 intermediate, 1 advanced)
  subjectData.topics.slice(2, 4).forEach((topic, index) => {
    const difficulty = index === 0 ? 'intermediate' : 'advanced';
    templates.shortAnswer.push(generateQuestionTemplate(subject, topic, 'shortAnswer', difficulty, index));
  });
  
  // Generate 1 Scenario question (advanced)
  const topic = subjectData.topics[4];
  templates.scenario.push(generateQuestionTemplate(subject, topic, 'scenario', 'advanced', 0));
  
  return templates;
}

/**
 * Generate all templates
 */
function generateAllTemplates() {
  const allTemplates = {};
  
  Object.keys(TEMPLATE_STRUCTURE).forEach(subject => {
    console.log(`🔧 Generating templates for ${subject.toUpperCase()}...`);
    allTemplates[subject] = generateSubjectTemplates(subject);
  });
  
  return allTemplates;
}

/**
 * Save templates to file
 */
function saveTemplates(templates) {
  const outputPath = path.join(__dirname, 'subject-question-templates.json');
  
  const output = {
    templates: templates,
    metadata: {
      created: new Date().toISOString(),
      version: "1.0",
      description: "Comprehensive question templates for all STEM subjects with difficulty levels, topics, and WASSCE categories",
      totalTemplates: Object.values(templates).reduce((sum, subject) => 
        sum + Object.values(subject).reduce((s, type) => s + type.length, 0), 0),
      subjects: Object.keys(templates),
      questionTypes: ["mcq", "trueFalse", "shortAnswer", "scenario"],
      difficultyLevels: ["basic", "intermediate", "advanced"],
      wassceCategories: Object.values(templates).flatMap(subject => 
        Object.values(subject).flatMap(type => 
          type.map(q => q.wassceCategory)
        )
      ).filter((v, i, a) => a.indexOf(v) === i)
    }
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`✅ Templates saved to: ${outputPath}`);
  
  return outputPath;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting Template Generation...\n');
  
  const templates = generateAllTemplates();
  const outputPath = saveTemplates(templates);
  
  console.log('\n📊 Template Generation Summary:');
  Object.entries(templates).forEach(([subject, subjectTemplates]) => {
    const total = Object.values(subjectTemplates).reduce((sum, type) => sum + type.length, 0);
    console.log(`  ${subject.toUpperCase()}: ${total} templates`);
    Object.entries(subjectTemplates).forEach(([type, questions]) => {
      console.log(`    - ${type}: ${questions.length} questions`);
    });
  });
  
  console.log(`\n🎉 Template generation complete!`);
  console.log(`📁 Output file: ${outputPath}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSubjectTemplates,
  generateAllTemplates,
  saveTemplates
};
