-- Create biology quizzes for each module

-- Cell Structure & Function Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Cell Structure & Function Quiz',
  'Test your knowledge of cell membrane transport, nucleus control, organelles, and cell division',
  (SELECT id FROM modules WHERE title = 'Cell Structure & Function'),
  '[
    {
      "id": 1,
      "question": "Which feature best explains the membrane''s selective permeability?",
      "options": ["Single layer of lipids", "Phospholipid bilayer with proteins", "Only carbohydrate chains", "Cell wall components"],
      "correctAnswer": 1,
      "explanation": "Selective permeability arises from the phospholipid bilayer and specific transport proteins controlling entry and exit."
    },
    {
      "id": 2,
      "question": "Osmosis is defined as the movement of water across a membrane from:",
      "options": ["Low to high water potential", "High to low solute concentration", "High to low water potential", "Low to high solute concentration"],
      "correctAnswer": 0,
      "explanation": "Water moves from higher water potential (lower solute) to lower water potential (higher solute) across a selectively permeable membrane."
    },
    {
      "id": 3,
      "question": "Which process requires ATP?",
      "options": ["Diffusion", "Facilitated diffusion", "Active transport", "Osmosis"],
      "correctAnswer": 2,
      "explanation": "Active transport moves substances against gradients using ATP-driven pumps."
    },
    {
      "id": 4,
      "question": "What is the primary function of the nucleolus?",
      "options": ["DNA replication", "rRNA synthesis and ribosome assembly", "Lipid synthesis", "ATP production"],
      "correctAnswer": 1,
      "explanation": "The nucleolus synthesizes rRNA and assembles ribosomal subunits."
    },
    {
      "id": 5,
      "question": "Which sequence correctly represents gene expression?",
      "options": ["RNA → DNA → protein", "DNA → protein → RNA", "DNA → RNA → protein", "Protein → RNA → DNA"],
      "correctAnswer": 2,
      "explanation": "Transcription produces RNA from DNA; translation produces protein from RNA."
    },
    {
      "id": 6,
      "question": "Which organelle is the site of ATP production?",
      "options": ["Golgi", "Mitochondrion", "Ribosome", "Nucleus"],
      "correctAnswer": 1,
      "explanation": "Mitochondria carry out aerobic respiration to generate ATP."
    },
    {
      "id": 7,
      "question": "Protein synthesis begins at the:",
      "options": ["Ribosome", "Lysosome", "Chloroplast", "Peroxisome"],
      "correctAnswer": 0,
      "explanation": "Ribosomes translate mRNA into polypeptides."
    },
    {
      "id": 8,
      "question": "During which phase do chromosomes align at the cell center?",
      "options": ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      "correctAnswer": 1,
      "explanation": "Chromosomes align at the metaphase plate during metaphase."
    },
    {
      "id": 9,
      "question": "What happens when checkpoints detect DNA damage?",
      "options": ["Division speeds up", "Cell may undergo apoptosis", "More organelles form", "Nuclear envelope dissolves"],
      "correctAnswer": 1,
      "explanation": "Checkpoints can trigger apoptosis to prevent damaged DNA propagation."
    },
    {
      "id": 10,
      "question": "A cell with abundant rough ER likely specializes in:",
      "options": ["Lipid storage", "Protein secretion", "DNA replication", "Anaerobic respiration"],
      "correctAnswer": 1,
      "explanation": "Rough ER with ribosomes supports protein synthesis for export."
    }
  ]'::jsonb,
  600,
  70
);

-- Photosynthesis & Respiration Quiz  
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score)
VALUES (
  'Photosynthesis & Respiration Quiz',
  'Master the processes of energy capture and release in living systems',
  (SELECT id FROM modules WHERE title = 'Photosynthesis & Respiration'),
  '[
    {
      "id": 1,
      "question": "Where do light reactions occur?",
      "options": ["Stroma", "Thylakoid membranes", "Matrix", "Cytosol"],
      "correctAnswer": 1,
      "explanation": "Light reactions are on thylakoid membranes in chloroplasts."
    },
    {
      "id": 2,
      "question": "Primary product of water splitting is:",
      "options": ["CO2", "O2", "Glucose", "Lactic acid"],
      "correctAnswer": 1,
      "explanation": "Photolysis releases oxygen from water."
    },
    {
      "id": 3,
      "question": "Calvin cycle requires:",
      "options": ["ATP and NADPH", "Light directly", "O2 only", "Pyruvate"],
      "correctAnswer": 0,
      "explanation": "ATP and NADPH from light reactions drive carbon fixation."
    },
    {
      "id": 4,
      "question": "Where does glycolysis occur?",
      "options": ["Cytosol", "Matrix", "Thylakoid", "Nucleus"],
      "correctAnswer": 0,
      "explanation": "Glycolysis occurs in cytosol of all cells."
    },
    {
      "id": 5,
      "question": "Final electron acceptor in aerobic respiration is:",
      "options": ["CO2", "O2", "NAD+", "FAD"],
      "correctAnswer": 1,
      "explanation": "Oxygen accepts electrons to form water."
    },
    {
      "id": 6,
      "question": "Most ATP is produced during:",
      "options": ["Glycolysis", "Krebs cycle", "Electron transport/oxidative phosphorylation", "Fermentation"],
      "correctAnswer": 2,
      "explanation": "ETC with ATP synthase yields the most ATP."
    },
    {
      "id": 7,
      "question": "Anaerobic respiration in human muscle produces:",
      "options": ["Ethanol", "Lactate", "O2", "Glucose"],
      "correctAnswer": 1,
      "explanation": "Lactate is formed in human anaerobic metabolism."
    },
    {
      "id": 8,
      "question": "ATP primarily provides energy by:",
      "options": ["Donating electrons", "Hydrolysis of phosphate bonds", "Absorbing sunlight", "Forming DNA"],
      "correctAnswer": 1,
      "explanation": "ATP hydrolysis releases energy for work."
    },
    {
      "id": 9,
      "question": "Energy transfer between trophic levels is about:",
      "options": ["100%", "50%", "10%", "1%"],
      "correctAnswer": 2,
      "explanation": "Rule of thumb ~10% efficiency."
    },
    {
      "id": 10,
      "question": "Which best compares photosynthesis vs respiration?",
      "options": ["Both consume O2", "Both produce O2", "Photosynthesis consumes CO2; respiration produces CO2", "Both occur only in plants"],
      "correctAnswer": 2,
      "explanation": "Photosynthesis uses CO2, respiration releases it."
    },
    {
      "id": 11,
      "question": "Main products of light reactions are:",
      "options": ["Glucose and O2", "ATP and NADPH", "Pyruvate and CO2", "Ethanol and CO2"],
      "correctAnswer": 1,
      "explanation": "ATP and NADPH power Calvin cycle."
    },
    {
      "id": 12,
      "question": "Which molecule carries high-energy electrons to the ETC?",
      "options": ["ATP", "NADH", "ADP", "CO2"],
      "correctAnswer": 1,
      "explanation": "NADH/FADH2 donate electrons to ETC."
    }
  ]'::jsonb,
  720,
  70
);

-- Human Body Systems Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score)
VALUES (
  'Human Body Systems Quiz',
  'Test your understanding of circulatory, respiratory, and coordination systems',
  (SELECT id FROM modules WHERE title = 'Human Body Systems'),
  '[
    {
      "id": 1,
      "question": "Which chamber pumps blood to the body?",
      "options": ["Right ventricle", "Left ventricle", "Right atrium", "Left atrium"],
      "correctAnswer": 1,
      "explanation": "The left ventricle pumps oxygenated blood into the aorta."
    },
    {
      "id": 2,
      "question": "Which vessels allow nutrient exchange?",
      "options": ["Arteries", "Veins", "Capillaries", "Venules"],
      "correctAnswer": 2,
      "explanation": "Thin walls facilitate exchange in capillaries."
    },
    {
      "id": 3,
      "question": "Primary function of platelets is:",
      "options": ["Carry oxygen", "Defend against pathogens", "Blood clotting", "Regulate pH"],
      "correctAnswer": 2,
      "explanation": "Platelets initiate clot formation."
    },
    {
      "id": 4,
      "question": "The pulmonary artery carries:",
      "options": ["Oxygenated blood to lungs", "Deoxygenated blood to lungs", "Deoxygenated blood to body", "Oxygenated blood to body"],
      "correctAnswer": 1,
      "explanation": "Pulmonary artery carries deoxygenated blood from right ventricle to lungs."
    },
    {
      "id": 5,
      "question": "Main muscle of inspiration is:",
      "options": ["Diaphragm", "Biceps", "Quadriceps", "Triceps"],
      "correctAnswer": 0,
      "explanation": "The diaphragm contracts to increase thoracic volume."
    },
    {
      "id": 6,
      "question": "Gas exchange occurs in the:",
      "options": ["Bronchi", "Trachea", "Alveoli", "Larynx"],
      "correctAnswer": 2,
      "explanation": "Alveoli provide thin, moist surfaces for diffusion."
    },
    {
      "id": 7,
      "question": "CO2 primarily travels in blood as:",
      "options": ["Dissolved CO2 only", "Carbaminohemoglobin", "Bicarbonate ion (HCO3-)", "Carbonic acid only"],
      "correctAnswer": 2,
      "explanation": "Most CO2 is converted to bicarbonate in plasma."
    },
    {
      "id": 8,
      "question": "Which carries impulses to the cell body?",
      "options": ["Axon", "Dendrite", "Synapse", "Myelin"],
      "correctAnswer": 1,
      "explanation": "Dendrites receive signals toward the soma."
    },
    {
      "id": 9,
      "question": "Insulin lowers blood glucose by:",
      "options": ["Stimulating glycogen breakdown", "Promoting glucose uptake/storage", "Inhibiting cellular respiration", "Increasing glucagon"],
      "correctAnswer": 1,
      "explanation": "Insulin increases uptake and glycogen synthesis."
    },
    {
      "id": 10,
      "question": "Which is a positive feedback example?",
      "options": ["Blood glucose regulation", "Thermoregulation", "Uterine contractions in labor", "Blood pressure control"],
      "correctAnswer": 2,
      "explanation": "Oxytocin intensifies contractions until birth."
    },
    {
      "id": 11,
      "question": "Homeostasis relies mainly on:",
      "options": ["Positive feedback", "Random changes", "Negative feedback", "No feedback"],
      "correctAnswer": 2,
      "explanation": "Negative feedback restores set points."
    },
    {
      "id": 12,
      "question": "Which gland secretes insulin?",
      "options": ["Thyroid", "Adrenal", "Pancreas", "Pituitary"],
      "correctAnswer": 2,
      "explanation": "Pancreatic beta cells secrete insulin."
    }
  ]'::jsonb,
  720,
  70
);