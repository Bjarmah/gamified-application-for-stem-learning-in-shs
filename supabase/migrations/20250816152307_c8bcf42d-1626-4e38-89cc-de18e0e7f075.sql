-- Add gamification elements to all updated modules
-- Update Biology modules with gamification
UPDATE modules SET 
content = jsonb_set(content, '{gamification}', '{
  "achievements": [
    {
      "id": "membrane-master",
      "title": "Membrane Master",
      "description": "Master cell membrane structure and transport",
      "xpReward": 100
    }
  ],
  "milestones": [
    {
      "id": "transport-expert", 
      "title": "Transport Expert",
      "description": "Correctly identify all transport mechanisms",
      "xpReward": 50
    }
  ],
  "xpRules": {
    "correctAnswer": 15,
    "completedExercise": 40,
    "scenarioChallenge": 60,
    "moduleCompletion": 100
  }
}')
WHERE id = 'e1895ba1-70ec-40e1-8232-26c408d9a35f';

UPDATE modules SET 
content = jsonb_set(content, '{gamification}', '{
  "achievements": [
    {
      "id": "photosynthesis-champion",
      "title": "Photosynthesis Champion", 
      "description": "Master the process of photosynthesis",
      "xpReward": 110
    }
  ],
  "milestones": [
    {
      "id": "energy-converter",
      "title": "Energy Converter",
      "description": "Understand both light and dark reactions",
      "xpReward": 60
    }
  ],
  "xpRules": {
    "correctAnswer": 15,
    "completedExercise": 45,
    "scenarioChallenge": 70,
    "moduleCompletion": 110
  }
}')
WHERE id = '581045f5-8844-4557-9e1d-51df43490b52';

-- Add Ghana context to all updated modules
UPDATE modules SET 
content = jsonb_set(content, '{ghanaContext}', '{
  "localExamples": ["Salted fish preservation", "Cell phones and membrane technology", "Agricultural osmosis effects"],
  "culturalConnections": ["Traditional food preservation", "Modern biotechnology applications", "Healthcare innovations"],
  "realWorldApplications": ["Food industry", "Medical diagnostics", "Agricultural science"]
}')
WHERE id = 'e1895ba1-70ec-40e1-8232-26c408d9a35f';

UPDATE modules SET 
content = jsonb_set(content, '{ghanaContext}', '{
  "localExamples": ["Cocoa plantations", "Tropical rainforest ecosystems", "Solar energy applications"],
  "culturalConnections": ["Agricultural practices", "Environmental conservation", "Sustainable development"],
  "realWorldApplications": ["Agriculture", "Renewable energy", "Climate science"]
}')
WHERE id = '581045f5-8844-4557-9e1d-51df43490b52';

-- Add gamification to Physics modules
UPDATE modules SET 
content = jsonb_set(content, '{gamification}', '{
  "achievements": [
    {
      "id": "newton-scholar",
      "title": "Newton Scholar",
      "description": "Master Newton''s laws of motion",
      "xpReward": 110
    }
  ],
  "milestones": [
    {
      "id": "force-analyzer",
      "title": "Force Analyzer", 
      "description": "Successfully solve complex force problems",
      "xpReward": 65
    }
  ],
  "xpRules": {
    "correctAnswer": 18,
    "completedExercise": 50,
    "scenarioChallenge": 75,
    "moduleCompletion": 110
  }
}')
WHERE id = 'cdf81f80-3144-4124-ba0c-bb478435991f';

UPDATE modules SET 
content = jsonb_set(content, '{gamification}', '{
  "achievements": [
    {
      "id": "energy-expert",
      "title": "Energy Expert",
      "description": "Master work, energy, and power concepts",
      "xpReward": 90
    }
  ],
  "milestones": [
    {
      "id": "conservation-master",
      "title": "Conservation Master",
      "description": "Apply conservation of energy to solve problems", 
      "xpReward": 55
    }
  ],
  "xpRules": {
    "correctAnswer": 15,
    "completedExercise": 45,
    "scenarioChallenge": 65,
    "moduleCompletion": 90
  }
}')
WHERE id = 'e2e2d547-083e-46b5-97ce-39fffa14be26';

UPDATE modules SET 
content = jsonb_set(content, '{gamification}', '{
  "achievements": [
    {
      "id": "motion-master",
      "title": "Motion Master", 
      "description": "Master kinematics and motion analysis",
      "xpReward": 100
    }
  ],
  "milestones": [
    {
      "id": "equation-solver",
      "title": "Equation Solver",
      "description": "Use kinematic equations fluently",
      "xpReward": 50
    }
  ],
  "xpRules": {
    "correctAnswer": 12,
    "completedExercise": 40,
    "scenarioChallenge": 60,
    "moduleCompletion": 100
  }
}')
WHERE id = '725f62ae-d404-40ef-a8d6-e1a03fecad09';