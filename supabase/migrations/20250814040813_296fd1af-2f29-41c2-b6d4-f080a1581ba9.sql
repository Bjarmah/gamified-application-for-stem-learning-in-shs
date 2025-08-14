-- Insert Photosynthesis & Respiration Assessment Quiz
INSERT INTO public.quizzes (
  id,
  module_id,
  title,
  description,
  questions,
  time_limit,
  passing_score
) VALUES (
  gen_random_uuid(),
  'a8c27ce7-3776-4d84-9b6b-eb18b4c9b23d',
  'Photosynthesis & Respiration Assessment',
  '20 WASSCE-style MCQs covering light reactions, Calvin cycle, cellular respiration, and energy flow',
  '[
    {
      "id": "pr-q1",
      "type": "mcq",
      "topic": "Light Reactions",
      "question": "Where do the light reactions of photosynthesis occur?",
      "options": {
        "A": "Stroma of chloroplasts",
        "B": "Thylakoid membranes",
        "C": "Mitochondrial matrix",
        "D": "Cytosol"
      },
      "correctAnswer": "B",
      "explanation": "Light reactions occur on the thylakoid membranes where chlorophyll captures light energy and splits water molecules.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q2",
      "type": "mcq",
      "topic": "Photolysis",
      "question": "The primary product of water splitting (photolysis) during photosynthesis is:",
      "options": {
        "A": "Carbon dioxide",
        "B": "Oxygen",
        "C": "Glucose",
        "D": "ATP"
      },
      "correctAnswer": "B",
      "explanation": "Photolysis splits water molecules, releasing oxygen as a byproduct while providing electrons for the light reactions.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q3",
      "type": "mcq",
      "topic": "Calvin Cycle",
      "question": "The Calvin cycle occurs in the:",
      "options": {
        "A": "Thylakoid lumen",
        "B": "Stroma of chloroplasts",
        "C": "Mitochondrial matrix",
        "D": "Cristae"
      },
      "correctAnswer": "B",
      "explanation": "The Calvin cycle takes place in the stroma, where CO2 is fixed into organic molecules using ATP and NADPH from the light reactions.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q4",
      "type": "mcq",
      "topic": "Calvin Cycle Requirements",
      "question": "Which molecules are required for the Calvin cycle to function?",
      "options": {
        "A": "ATP and NADPH",
        "B": "Oxygen and glucose",
        "C": "ADP and NADP+",
        "D": "Light and chlorophyll"
      },
      "correctAnswer": "A",
      "explanation": "The Calvin cycle uses ATP and NADPH produced during the light reactions to convert CO2 into glucose.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q5",
      "type": "mcq",
      "topic": "Limiting Factors",
      "question": "Which factor would directly limit photosynthesis at night?",
      "options": {
        "A": "Light intensity",
        "B": "Carbon dioxide concentration",
        "C": "Temperature",
        "D": "Mineral availability"
      },
      "correctAnswer": "A",
      "explanation": "Without light, the light reactions cannot proceed, making light intensity the primary limiting factor at night.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q6",
      "type": "mcq",
      "topic": "Glycolysis",
      "question": "Where does glycolysis occur in the cell?",
      "options": {
        "A": "Mitochondrial matrix",
        "B": "Cytosol",
        "C": "Nucleus",
        "D": "Chloroplast stroma"
      },
      "correctAnswer": "B",
      "explanation": "Glycolysis takes place in the cytosol and breaks down glucose into pyruvate, producing ATP and NADH.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q7",
      "type": "mcq",
      "topic": "Electron Transport Chain",
      "question": "The final electron acceptor in aerobic respiration is:",
      "options": {
        "A": "Carbon dioxide",
        "B": "Oxygen",
        "C": "NAD+",
        "D": "Water"
      },
      "correctAnswer": "B",
      "explanation": "Oxygen serves as the final electron acceptor in the electron transport chain, combining with electrons and protons to form water.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q8",
      "type": "mcq",
      "topic": "ATP Production",
      "question": "Most ATP in cellular respiration is produced during:",
      "options": {
        "A": "Glycolysis",
        "B": "Krebs cycle",
        "C": "Electron transport and oxidative phosphorylation",
        "D": "Fermentation"
      },
      "correctAnswer": "C",
      "explanation": "The electron transport chain and ATP synthase produce the majority of ATP through oxidative phosphorylation.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q9",
      "type": "mcq",
      "topic": "Anaerobic Respiration",
      "question": "During intense exercise, human muscle cells produce:",
      "options": {
        "A": "Ethanol",
        "B": "Lactate",
        "C": "Oxygen",
        "D": "Glucose"
      },
      "correctAnswer": "B",
      "explanation": "When oxygen is limited, muscle cells undergo anaerobic respiration, producing lactate and causing muscle fatigue.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q10",
      "type": "mcq",
      "topic": "Energy Currency",
      "question": "ATP primarily provides energy for cellular work by:",
      "options": {
        "A": "Donating electrons",
        "B": "Hydrolysis of phosphate bonds",
        "C": "Absorbing sunlight",
        "D": "Forming new DNA strands"
      },
      "correctAnswer": "B",
      "explanation": "ATP releases energy when its phosphate bonds are hydrolyzed, providing power for cellular processes.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q11",
      "type": "mcq",
      "topic": "Process Comparison",
      "question": "Which best compares photosynthesis and respiration?",
      "options": {
        "A": "Both consume oxygen",
        "B": "Both produce oxygen",
        "C": "Photosynthesis consumes CO2; respiration produces CO2",
        "D": "Both occur only in plants"
      },
      "correctAnswer": "C",
      "explanation": "Photosynthesis uses CO2 to make glucose, while respiration breaks down glucose and releases CO2 as a waste product.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q12",
      "type": "mcq",
      "topic": "Energy Storage vs Release",
      "question": "Which pathway stores energy in chemical bonds?",
      "options": {
        "A": "Photosynthesis",
        "B": "Glycolysis",
        "C": "Krebs cycle",
        "D": "Electron transport chain"
      },
      "correctAnswer": "A",
      "explanation": "Photosynthesis stores light energy in the chemical bonds of glucose molecules.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q13",
      "type": "mcq",
      "topic": "Trophic Levels",
      "question": "Approximately what percentage of energy transfers between trophic levels in ecosystems?",
      "options": {
        "A": "100%",
        "B": "50%",
        "C": "10%",
        "D": "1%"
      },
      "correctAnswer": "C",
      "explanation": "The 10% rule states that only about 10% of energy is transferred from one trophic level to the next, with the rest lost as heat.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q14",
      "type": "mcq",
      "topic": "Electron Carriers",
      "question": "Which molecule carries high-energy electrons to the electron transport chain?",
      "options": {
        "A": "ATP",
        "B": "NADH",
        "C": "ADP",
        "D": "Carbon dioxide"
      },
      "correctAnswer": "B",
      "explanation": "NADH and FADH2 carry electrons from glycolysis and the Krebs cycle to the electron transport chain.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q15",
      "type": "mcq",
      "topic": "Photosynthesis Equation",
      "question": "How many molecules of CO2 are required to produce one molecule of glucose during photosynthesis?",
      "options": {
        "A": "3",
        "B": "6",
        "C": "12",
        "D": "2"
      },
      "correctAnswer": "B",
      "explanation": "The photosynthesis equation shows that 6 CO2 molecules are needed to produce one glucose molecule (C6H12O6).",
      "difficulty": "basic"
    },
    {
      "id": "pr-q16",
      "type": "mcq",
      "topic": "Mitochondrial Function",
      "question": "If the inner mitochondrial membrane becomes permeable to protons, what would happen to ATP production?",
      "options": {
        "A": "ATP production would increase",
        "B": "The proton gradient would collapse and ATP production would decrease",
        "C": "Only glycolysis would be affected",
        "D": "The Krebs cycle would speed up"
      },
      "correctAnswer": "B",
      "explanation": "ATP synthase depends on the proton gradient across the inner membrane. If this gradient collapses, ATP production would drop significantly.",
      "difficulty": "advanced"
    },
    {
      "id": "pr-q17",
      "type": "mcq",
      "topic": "Molecule Reduction",
      "question": "Which molecule is reduced during the light reactions of photosynthesis?",
      "options": {
        "A": "NADP+",
        "B": "Oxygen",
        "C": "ATP",
        "D": "Carbon dioxide"
      },
      "correctAnswer": "A",
      "explanation": "NADP+ is reduced to NADPH during the light reactions, storing energy for use in the Calvin cycle.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q18",
      "type": "mcq",
      "topic": "Agricultural Applications",
      "question": "Which agricultural practice would most likely increase photosynthesis in crops?",
      "options": {
        "A": "Overcrowding plants to increase competition",
        "B": "Optimizing plant spacing and irrigation",
        "C": "Removing all shade during the dry season",
        "D": "Reducing CO2 levels in greenhouses"
      },
      "correctAnswer": "B",
      "explanation": "Proper spacing ensures adequate light for each plant, while irrigation maintains water supply, both optimizing photosynthetic rates.",
      "difficulty": "intermediate"
    },
    {
      "id": "pr-q19",
      "type": "mcq",
      "topic": "Fermentation Conditions",
      "question": "Which condition would favor fermentation over aerobic respiration?",
      "options": {
        "A": "High oxygen availability",
        "B": "Low oxygen in muscle tissue",
        "C": "Bright sunlight",
        "D": "High CO2 concentration"
      },
      "correctAnswer": "B",
      "explanation": "When oxygen is scarce, cells switch to fermentation to continue producing ATP, though less efficiently.",
      "difficulty": "basic"
    },
    {
      "id": "pr-q20",
      "type": "mcq",
      "topic": "ATP Synthase Function",
      "question": "The main role of ATP synthase is to:",
      "options": {
        "A": "Pump electrons through the transport chain",
        "B": "Synthesize ATP using the proton gradient",
        "C": "Fix carbon dioxide in the Calvin cycle",
        "D": "Split water molecules during photolysis"
      },
      "correctAnswer": "B",
      "explanation": "ATP synthase uses the proton gradient created by the electron transport chain to drive ATP synthesis through chemiosmosis.",
      "difficulty": "intermediate"
    }
  ]'::jsonb,
  2400,
  70
);