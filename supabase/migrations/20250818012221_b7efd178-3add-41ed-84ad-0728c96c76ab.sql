-- Create quiz for Foundations of Photosynthesis
INSERT INTO quizzes (id, title, description, module_id, time_limit, passing_score, questions) VALUES
('b55f88da-ae77-4bd5-af6b-d73ad7d88bd3', 'Foundations of Photosynthesis Quiz', 'Test your understanding of photosynthesis fundamentals, chloroplast structure, and light absorption', 'b55f88da-ae77-4bd5-af6b-d73ad7d88bd3', 45, 70, '[
  {
    "id": "q1",
    "question": "What is the simplified equation of photosynthesis?",
    "options": ["6CO2 + 6H2O + light energy → C6H12O6 + 6O2", "C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP", "6CO2 + 12H2O → C6H12O6 + 6O2 + 6H2O", "CO2 + H2O + light → glucose + O2"],
    "correctOption": 0,
    "explanation": "The simplified equation shows carbon dioxide and water combining with light energy to produce glucose and oxygen."
  },
  {
    "id": "q2",
    "question": "Who proved that sunlight is essential for oxygen release in plants?",
    "options": ["Jan van Helmont", "Joseph Priestley", "Jan Ingenhousz", "Jean Senebier"],
    "correctOption": 2,
    "explanation": "Jan Ingenhousz (1779) proved that sunlight is essential for oxygen release and that only green parts of plants do this."
  },
  {
    "id": "q3",
    "question": "What are organisms called that produce organic compounds from inorganic substances?",
    "options": ["Heterotrophs", "Autotrophs", "Decomposers", "Consumers"],
    "correctOption": 1,
    "explanation": "Autotrophs (self-feeders) produce organic compounds from inorganic substances, including photoautotrophs like plants."
  },
  {
    "id": "q4",
    "question": "Where do the light-dependent reactions of photosynthesis occur?",
    "options": ["Stroma", "Thylakoid membranes", "Outer membrane", "Cytoplasm"],
    "correctOption": 1,
    "explanation": "Light-dependent reactions occur on thylakoid membranes where chlorophyll and protein complexes are located."
  },
  {
    "id": "q5",
    "question": "What is the function of the stroma in chloroplasts?",
    "options": ["Light absorption", "Site of Calvin cycle", "Oxygen production", "Water splitting"],
    "correctOption": 1,
    "explanation": "The stroma is the dense fluid within chloroplasts where the Calvin cycle (light-independent reactions) occurs."
  },
  {
    "id": "q6",
    "question": "Which pigment is universal in all oxygenic photosynthesizers?",
    "options": ["Chlorophyll b", "Carotenoids", "Chlorophyll a", "Xanthophylls"],
    "correctOption": 2,
    "explanation": "Chlorophyll a is the universal pigment essential for directly converting light into chemical energy in all oxygenic photosynthesizers."
  },
  {
    "id": "q7",
    "question": "What wavelengths of light do chlorophylls primarily absorb?",
    "options": ["Green and yellow", "Blue and red", "Orange and yellow", "Purple and green"],
    "correctOption": 1,
    "explanation": "Chlorophylls absorb primarily in the blue (around 430 nm) and red (around 660 nm) regions, reflecting green light."
  },
  {
    "id": "q8",
    "question": "What is the primary function of carotenoids in photosynthesis?",
    "options": ["Direct energy conversion", "Water splitting", "Photoprotection and light absorption", "CO2 fixation"],
    "correctOption": 2,
    "explanation": "Carotenoids provide photoprotection by quenching excess energy and absorb wavelengths not efficiently absorbed by chlorophylls."
  },
  {
    "id": "q9",
    "question": "What are grana in chloroplasts?",
    "options": ["DNA molecules", "Stacks of thylakoids", "Protein complexes", "Starch granules"],
    "correctOption": 1,
    "explanation": "Grana are stacks of thylakoids that maximize surface area for light capture in chloroplasts."
  },
  {
    "id": "q10",
    "question": "Which scientist used radioactive carbon to map the carbon fixation pathway?",
    "options": ["Julius von Sachs", "Nicolas de Saussure", "Melvin Calvin", "Joseph Priestley"],
    "correctOption": 2,
    "explanation": "Melvin Calvin (1950s) used radioactive carbon (C-14) to map the carbon fixation pathway, now called the Calvin cycle."
  },
  {
    "id": "q11",
    "question": "What distinguishes autotrophs from heterotrophs?",
    "options": ["Cell structure", "Energy source", "Reproductive method", "Size"],
    "correctOption": 1,
    "explanation": "Autotrophs produce their own food from inorganic substances, while heterotrophs consume organic matter produced by autotrophs."
  },
  {
    "id": "q12",
    "question": "What is the thylakoid lumen?",
    "options": ["The outer chloroplast membrane", "The internal space of thylakoids", "The stroma matrix", "The granum structure"],
    "correctOption": 1,
    "explanation": "The thylakoid lumen is the internal space of thylakoids where proton gradients are established, driving ATP synthesis."
  },
  {
    "id": "q13",
    "question": "Why is photosynthesis considered the most important anabolic process?",
    "options": ["It produces oxygen", "It captures and converts light energy", "It removes CO2", "It creates biomass"],
    "correctOption": 1,
    "explanation": "Photosynthesis is the most important anabolic process because it captures and converts light energy into chemical energy that sustains ecosystems."
  },
  {
    "id": "q14",
    "question": "What would happen to Earth''s atmosphere without photosynthesis?",
    "options": ["More oxygen would be produced", "CO2 levels would be uncontrolled", "Temperature would decrease", "Water vapor would increase"],
    "correctOption": 1,
    "explanation": "Without photosynthesis, CO2 levels would accumulate excessively and oxygen would be depleted, making aerobic life impossible."
  },
  {
    "id": "q15",
    "question": "Which part of the chloroplast houses transport proteins?",
    "options": ["Outer membrane", "Inner membrane", "Stroma", "Thylakoids"],
    "correctOption": 1,
    "explanation": "The inner membrane of chloroplasts is selective and houses transport proteins that regulate metabolite movement."
  },
  {
    "id": "q16",
    "question": "What is an action spectrum in photosynthesis?",
    "options": ["Colors reflected by leaves", "Wavelengths that drive photosynthesis", "Chemical reactions in chloroplasts", "Energy levels of electrons"],
    "correctOption": 1,
    "explanation": "An action spectrum shows which wavelengths of light are most effective at driving photosynthetic reactions."
  },
  {
    "id": "q17",
    "question": "Who demonstrated that plant mass increase came mainly from water?",
    "options": ["Jan van Helmont", "Joseph Priestley", "Jan Ingenhousz", "Jean Senebier"],
    "correctOption": 0,
    "explanation": "Jan van Helmont (1600s) demonstrated that plant mass increase came mainly from water, not soil as previously thought."
  },
  {
    "id": "q18",
    "question": "What type of organisms are chemoautotrophs?",
    "options": ["Plants that use sunlight", "Animals that eat plants", "Bacteria that use chemical energy", "Fungi that decompose matter"],
    "correctOption": 2,
    "explanation": "Chemoautotrophs are bacteria that produce organic compounds using chemical energy instead of light energy."
  },
  {
    "id": "q19",
    "question": "Why do plants appear green to our eyes?",
    "options": ["They absorb green light", "They reflect green light", "They produce green pigments", "They store green compounds"],
    "correctOption": 1,
    "explanation": "Plants appear green because chlorophylls absorb blue and red light efficiently but reflect green light."
  },
  {
    "id": "q20",
    "question": "What is the primary advantage of having multiple photosynthetic pigments?",
    "options": ["Better water absorption", "Increased CO2 fixation", "Broader light absorption range", "Improved oxygen production"],
    "correctOption": 2,
    "explanation": "Multiple pigments allow plants to absorb a broader range of light wavelengths, maximizing energy capture."
  },
  {
    "id": "q21",
    "question": "Which scientist proved that plants absorb CO2 during photosynthesis?",
    "options": ["Jan Ingenhousz", "Jean Senebier", "Nicolas de Saussure", "Julius von Sachs"],
    "correctOption": 1,
    "explanation": "Jean Senebier (1782) found that plants absorb CO2 during photosynthesis."
  },
  {
    "id": "q22",
    "question": "What is the significance of the double membrane in chloroplasts?",
    "options": ["Increased surface area", "Compartmentalization and selective transport", "Light absorption", "Energy storage"],
    "correctOption": 1,
    "explanation": "The double membrane system provides compartmentalization and selective transport, essential for photosynthetic efficiency."
  },
  {
    "id": "q23",
    "question": "Who proved that chlorophyll is located in chloroplasts?",
    "options": ["Melvin Calvin", "Julius von Sachs", "Jean Senebier", "Jan Ingenhousz"],
    "correctOption": 1,
    "explanation": "Julius von Sachs (mid-1800s) proved that chlorophyll is located in chloroplasts and that starch is a product of photosynthesis."
  },
  {
    "id": "q24",
    "question": "What happens during photolysis in photosynthesis?",
    "options": ["CO2 is fixed", "Water molecules are split", "Glucose is formed", "ATP is consumed"],
    "correctOption": 1,
    "explanation": "Photolysis is the splitting of water molecules, which produces oxygen as a byproduct of photosynthesis."
  },
  {
    "id": "q25",
    "question": "Why is photosynthesis crucial for food security?",
    "options": ["It produces vitamins", "It creates the foundation of food chains", "It preserves food", "It increases food flavor"],
    "correctOption": 1,
    "explanation": "Photosynthesis creates glucose and other carbohydrates that form the foundation of all food chains and food security."
  },
  {
    "id": "q26",
    "question": "What is the role of xanthophylls in photosynthesis?",
    "options": ["Primary light absorption", "Energy dissipation as heat", "CO2 fixation", "Water transport"],
    "correctOption": 1,
    "explanation": "Xanthophylls are carotenoids involved in dissipating excess energy as heat to prevent photo-damage."
  },
  {
    "id": "q27",
    "question": "How does the structural arrangement of chloroplasts benefit photosynthesis?",
    "options": ["It increases cell size", "It separates but integrates light and dark reactions", "It reduces energy requirements", "It speeds up chemical reactions"],
    "correctOption": 1,
    "explanation": "The structural arrangement ensures light reactions and dark reactions are physically separated yet functionally integrated."
  },
  {
    "id": "q28",
    "question": "What quantified that both CO2 and water are required for photosynthesis?",
    "options": ["Jan van Helmont", "Joseph Priestley", "Nicolas de Saussure", "Jean Senebier"],
    "correctOption": 2,
    "explanation": "Nicolas de Saussure (1804) quantified that both CO2 and water are required for photosynthesis."
  },
  {
    "id": "q29",
    "question": "How does photosynthesis affect climate regulation?",
    "options": ["By producing heat", "By regulating CO2 levels", "By creating wind patterns", "By controlling humidity"],
    "correctOption": 1,
    "explanation": "Photosynthesis regulates atmospheric CO2 levels, preventing excessive accumulation and mitigating climate changes."
  },
  {
    "id": "q30",
    "question": "What makes the inner chloroplast membrane selective?",
    "options": ["Its thickness", "Transport proteins that regulate movement", "Chemical composition", "Surface area"],
    "correctOption": 1,
    "explanation": "The inner membrane contains transport proteins that regulate metabolite movement, making it selective unlike the permeable outer membrane."
  }
]');