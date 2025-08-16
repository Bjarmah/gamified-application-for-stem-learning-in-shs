-- Add gamification and Ghana context using proper text manipulation for JSON stored as text
-- Update Biology modules with gamification (using text concatenation approach)

-- First, update the membrane transport module by reconstructing the complete JSON
UPDATE modules SET 
content = '{
  "text": {
    "introduction": "Cell membranes are the gatekeepers of life, controlling what enters and exits cells through sophisticated transport mechanisms. Understanding membrane structure and function is crucial for comprehending how cells maintain homeostasis, respond to their environment, and perform their specialized functions.",
    "sections": [
      {
        "title": "Fluid Mosaic Model",
        "content": "The cell membrane is described by the fluid mosaic model, consisting of a phospholipid bilayer with embedded proteins, cholesterol, and carbohydrates. This structure creates selective permeability, allowing some substances to pass freely while restricting others. The membrane is dynamic, with components constantly moving and interacting."
      },
      {
        "title": "Transport Mechanisms", 
        "content": "Cells use various transport mechanisms: passive transport (diffusion, facilitated diffusion, osmosis) requires no energy, while active transport uses ATP to move substances against concentration gradients. Bulk transport includes endocytosis and exocytosis for large molecules."
      },
      {
        "title": "Membrane Proteins",
        "content": "Integral and peripheral proteins serve as channels, carriers, receptors, and enzymes. These proteins determine membrane specificity and enable complex cellular processes like signal transduction and metabolic regulation."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "Which component maintains membrane fluidity at different temperatures?",
      "options": ["Phospholipids", "Cholesterol", "Proteins", "Carbohydrates"],
      "correctAnswer": 1,
      "explanation": "Cholesterol acts as a fluidity buffer, preventing membranes from becoming too rigid at low temperatures or too fluid at high temperatures."
    },
    {
      "type": "multiple-choice",
      "question": "Active transport differs from passive transport because it:",
      "options": ["Moves substances down gradients", "Requires membrane proteins", "Uses cellular energy (ATP)", "Only works for small molecules"],
      "correctAnswer": 2,
      "explanation": "Active transport uses ATP to move substances against their concentration gradients, unlike passive transport which moves substances down gradients."
    }
  ],
  "exercises": [
    {
      "type": "analysis",
      "title": "Membrane Transport Analysis",
      "instructions": "Compare and contrast the transport of oxygen, glucose, and sodium ions across cell membranes. Consider size, polarity, and concentration gradients.",
      "hint": "Think about which substances can cross lipid bilayers directly and which need transport proteins."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Food Preservation in Ghana",
      "scenario": "Traditional Ghanaian methods of food preservation, such as salting fish and smoking meat, rely on osmotic principles. The high salt concentration creates a hypertonic environment that draws water out of bacterial cells.",
      "tasks": [
        "Explain how osmosis prevents bacterial growth in salted foods",
        "Describe why some bacteria are more resistant to osmotic stress",
        "Analyze how this knowledge can improve modern food preservation methods"
      ],
      "learningObjectives": [
        "Apply osmotic principles to real-world scenarios",
        "Understand the relationship between water activity and microbial growth",
        "Connect traditional practices to scientific principles"
      ],
      "ghanaContext": "Ghana''s coastal communities have used salt-curing for centuries, preserving fish for inland transport and trade."
    }
  ],
  "gamification": {
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
  },
  "ghanaContext": {
    "localExamples": ["Salted fish preservation", "Cell phones and membrane technology", "Agricultural osmosis effects"],
    "culturalConnections": ["Traditional food preservation", "Modern biotechnology applications", "Healthcare innovations"],
    "realWorldApplications": ["Food industry", "Medical diagnostics", "Agricultural science"]
  }
}'
WHERE id = 'e1895ba1-70ec-40e1-8232-26c408d9a35f';