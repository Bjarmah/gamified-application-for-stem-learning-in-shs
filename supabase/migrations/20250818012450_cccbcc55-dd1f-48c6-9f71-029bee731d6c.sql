-- Create remaining biology quizzes

-- Quiz for Light Reactions of Photosynthesis  
INSERT INTO quizzes (id, title, description, module_id, time_limit, passing_score, questions) VALUES
('4c1b1e05-2150-4ed3-80c5-cb88542d8fd2', 'Light Reactions of Photosynthesis Quiz', 'Master the light-dependent reactions, photosystems, and ATP/NADPH production', '4c1b1e05-2150-4ed3-80c5-cb88542d8fd2', 45, 70, '[
  {
    "id": "q1",
    "question": "Where do the light reactions of photosynthesis occur?",
    "options": ["Stroma", "Thylakoid membranes", "Cytoplasm", "Nucleus"],
    "correctOption": 1,
    "explanation": "Light reactions occur in the thylakoid membranes where photosystems and electron transport chains are embedded."
  },
  {
    "id": "q2",
    "question": "What is the primary function of Photosystem II (PSII)?",
    "options": ["NADPH production", "ATP synthesis", "Water splitting and initial electron excitation", "CO2 fixation"],
    "correctOption": 2,
    "explanation": "PSII splits water molecules and provides the initial energy boost to electrons using light energy."
  },
  {
    "id": "q3",
    "question": "What happens to water molecules in PSII?",
    "options": ["They are converted to glucose", "They are split to release oxygen", "They are used to make ATP", "They transport electrons"],
    "correctOption": 1,
    "explanation": "Water molecules are split (photolysis) in PSII, releasing oxygen as a byproduct and providing electrons."
  },
  {
    "id": "q4",
    "question": "What is the role of the electron transport chain in light reactions?",
    "options": ["CO2 fixation", "Glucose synthesis", "Creating proton gradients for ATP synthesis", "Water absorption"],
    "correctOption": 2,
    "explanation": "The electron transport chain moves protons across the thylakoid membrane, creating gradients that drive ATP synthesis."
  },
  {
    "id": "q5",
    "question": "What does Photosystem I (PSI) primarily produce?",
    "options": ["ATP", "NADPH", "Oxygen", "Glucose"],
    "correctOption": 1,
    "explanation": "PSI uses light energy to reduce NADP+ to NADPH, which is essential for the Calvin cycle."
  },
  {
    "id": "q6",
    "question": "What is photophosphorylation?",
    "options": ["CO2 fixation process", "Light-driven ATP synthesis", "Water splitting", "NADPH oxidation"],
    "correctOption": 1,
    "explanation": "Photophosphorylation is the light-driven synthesis of ATP from ADP and inorganic phosphate."
  },
  {
    "id": "q7",
    "question": "Which wavelength of light is most effective for photosystem activity?",
    "options": ["Green (550nm)", "Red (680-700nm)", "Yellow (570nm)", "Purple (400nm)"],
    "correctOption": 1,
    "explanation": "Red light (680-700nm) is most effectively absorbed by chlorophylls in the photosystems."
  },
  {
    "id": "q8",
    "question": "What is the Z-scheme in photosynthesis?",
    "options": ["A zigzag pattern of electron flow", "The Calvin cycle pathway", "Chloroplast structure", "Light absorption pattern"],
    "correctOption": 0,
    "explanation": "The Z-scheme describes the zigzag pattern of electron energy levels as they move through PSII and PSI."
  },
  {
    "id": "q9",
    "question": "What drives the synthesis of ATP in chloroplasts?",
    "options": ["Electron transport", "Proton gradient across thylakoid membrane", "CO2 concentration", "Water pressure"],
    "correctOption": 1,
    "explanation": "ATP synthesis is driven by the proton gradient (chemiosmosis) across the thylakoid membrane."
  },
  {
    "id": "q10",
    "question": "What is the oxygen-evolving complex (OEC)?",
    "options": ["Part of PSI", "The site of water splitting in PSII", "An ATP synthase component", "A NADPH reducer"],
    "correctOption": 1,
    "explanation": "The OEC is part of PSII where water molecules are split, releasing oxygen and providing electrons."
  },
  {
    "id": "q11",
    "question": "How many photons are required to move one electron through both photosystems?",
    "options": ["One", "Two", "Three", "Four"],
    "correctOption": 1,
    "explanation": "Two photons are required: one for PSII and one for PSI to move an electron through the entire system."
  },
  {
    "id": "q12",
    "question": "What is the primary electron acceptor in PSII?",
    "options": ["NADP+", "Pheophytin", "Plastoquinone", "Ferredoxin"],
    "correctOption": 1,
    "explanation": "Pheophytin is the primary electron acceptor in PSII, receiving electrons from excited chlorophyll."
  },
  {
    "id": "q13",
    "question": "What connects PSII and PSI in the electron transport chain?",
    "options": ["Cytochrome complex", "ATP synthase", "NADP reductase", "Water"],
    "correctOption": 0,
    "explanation": "The cytochrome complex (cytochrome b6f) connects PSII and PSI, transferring electrons between them."
  },
  {
    "id": "q14",
    "question": "What is cyclic photophosphorylation?",
    "options": ["ATP production using only PSI", "CO2 fixation cycle", "Water splitting cycle", "NADPH regeneration"],
    "correctOption": 0,
    "explanation": "Cyclic photophosphorylation produces ATP using only PSI when NADPH levels are sufficient but more ATP is needed."
  },
  {
    "id": "q15",
    "question": "Where are protons pumped during light reactions?",
    "options": ["Into the stroma", "Into the thylakoid lumen", "Out of the chloroplast", "Into the cytoplasm"],
    "correctOption": 1,
    "explanation": "Protons are pumped into the thylakoid lumen, creating the proton gradient needed for ATP synthesis."
  },
  {
    "id": "q16",
    "question": "What is the role of plastocyanin in light reactions?",
    "options": ["Electron carrier between cytochrome complex and PSI", "ATP synthesis", "Water splitting", "NADPH production"],
    "correctOption": 0,
    "explanation": "Plastocyanin is a mobile electron carrier that transfers electrons from the cytochrome complex to PSI."
  },
  {
    "id": "q17",
    "question": "How many molecules of water are split to produce one molecule of O2?",
    "options": ["One", "Two", "Three", "Four"],
    "correctOption": 1,
    "explanation": "Two water molecules are split to produce one molecule of oxygen: 2H2O → O2 + 4H+ + 4e-."
  },
  {
    "id": "q18",
    "question": "What is the final electron acceptor in linear electron flow?",
    "options": ["Oxygen", "NADP+", "ATP", "CO2"],
    "correctOption": 1,
    "explanation": "NADP+ is the final electron acceptor in linear electron flow, being reduced to NADPH by PSI."
  },
  {
    "id": "q19",
    "question": "What enzyme catalyzes ATP synthesis in chloroplasts?",
    "options": ["RuBisCO", "ATP synthase", "NADP reductase", "Cytochrome oxidase"],
    "correctOption": 1,
    "explanation": "ATP synthase (CF0-CF1 complex) catalyzes ATP synthesis using the proton gradient across thylakoid membranes."
  },
  {
    "id": "q20",
    "question": "What is the P680 reaction center?",
    "options": ["The chlorophyll molecule in PSI", "The chlorophyll molecule in PSII", "An electron acceptor", "A proton pump"],
    "correctOption": 1,
    "explanation": "P680 is the special chlorophyll molecule in PSII that absorbs 680nm light and initiates electron transport."
  },
  {
    "id": "q21",
    "question": "What happens to electrons after they leave PSII?",
    "options": ["They return to PSII", "They move through electron transport chain to PSI", "They are released as energy", "They combine with oxygen"],
    "correctOption": 1,
    "explanation": "Electrons from PSII move through the electron transport chain (including cytochrome complex) to PSI."
  },
  {
    "id": "q22",
    "question": "What is the P700 reaction center?",
    "options": ["The chlorophyll molecule in PSII", "The chlorophyll molecule in PSI", "An ATP synthase component", "A water-splitting enzyme"],
    "correctOption": 1,
    "explanation": "P700 is the special chlorophyll molecule in PSI that absorbs 700nm light for NADPH production."
  },
  {
    "id": "q23",
    "question": "What is the role of ferredoxin in light reactions?",
    "options": ["Water splitting", "Electron transfer from PSI to NADP+", "ATP synthesis", "Proton pumping"],
    "correctOption": 1,
    "explanation": "Ferredoxin receives electrons from PSI and transfers them to NADP reductase for NADPH formation."
  },
  {
    "id": "q24",
    "question": "Why is light essential for the light reactions?",
    "options": ["To split CO2", "To provide energy for electron excitation", "To create glucose", "To transport water"],
    "correctOption": 1,
    "explanation": "Light provides the energy needed to excite electrons in chlorophyll molecules of both photosystems."
  },
  {
    "id": "q25",
    "question": "What is non-cyclic photophosphorylation?",
    "options": ["ATP production using both PSII and PSI", "Only NADPH production", "Only oxygen production", "Calvin cycle reactions"],
    "correctOption": 0,
    "explanation": "Non-cyclic photophosphorylation uses both photosystems to produce ATP, NADPH, and oxygen simultaneously."
  },
  {
    "id": "q26",
    "question": "How does the thylakoid membrane maintain the proton gradient?",
    "options": ["By being permeable to all ions", "By being selectively impermeable to protons", "By actively removing electrons", "By absorbing light directly"],
    "correctOption": 1,
    "explanation": "The thylakoid membrane is selectively impermeable to protons, maintaining the gradient essential for ATP synthesis."
  },
  {
    "id": "q27",
    "question": "What is the significance of the antenna complex?",
    "options": ["ATP synthesis", "Light harvesting and funneling to reaction centers", "Electron transport", "CO2 fixation"],
    "correctOption": 1,
    "explanation": "Antenna complexes contain hundreds of pigment molecules that harvest light and funnel energy to reaction centers."
  },
  {
    "id": "q28",
    "question": "What determines the direction of electron flow in light reactions?",
    "options": ["Temperature", "Redox potential gradients", "pH levels", "Light intensity"],
    "correctOption": 1,
    "explanation": "Electron flow is determined by redox potential gradients, with electrons moving from lower to higher potential."
  },
  {
    "id": "q29",
    "question": "What is the role of quinones in the electron transport chain?",
    "options": ["Light absorption", "Mobile electron carriers", "ATP synthesis", "Water splitting"],
    "correctOption": 1,
    "explanation": "Quinones (like plastoquinone) serve as mobile electron carriers, shuttling electrons between membrane complexes."
  },
  {
    "id": "q30",
    "question": "How is the energy from light reactions used in the Calvin cycle?",
    "options": ["Directly as light", "As ATP and NADPH", "As oxygen", "As water"],
    "correctOption": 1,
    "explanation": "The Calvin cycle uses ATP and NADPH produced by light reactions to fix CO2 and synthesize glucose."
  }
]'),

-- Quiz for The Calvin Cycle
('8b0deb5a-04f6-4972-8685-09c137704042', 'Calvin Cycle Quiz', 'Test your knowledge of carbon fixation, reduction, and regeneration in the light-independent reactions', '8b0deb5a-04f6-4972-8685-09c137704042', 45, 70, '[
  {
    "id": "q1",
    "question": "Where does the Calvin cycle occur?",
    "options": ["Thylakoid membranes", "Stroma of chloroplasts", "Cytoplasm", "Cell nucleus"],
    "correctOption": 1,
    "explanation": "The Calvin cycle occurs in the stroma, the fluid-filled space inside chloroplasts."
  },
  {
    "id": "q2",
    "question": "What is the key enzyme in carbon fixation?",
    "options": ["ATP synthase", "RuBisCO", "NADP reductase", "Carbonic anhydrase"],
    "correctOption": 1,
    "explanation": "RuBisCO (Ribulose-1,5-bisphosphate carboxylase/oxygenase) is the key enzyme that fixes CO2 to RuBP."
  },
  {
    "id": "q3",
    "question": "What is the first stable product of carbon fixation?",
    "options": ["RuBP", "G3P", "3-phosphoglycerate (3-PGA)", "Glucose"],
    "correctOption": 2,
    "explanation": "3-phosphoglycerate (3-PGA) is the first stable 3-carbon product formed when CO2 is fixed to RuBP."
  },
  {
    "id": "q4",
    "question": "How many molecules of CO2 must be fixed to make one glucose molecule?",
    "options": ["Three", "Six", "Nine", "Twelve"],
    "correctOption": 1,
    "explanation": "Six molecules of CO2 must be fixed to make one glucose molecule (C6H12O6)."
  },
  {
    "id": "q5",
    "question": "What are the three main phases of the Calvin cycle?",
    "options": ["Fixation, oxidation, regeneration", "Fixation, reduction, regeneration", "Absorption, fixation, release", "Binding, transport, synthesis"],
    "correctOption": 1,
    "explanation": "The Calvin cycle has three phases: carbon fixation, reduction of 3-PGA to G3P, and regeneration of RuBP."
  },
  {
    "id": "q6",
    "question": "How many ATP molecules are required to fix one CO2 molecule?",
    "options": ["Two", "Three", "Four", "Six"],
    "correctOption": 1,
    "explanation": "Three ATP molecules are required per CO2 fixed: 2 for reduction and 1 for RuBP regeneration."
  },
  {
    "id": "q7",
    "question": "How many NADPH molecules are needed per CO2 fixed?",
    "options": ["One", "Two", "Three", "Four"],
    "correctOption": 1,
    "explanation": "Two NADPH molecules are required per CO2 fixed during the reduction phase of the Calvin cycle."
  },
  {
    "id": "q8",
    "question": "What is the role of G3P (glyceraldehyde-3-phosphate) in the Calvin cycle?",
    "options": ["CO2 acceptor", "Intermediate that can form glucose", "ATP source", "NADPH donor"],
    "correctOption": 1,
    "explanation": "G3P is the 3-carbon intermediate that can be used to synthesize glucose and other carbohydrates."
  },
  {
    "id": "q9",
    "question": "Why is RuBP regeneration essential?",
    "options": ["To produce glucose", "To maintain the cycle and continue CO2 fixation", "To generate ATP", "To split water"],
    "correctOption": 1,
    "explanation": "RuBP regeneration is essential to maintain the Calvin cycle and allow continuous CO2 fixation."
  },
  {
    "id": "q10",
    "question": "What is the net gain of G3P molecules per 3 CO2 fixed?",
    "options": ["One", "Two", "Three", "Six"],
    "correctOption": 0,
    "explanation": "For every 3 CO2 fixed, 6 G3P are produced, but 5 are used to regenerate RuBP, giving a net gain of 1 G3P."
  },
  {
    "id": "q11",
    "question": "What determines the rate of the Calvin cycle?",
    "options": ["Light intensity only", "CO2 concentration, ATP, and NADPH availability", "Temperature only", "Water availability"],
    "correctOption": 1,
    "explanation": "The Calvin cycle rate depends on CO2 concentration, ATP availability, NADPH availability, and temperature."
  },
  {
    "id": "q12",
    "question": "Why is the Calvin cycle also called light-independent reactions?",
    "options": ["It occurs in darkness", "It doesn''t directly require light", "It inhibits light reactions", "It produces light"],
    "correctOption": 1,
    "explanation": "The Calvin cycle doesn''t directly require light, but it needs ATP and NADPH produced by light-dependent reactions."
  },
  {
    "id": "q13",
    "question": "What happens to most of the G3P produced in the Calvin cycle?",
    "options": ["Converted to glucose immediately", "Used to regenerate RuBP", "Exported from chloroplasts", "Stored as starch"],
    "correctOption": 1,
    "explanation": "Five-sixths of the G3P produced is used to regenerate RuBP to keep the Calvin cycle operating."
  },
  {
    "id": "q14",
    "question": "How is the Calvin cycle regulated?",
    "options": ["Only by temperature", "By light-dependent enzyme activation and ATP/NADPH levels", "Only by CO2 concentration", "By water availability"],
    "correctOption": 1,
    "explanation": "The Calvin cycle is regulated by light-dependent enzyme activation and the availability of ATP and NADPH."
  },
  {
    "id": "q15",
    "question": "What is carbon fixation in biological terms?",
    "options": ["Converting organic carbon to CO2", "Converting inorganic CO2 to organic compounds", "Storing carbon in tissues", "Releasing carbon from plants"],
    "correctOption": 1,
    "explanation": "Carbon fixation is the process of converting inorganic CO2 into organic carbon compounds like glucose."
  },
  {
    "id": "q16",
    "question": "Why is RuBisCO considered the most abundant enzyme on Earth?",
    "options": ["It''s very efficient", "It''s inefficient and plants need lots of it", "It''s very small", "It works very fast"],
    "correctOption": 1,
    "explanation": "RuBisCO is relatively inefficient and works slowly, so plants need large amounts of it for adequate carbon fixation."
  },
  {
    "id": "q17",
    "question": "What is the molecular formula of RuBP?",
    "options": ["C5H8O11P2", "C6H12O6", "C3H7O6P", "C5H12O11P2"],
    "correctOption": 0,
    "explanation": "RuBP (ribulose-1,5-bisphosphate) is a 5-carbon sugar with two phosphate groups."
  },
  {
    "id": "q18",
    "question": "How many turns of the Calvin cycle are needed to produce one glucose molecule?",
    "options": ["Three", "Six", "Nine", "Twelve"],
    "correctOption": 1,
    "explanation": "Six turns of the Calvin cycle are needed to fix 6 CO2 molecules and produce enough G3P for one glucose."
  },
  {
    "id": "q19",
    "question": "What is the fate of the G3P that exits the Calvin cycle?",
    "options": ["It''s always converted to glucose", "It can form glucose, starch, sucrose, or other compounds", "It''s broken down immediately", "It returns to the cycle"],
    "correctOption": 1,
    "explanation": "G3P can be used to synthesize various carbohydrates including glucose, starch, sucrose, and cellulose."
  },
  {
    "id": "q20",
    "question": "What environmental factor most directly affects Calvin cycle efficiency?",
    "options": ["Humidity", "CO2 concentration", "Soil nutrients", "Wind speed"],
    "correctOption": 1,
    "explanation": "CO2 concentration directly affects the Calvin cycle efficiency since CO2 is the substrate for carbon fixation."
  },
  {
    "id": "q21",
    "question": "How does temperature affect the Calvin cycle?",
    "options": ["No effect", "Higher temperatures always increase rate", "Optimal temperature range for enzyme activity", "Only affects light reactions"],
    "correctOption": 2,
    "explanation": "The Calvin cycle has an optimal temperature range for maximum enzyme activity, with rates decreasing at extreme temperatures."
  },
  {
    "id": "q22",
    "question": "What is the stoichiometry for producing one glucose from the Calvin cycle?",
    "options": ["6CO2 + 12NADPH + 12ATP", "6CO2 + 12NADPH + 18ATP", "3CO2 + 6NADPH + 9ATP", "6CO2 + 6NADPH + 6ATP"],
    "correctOption": 1,
    "explanation": "Producing one glucose requires 6CO2, 12NADPH, and 18ATP through six turns of the Calvin cycle."
  },
  {
    "id": "q23",
    "question": "Why do plants make more carbohydrates than they immediately need?",
    "options": ["For energy storage and structure", "They can''t control production", "To waste excess energy", "For reproduction only"],
    "correctOption": 0,
    "explanation": "Plants produce excess carbohydrates for energy storage (starch), structural components (cellulose), and transport (sucrose)."
  },
  {
    "id": "q24",
    "question": "What links the light reactions and Calvin cycle?",
    "options": ["CO2 and O2", "ATP and NADPH", "Water and glucose", "Chlorophyll and enzymes"],
    "correctOption": 1,
    "explanation": "ATP and NADPH produced in light reactions provide the energy and reducing power for the Calvin cycle."
  },
  {
    "id": "q25",
    "question": "How does the Calvin cycle contribute to global carbon cycling?",
    "options": ["By releasing CO2", "By fixing atmospheric CO2 into biomass", "By producing oxygen", "By storing water"],
    "correctOption": 1,
    "explanation": "The Calvin cycle removes CO2 from the atmosphere and incorporates it into plant biomass, affecting global carbon balance."
  },
  {
    "id": "q26",
    "question": "What is photorespiration in relation to RuBisCO?",
    "options": ["Enhanced CO2 fixation", "When RuBisCO uses O2 instead of CO2", "Increased light absorption", "Faster Calvin cycle"],
    "correctOption": 1,
    "explanation": "Photorespiration occurs when RuBisCO fixes O2 instead of CO2, reducing photosynthetic efficiency."
  },
  {
    "id": "q27",
    "question": "Why is the Calvin cycle crucial for life on Earth?",
    "options": ["It produces oxygen", "It converts inorganic carbon to organic food", "It cleans the air", "It regulates temperature"],
    "correctOption": 1,
    "explanation": "The Calvin cycle is crucial because it converts inorganic CO2 into organic compounds that form the base of food webs."
  },
  {
    "id": "q28",
    "question": "What happens if ATP or NADPH becomes limiting in the Calvin cycle?",
    "options": ["More glucose is produced", "CO2 fixation rate decreases", "Light reactions speed up", "Temperature increases"],
    "correctOption": 1,
    "explanation": "When ATP or NADPH becomes limiting, the rate of CO2 fixation and the Calvin cycle decreases."
  },
  {
    "id": "q29",
    "question": "How do C4 and CAM plants modify the Calvin cycle?",
    "options": ["They eliminate it", "They concentrate CO2 to improve efficiency", "They run it in reverse", "They use different enzymes"],
    "correctOption": 1,
    "explanation": "C4 and CAM plants use additional carbon concentrating mechanisms to improve Calvin cycle efficiency in hot, dry conditions."
  },
  {
    "id": "q30",
    "question": "What is the relationship between photosynthesis and cellular respiration regarding the Calvin cycle?",
    "options": ["They''re unrelated", "Calvin cycle products can be used in cellular respiration", "They compete for the same molecules", "They occur simultaneously"],
    "correctOption": 1,
    "explanation": "Products of the Calvin cycle (like glucose) serve as substrates for cellular respiration, linking the two processes."
  }
]');