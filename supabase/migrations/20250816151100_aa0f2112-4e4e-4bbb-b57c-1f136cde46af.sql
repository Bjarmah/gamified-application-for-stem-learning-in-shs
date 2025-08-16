-- Update Biology modules with comprehensive content structure

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
  ]
}',
estimated_duration = 50,
difficulty_level = 'beginner'
WHERE id = 'e1895ba1-70ec-40e1-8232-26c408d9a35f';

-- Update Photosynthesis module
UPDATE modules SET
content = '{
  "text": {
    "introduction": "Photosynthesis is arguably the most important biological process on Earth, converting light energy into chemical energy and producing the oxygen we breathe. This process not only sustains plant life but forms the foundation of most ecosystems and food webs.",
    "sections": [
      {
        "title": "Overview of Photosynthesis",
        "content": "Photosynthesis occurs in two main stages: light-dependent reactions (photo stage) in the thylakoids capture light energy and produce ATP and NADPH, while light-independent reactions (Calvin cycle) in the stroma use this energy to fix carbon dioxide into glucose. The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2."
      },
      {
        "title": "Light-Dependent Reactions",
        "content": "Chlorophyll and other pigments in photosystems I and II capture light energy, exciting electrons to higher energy levels. These electrons pass through an electron transport chain, generating ATP through chemiosmosis and NADPH through reduction. Water molecules are split to replace lost electrons, releasing oxygen as a byproduct."
      },
      {
        "title": "Calvin Cycle (Light-Independent)",
        "content": "In the stroma, CO2 is fixed by RuBisCO enzyme into organic compounds through a series of reduction and regeneration reactions. This cycle uses the ATP and NADPH produced in the light reactions to convert inorganic carbon into glucose and other organic molecules."
      },
      {
        "title": "Factors Affecting Photosynthesis",
        "content": "The rate of photosynthesis is influenced by light intensity, carbon dioxide concentration, temperature, and water availability. Understanding these limiting factors is crucial for optimizing agricultural practices and understanding plant responses to environmental changes."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice", 
      "question": "Where do the light-independent reactions occur?",
      "options": ["Thylakoid membrane", "Stroma", "Intermembrane space", "Cytoplasm"],
      "correctAnswer": 1,
      "explanation": "The Calvin cycle (light-independent reactions) occurs in the stroma, the fluid-filled space surrounding the thylakoids in chloroplasts."
    },
    {
      "type": "multiple-choice",
      "question": "What is the primary function of photosystem II?",
      "options": ["Produce NADPH", "Split water molecules", "Fix carbon dioxide", "Generate glucose"],
      "correctAnswer": 1,
      "explanation": "Photosystem II splits water molecules to replace electrons lost during the light reactions, releasing oxygen as a byproduct."
    }
  ],
  "exercises": [
    {
      "type": "calculation",
      "title": "Photosynthesis Efficiency",
      "instructions": "Calculate the theoretical energy efficiency of photosynthesis given that glucose contains 686 kcal/mol of energy and assuming 8 photons of 680 nm light are required per CO2 fixed.",
      "hint": "Compare the energy input (photons) to the energy stored in chemical bonds (glucose)."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Cocoa Farming in Ghana",
      "scenario": "Ghana is the world''s second-largest cocoa producer, but climate change and deforestation are affecting cocoa yields. Understanding photosynthesis can help optimize growing conditions and develop sustainable farming practices.",
      "tasks": [
        "Explain how shade affects photosynthesis in cocoa plants",
        "Analyze the role of understory plants in cocoa agroforestry systems",
        "Propose strategies to maximize photosynthetic efficiency while maintaining soil health"
      ],
      "learningObjectives": [
        "Apply photosynthesis principles to agricultural systems",
        "Understand the relationship between light availability and crop yields", 
        "Evaluate sustainable farming practices using scientific principles"
      ],
      "ghanaContext": "Cocoa provides livelihoods for over 800,000 smallholder farmers in Ghana, making optimization of photosynthetic processes economically crucial."
    }
  ]
}',
estimated_duration = 55,
difficulty_level = 'intermediate'
WHERE id = '581045f5-8844-4557-9e1d-51df43490b52';