-- Create the remaining 3 cellular respiration quizzes

-- Quiz for Introduction to Cellular Respiration
INSERT INTO quizzes (id, title, description, module_id, time_limit, passing_score, questions) VALUES
('db9730e8-f6d8-4e17-ad16-b3fabf10732f', 'Introduction to Cellular Respiration Quiz', 'Master cellular respiration fundamentals, energy production, and glucose breakdown', 'db9730e8-f6d8-4e17-ad16-b3fabf10732f', 45, 70, '[
  {
    "id": "q1",
    "question": "What is the primary purpose of cellular respiration?",
    "options": ["To produce oxygen", "To extract energy from glucose", "To synthesize glucose", "To store carbon dioxide"],
    "correctOption": 1,
    "explanation": "Cellular respiration extracts energy from glucose and other organic molecules to produce ATP."
  },
  {
    "id": "q2",
    "question": "What is the overall equation for cellular respiration?",
    "options": ["C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP", "6CO2 + 6H2O → C6H12O6 + 6O2", "C6H12O6 → 2C3H6O3 + ATP", "2C3H6O3 + O2 → CO2 + H2O"],
    "correctOption": 0,
    "explanation": "Cellular respiration breaks down glucose with oxygen to produce carbon dioxide, water, and ATP energy."
  },
  {
    "id": "q3",
    "question": "Where does cellular respiration occur in eukaryotic cells?",
    "options": ["Only in chloroplasts", "Primarily in mitochondria", "Only in the nucleus", "Throughout the cytoplasm"],
    "correctOption": 1,
    "explanation": "Most cellular respiration occurs in mitochondria, though glycolysis happens in the cytoplasm."
  },
  {
    "id": "q4",
    "question": "What are the three main stages of cellular respiration?",
    "options": ["Glycolysis, photosynthesis, fermentation", "Glycolysis, Krebs cycle, electron transport chain", "Calvin cycle, light reactions, fermentation", "DNA replication, transcription, translation"],
    "correctOption": 1,
    "explanation": "The three main stages are glycolysis, Krebs cycle (citric acid cycle), and the electron transport chain."
  },
  {
    "id": "q5",
    "question": "What is ATP and why is it important?",
    "options": ["A storage carbohydrate", "The universal energy currency of cells", "A structural protein", "A genetic material"],
    "correctOption": 1,
    "explanation": "ATP (adenosine triphosphate) is the universal energy currency that powers cellular processes."
  },
  {
    "id": "q6",
    "question": "How is cellular respiration related to photosynthesis?",
    "options": ["They are identical processes", "They are opposite processes", "They occur simultaneously", "They have no relationship"],
    "correctOption": 1,
    "explanation": "Cellular respiration and photosynthesis are opposite processes: respiration breaks down glucose while photosynthesis builds it."
  },
  {
    "id": "q7",
    "question": "What type of process is cellular respiration?",
    "options": ["Anabolic", "Catabolic", "Synthetic", "Regulatory"],
    "correctOption": 1,
    "explanation": "Cellular respiration is a catabolic process because it breaks down complex molecules to release energy."
  },
  {
    "id": "q8",
    "question": "What is the theoretical maximum ATP yield from one glucose molecule?",
    "options": ["2 ATP", "32 ATP", "36-38 ATP", "100 ATP"],
    "correctOption": 2,
    "explanation": "The theoretical maximum yield is about 36-38 ATP molecules per glucose, though actual yields are often lower."
  },
  {
    "id": "q9",
    "question": "What happens during the oxidation of glucose?",
    "options": ["Glucose gains electrons", "Glucose loses electrons and hydrogen", "Glucose gains oxygen atoms", "Glucose becomes more reduced"],
    "correctOption": 1,
    "explanation": "During oxidation, glucose loses electrons and hydrogen atoms, which are transferred to electron carriers."
  },
  {
    "id": "q10",
    "question": "Which organisms can perform cellular respiration?",
    "options": ["Only animals", "Only plants", "Only bacteria", "Nearly all living organisms"],
    "correctOption": 3,
    "explanation": "Nearly all living organisms perform some form of cellular respiration to extract energy from organic molecules."
  },
  {
    "id": "q11",
    "question": "What is the role of oxygen in cellular respiration?",
    "options": ["It is produced as a waste product", "It serves as the final electron acceptor", "It breaks down glucose directly", "It synthesizes ATP"],
    "correctOption": 1,
    "explanation": "Oxygen serves as the final electron acceptor in the electron transport chain, allowing maximum ATP production."
  },
  {
    "id": "q12",
    "question": "What are the main electron carriers in cellular respiration?",
    "options": ["NAD+ and FAD", "ATP and ADP", "CO2 and H2O", "Glucose and oxygen"],
    "correctOption": 0,
    "explanation": "NAD+ and FAD are the main electron carriers that become reduced to NADH and FADH2 during respiration."
  },
  {
    "id": "q13",
    "question": "Why is cellular respiration essential for life?",
    "options": ["It produces oxygen", "It provides energy for cellular processes", "It creates new cells", "It removes waste products"],
    "correctOption": 1,
    "explanation": "Cellular respiration is essential because it provides the ATP energy needed for all cellular processes."
  },
  {
    "id": "q14",
    "question": "What is the difference between aerobic and anaerobic respiration?",
    "options": ["Aerobic uses oxygen, anaerobic does not", "Aerobic is faster than anaerobic", "Aerobic occurs in plants only", "There is no difference"],
    "correctOption": 0,
    "explanation": "Aerobic respiration requires oxygen and produces more ATP, while anaerobic respiration occurs without oxygen."
  },
  {
    "id": "q15",
    "question": "What is substrate-level phosphorylation?",
    "options": ["ATP synthesis using oxygen", "Direct transfer of phosphate to ADP", "Breakdown of glucose", "Formation of water"],
    "correctOption": 1,
    "explanation": "Substrate-level phosphorylation is the direct transfer of a phosphate group from a substrate to ADP to form ATP."
  },
  {
    "id": "q16",
    "question": "How does cellular respiration maintain homeostasis?",
    "options": ["By regulating temperature only", "By providing energy for cellular maintenance", "By producing oxygen", "By storing glucose"],
    "correctOption": 1,
    "explanation": "Cellular respiration provides the energy needed for cellular maintenance and metabolic processes essential for homeostasis."
  },
  {
    "id": "q17",
    "question": "What happens to the carbon atoms in glucose during respiration?",
    "options": ["They are stored in cells", "They are released as CO2", "They form new glucose", "They become part of ATP"],
    "correctOption": 1,
    "explanation": "The carbon atoms from glucose are ultimately released as carbon dioxide (CO2) during cellular respiration."
  },
  {
    "id": "q18",
    "question": "Which process can occur without mitochondria?",
    "options": ["Krebs cycle", "Electron transport chain", "Glycolysis", "Oxidative phosphorylation"],
    "correctOption": 2,
    "explanation": "Glycolysis occurs in the cytoplasm and can happen without mitochondria, unlike the other processes."
  },
  {
    "id": "q19",
    "question": "What is the significance of the mitochondrial cristae?",
    "options": ["DNA storage", "Increased surface area for respiration", "Glucose storage", "Waste removal"],
    "correctOption": 1,
    "explanation": "Cristae increase the surface area of the inner mitochondrial membrane, allowing more sites for ATP synthesis."
  },
  {
    "id": "q20",
    "question": "How do cells regulate the rate of cellular respiration?",
    "options": ["Through enzyme regulation and feedback mechanisms", "By changing temperature only", "By controlling oxygen levels only", "It cannot be regulated"],
    "correctOption": 0,
    "explanation": "Cells regulate respiration through enzyme regulation, allosteric control, and feedback inhibition mechanisms."
  },
  {
    "id": "q21",
    "question": "What is oxidative phosphorylation?",
    "options": ["Direct ATP synthesis from glucose", "ATP synthesis coupled to electron transport", "Breakdown of phosphate groups", "Formation of glucose"],
    "correctOption": 1,
    "explanation": "Oxidative phosphorylation is ATP synthesis coupled to the electron transport chain and oxygen consumption."
  },
  {
    "id": "q22",
    "question": "Why do cells need a continuous supply of oxygen?",
    "options": ["To break down glucose directly", "To maintain the electron transport chain", "To synthesize glucose", "To store energy"],
    "correctOption": 1,
    "explanation": "Oxygen is needed as the final electron acceptor to maintain the electron transport chain and maximize ATP production."
  },
  {
    "id": "q23",
    "question": "What is the relationship between cellular respiration and breathing?",
    "options": ["They are the same process", "Breathing provides oxygen for cellular respiration", "They are unrelated", "Breathing removes glucose"],
    "correctOption": 1,
    "explanation": "Breathing (ventilation) provides oxygen needed for cellular respiration and removes the CO2 produced."
  },
  {
    "id": "q24",
    "question": "How does cellular respiration efficiency compare in different organisms?",
    "options": ["All organisms have identical efficiency", "Efficiency varies with metabolic needs and environment", "Only mammals are efficient", "Plants are always more efficient"],
    "correctOption": 1,
    "explanation": "Respiratory efficiency varies among organisms based on their metabolic needs, lifestyle, and environmental conditions."
  },
  {
    "id": "q25",
    "question": "What is the role of coenzymes in cellular respiration?",
    "options": ["They provide structural support", "They facilitate enzyme reactions and electron transfer", "They store genetic information", "They break down glucose directly"],
    "correctOption": 1,
    "explanation": "Coenzymes like NAD+ and FAD facilitate enzyme reactions and serve as electron carriers in respiration."
  },
  {
    "id": "q26",
    "question": "How does temperature affect cellular respiration?",
    "options": ["No effect on respiration", "Higher temperatures always increase rate", "Optimal temperature range for enzyme activity", "Temperature only affects plants"],
    "correctOption": 2,
    "explanation": "Cellular respiration has an optimal temperature range; extreme temperatures can denature enzymes and reduce efficiency."
  },
  {
    "id": "q27",
    "question": "What is the evolutionary significance of cellular respiration?",
    "options": ["It evolved recently", "It enabled complex multicellular life", "It only benefits plants", "It has no evolutionary importance"],
    "correctOption": 1,
    "explanation": "Efficient cellular respiration enabled the evolution of complex, energy-demanding multicellular organisms."
  },
  {
    "id": "q28",
    "question": "How do poisons like cyanide affect cellular respiration?",
    "options": ["They enhance ATP production", "They block the electron transport chain", "They increase oxygen consumption", "They have no effect"],
    "correctOption": 1,
    "explanation": "Cyanide and similar poisons block the electron transport chain, preventing ATP synthesis and causing cell death."
  },
  {
    "id": "q29",
    "question": "What is the difference between cellular respiration and fermentation?",
    "options": ["Fermentation uses oxygen, respiration does not", "Respiration is more efficient and uses oxygen", "They produce the same amount of ATP", "There is no difference"],
    "correctOption": 1,
    "explanation": "Cellular respiration is more efficient and uses oxygen, while fermentation occurs without oxygen and produces less ATP."
  },
  {
    "id": "q30",
    "question": "Why is glucose the preferred fuel for cellular respiration?",
    "options": ["It is the only molecule cells can use", "It provides optimal energy yield and is readily available", "It contains oxygen", "It is the smallest energy molecule"],
    "correctOption": 1,
    "explanation": "Glucose is preferred because it provides excellent energy yield, is readily available, and can be efficiently broken down."
  }
]'),

-- Quiz for Glycolysis and Anaerobic Respiration
('7445a6cc-2e5b-4ceb-831b-f10e052cf004', 'Glycolysis and Anaerobic Respiration Quiz', 'Master glycolysis steps, fermentation processes, and anaerobic energy production', '7445a6cc-2e5b-4ceb-831b-f10e052cf004', 45, 70, '[
  {
    "id": "q1",
    "question": "Where does glycolysis occur in the cell?",
    "options": ["Mitochondrial matrix", "Cytoplasm", "Nucleus", "Endoplasmic reticulum"],
    "correctOption": 1,
    "explanation": "Glycolysis occurs in the cytoplasm of cells, outside the mitochondria."
  },
  {
    "id": "q2",
    "question": "What is the net ATP yield from glycolysis?",
    "options": ["2 ATP", "4 ATP", "6 ATP", "8 ATP"],
    "correctOption": 0,
    "explanation": "Glycolysis produces 4 ATP but uses 2 ATP, resulting in a net gain of 2 ATP molecules."
  },
  {
    "id": "q3",
    "question": "What is the end product of glycolysis?",
    "options": ["Glucose", "Pyruvate", "Acetyl-CoA", "Lactate"],
    "correctOption": 1,
    "explanation": "Glycolysis breaks down glucose into two molecules of pyruvate (pyruvic acid)."
  },
  {
    "id": "q4",
    "question": "How many steps are involved in glycolysis?",
    "options": ["5 steps", "8 steps", "10 steps", "12 steps"],
    "correctOption": 2,
    "explanation": "Glycolysis involves 10 enzymatic steps that convert glucose to pyruvate."
  },
  {
    "id": "q5",
    "question": "What happens during the energy investment phase of glycolysis?",
    "options": ["ATP is produced", "2 ATP molecules are consumed", "Pyruvate is formed", "CO2 is released"],
    "correctOption": 1,
    "explanation": "The first phase of glycolysis requires an investment of 2 ATP molecules to phosphorylate glucose."
  },
  {
    "id": "q6",
    "question": "Which enzyme catalyzes the first step of glycolysis?",
    "options": ["Pyruvate kinase", "Hexokinase", "Phosphofructokinase", "Aldolase"],
    "correctOption": 1,
    "explanation": "Hexokinase catalyzes the phosphorylation of glucose to glucose-6-phosphate in the first step."
  },
  {
    "id": "q7",
    "question": "What is the key regulatory enzyme of glycolysis?",
    "options": ["Hexokinase", "Phosphofructokinase (PFK)", "Pyruvate kinase", "Enolase"],
    "correctOption": 1,
    "explanation": "Phosphofructokinase (PFK) is the main regulatory enzyme that controls the rate of glycolysis."
  },
  {
    "id": "q8",
    "question": "What is produced along with ATP during glycolysis?",
    "options": ["FADH2", "NADH", "CO2", "O2"],
    "correctOption": 1,
    "explanation": "Glycolysis produces 2 NADH molecules along with 2 ATP (net) per glucose molecule."
  },
  {
    "id": "q9",
    "question": "When does fermentation occur?",
    "options": ["When oxygen is abundant", "When oxygen is absent or limited", "Only in plants", "During photosynthesis"],
    "correctOption": 1,
    "explanation": "Fermentation occurs when oxygen is absent or limited, allowing cells to continue producing ATP anaerobically."
  },
  {
    "id": "q10",
    "question": "What is the purpose of fermentation?",
    "options": ["To produce more ATP than aerobic respiration", "To regenerate NAD+ for continued glycolysis", "To produce oxygen", "To store energy"],
    "correctOption": 1,
    "explanation": "Fermentation regenerates NAD+ from NADH, allowing glycolysis to continue producing ATP in the absence of oxygen."
  },
  {
    "id": "q11",
    "question": "What are the two main types of fermentation?",
    "options": ["Alcoholic and citric acid", "Lactic acid and alcoholic", "Acetic acid and butyric acid", "Propionic and lactic acid"],
    "correctOption": 1,
    "explanation": "The two main types are lactic acid fermentation and alcoholic fermentation."
  },
  {
    "id": "q12",
    "question": "What is produced during alcoholic fermentation?",
    "options": ["Lactic acid and CO2", "Ethanol and CO2", "Acetic acid and H2O", "Methanol and O2"],
    "correctOption": 1,
    "explanation": "Alcoholic fermentation produces ethanol (ethyl alcohol) and carbon dioxide from pyruvate."
  },
  {
    "id": "q13",
    "question": "Which organisms commonly perform lactic acid fermentation?",
    "options": ["Yeast only", "Muscle cells and certain bacteria", "Plants only", "All animals"],
    "correctOption": 1,
    "explanation": "Lactic acid fermentation occurs in muscle cells during intense exercise and in certain bacteria."
  },
  {
    "id": "q14",
    "question": "What causes muscle fatigue during intense exercise?",
    "options": ["Lack of glucose", "Accumulation of lactic acid", "Excess oxygen", "Too much ATP"],
    "correctOption": 1,
    "explanation": "Muscle fatigue results from lactic acid accumulation during anaerobic respiration in oxygen-limited conditions."
  },
  {
    "id": "q15",
    "question": "How efficient is fermentation compared to aerobic respiration?",
    "options": ["More efficient", "Equally efficient", "Less efficient", "Depends on the organism"],
    "correctOption": 2,
    "explanation": "Fermentation is much less efficient, producing only 2 ATP per glucose compared to 36-38 ATP in aerobic respiration."
  },
  {
    "id": "q16",
    "question": "What is the fate of pyruvate in aerobic conditions?",
    "options": ["It becomes lactate", "It enters the mitochondria for further oxidation", "It is converted to ethanol", "It is excreted from the cell"],
    "correctOption": 1,
    "explanation": "In aerobic conditions, pyruvate enters mitochondria where it is further oxidized in the Krebs cycle."
  },
  {
    "id": "q17",
    "question": "Which step of glycolysis produces the most ATP?",
    "options": ["Glucose phosphorylation", "Fructose bisphosphate formation", "Phosphoenolpyruvate to pyruvate", "Glyceraldehyde-3-phosphate oxidation"],
    "correctOption": 2,
    "explanation": "The conversion of phosphoenolpyruvate to pyruvate by pyruvate kinase produces ATP through substrate-level phosphorylation."
  },
  {
    "id": "q18",
    "question": "What is substrate-level phosphorylation?",
    "options": ["ATP synthesis using electron transport", "Direct phosphate transfer from substrate to ADP", "Phosphorylation of glucose", "ATP breakdown"],
    "correctOption": 1,
    "explanation": "Substrate-level phosphorylation is the direct transfer of a phosphate group from a substrate molecule to ADP."
  },
  {
    "id": "q19",
    "question": "Why can glycolysis function without oxygen?",
    "options": ["It produces its own oxygen", "It doesn''t require electron transport chains", "It uses water instead of oxygen", "It occurs outside the cell"],
    "correctOption": 1,
    "explanation": "Glycolysis doesn''t require oxygen because it doesn''t involve electron transport chains or oxidative phosphorylation."
  },
  {
    "id": "q20",
    "question": "What is the Pasteur effect?",
    "options": ["Increased fermentation with oxygen", "Decreased fermentation with oxygen", "Enhanced glycolysis with CO2", "Inhibition of respiration"],
    "correctOption": 1,
    "explanation": "The Pasteur effect is the inhibition of fermentation by oxygen, as cells switch to more efficient aerobic respiration."
  },
  {
    "id": "q21",
    "question": "Which tissues rely heavily on glycolysis for energy?",
    "options": ["Heart muscle only", "Red blood cells and brain tissue", "Liver only", "Bone tissue"],
    "correctOption": 1,
    "explanation": "Red blood cells (lacking mitochondria) and brain tissue rely heavily on glycolysis for rapid ATP production."
  },
  {
    "id": "q22",
    "question": "What happens to NADH produced during glycolysis in anaerobic conditions?",
    "options": ["It enters the electron transport chain", "It is oxidized during fermentation", "It accumulates in the cell", "It is broken down"],
    "correctOption": 1,
    "explanation": "In anaerobic conditions, NADH is oxidized back to NAD+ during fermentation processes."
  },
  {
    "id": "q23",
    "question": "How is glycolysis regulated by ATP levels?",
    "options": ["ATP activates all glycolytic enzymes", "High ATP inhibits key enzymes like PFK", "ATP has no effect on glycolysis", "ATP only affects the last step"],
    "correctOption": 1,
    "explanation": "High ATP levels inhibit phosphofructokinase (PFK), slowing glycolysis when energy is abundant."
  },
  {
    "id": "q24",
    "question": "What is the role of magnesium in glycolysis?",
    "options": ["It provides energy", "It serves as a cofactor for enzymes", "It acts as a substrate", "It inhibits the process"],
    "correctOption": 1,
    "explanation": "Magnesium ions serve as essential cofactors for several glycolytic enzymes."
  },
  {
    "id": "q25",
    "question": "Why is glucose phosphorylated in the first step of glycolysis?",
    "options": ["To provide energy", "To trap glucose in the cell and activate it", "To break it down immediately", "To convert it to fructose"],
    "correctOption": 1,
    "explanation": "Glucose phosphorylation traps glucose in the cell (since phosphorylated glucose can''t cross the membrane) and activates it."
  },
  {
    "id": "q26",
    "question": "What is the significance of the aldolase reaction in glycolysis?",
    "options": ["It produces ATP", "It splits a 6-carbon molecule into two 3-carbon molecules", "It adds phosphate groups", "It removes water"],
    "correctOption": 1,
    "explanation": "Aldolase splits fructose-1,6-bisphosphate into two 3-carbon molecules (DHAP and G3P)."
  },
  {
    "id": "q27",
    "question": "How do cancer cells often modify their metabolism?",
    "options": ["They use more oxygen", "They rely more on glycolysis even with oxygen present", "They stop using glucose", "They only use aerobic respiration"],
    "correctOption": 1,
    "explanation": "Many cancer cells show increased reliance on glycolysis even in oxygen-rich conditions (Warburg effect)."
  },
  {
    "id": "q28",
    "question": "What is the evolutionary significance of glycolysis?",
    "options": ["It evolved recently", "It is one of the most ancient metabolic pathways", "It only exists in complex organisms", "It replaced fermentation"],
    "correctOption": 1,
    "explanation": "Glycolysis is one of the most ancient and universal metabolic pathways, predating the evolution of oxygen-rich atmosphere."
  },
  {
    "id": "q29",
    "question": "How does insulin affect glycolysis?",
    "options": ["It inhibits glycolysis", "It promotes glucose uptake and glycolysis", "It has no effect", "It converts glucose to fat only"],
    "correctOption": 1,
    "explanation": "Insulin promotes glucose uptake by cells and stimulates key glycolytic enzymes, increasing glucose metabolism."
  },
  {
    "id": "q30",
    "question": "What is the difference between aerobic and anaerobic glycolysis?",
    "options": ["Different enzymes are used", "The pathway is identical, but the fate of pyruvate differs", "Anaerobic uses oxygen", "They occur in different locations"],
    "correctOption": 1,
    "explanation": "The glycolytic pathway itself is identical; the difference lies in what happens to pyruvate and NADH afterward."
  }
]'),

-- Quiz for Aerobic Respiration: Krebs Cycle and Electron Transport Chain
('f894a855-52cb-4259-95ea-1585ac315349', 'Aerobic Respiration: Krebs Cycle and ETC Quiz', 'Master the citric acid cycle, electron transport chain, and oxidative phosphorylation', 'f894a855-52cb-4259-95ea-1585ac315349', 45, 70, '[
  {
    "id": "q1",
    "question": "Where does the Krebs cycle occur?",
    "options": ["Cytoplasm", "Mitochondrial matrix", "Outer mitochondrial membrane", "Intermembrane space"],
    "correctOption": 1,
    "explanation": "The Krebs cycle (citric acid cycle) occurs in the mitochondrial matrix."
  },
  {
    "id": "q2",
    "question": "What happens to pyruvate before entering the Krebs cycle?",
    "options": ["It is converted to lactate", "It is oxidized to acetyl-CoA", "It remains unchanged", "It is phosphorylated"],
    "correctOption": 1,
    "explanation": "Pyruvate is oxidized to acetyl-CoA by pyruvate dehydrogenase complex, releasing CO2 and producing NADH."
  },
  {
    "id": "q3",
    "question": "How many turns of the Krebs cycle are needed to completely oxidize one glucose molecule?",
    "options": ["One", "Two", "Three", "Six"],
    "correctOption": 1,
    "explanation": "Since one glucose produces two pyruvate molecules, two turns of the Krebs cycle are needed."
  },
  {
    "id": "q4",
    "question": "What is the first product formed when acetyl-CoA enters the Krebs cycle?",
    "options": ["Succinate", "Citrate", "α-ketoglutarate", "Malate"],
    "correctOption": 1,
    "explanation": "Acetyl-CoA combines with oxaloacetate to form citrate in the first step of the Krebs cycle."
  },
  {
    "id": "q5",
    "question": "How many CO2 molecules are released per turn of the Krebs cycle?",
    "options": ["One", "Two", "Three", "Four"],
    "correctOption": 1,
    "explanation": "Two molecules of CO2 are released per turn of the Krebs cycle through decarboxylation reactions."
  },
  {
    "id": "q6",
    "question": "How many NADH molecules are produced per turn of the Krebs cycle?",
    "options": ["Two", "Three", "Four", "Six"],
    "correctOption": 1,
    "explanation": "Three NADH molecules are produced per turn of the Krebs cycle."
  },
  {
    "id": "q7",
    "question": "How many FADH2 molecules are produced per turn of the Krebs cycle?",
    "options": ["One", "Two", "Three", "Four"],
    "correctOption": 0,
    "explanation": "One FADH2 molecule is produced per turn of the Krebs cycle during the succinate to fumarate conversion."
  },
  {
    "id": "q8",
    "question": "What is the role of coenzyme A in the Krebs cycle?",
    "options": ["It provides energy", "It carries acetyl groups", "It acts as an electron acceptor", "It produces CO2"],
    "correctOption": 1,
    "explanation": "Coenzyme A carries acetyl groups and is essential for transferring them into the Krebs cycle."
  },
  {
    "id": "q9",
    "question": "Where is the electron transport chain located?",
    "options": ["Cytoplasm", "Mitochondrial matrix", "Inner mitochondrial membrane", "Outer mitochondrial membrane"],
    "correctOption": 2,
    "explanation": "The electron transport chain is embedded in the inner mitochondrial membrane."
  },
  {
    "id": "q10",
    "question": "What is the final electron acceptor in aerobic respiration?",
    "options": ["CO2", "H2O", "O2", "NAD+"],
    "correctOption": 2,
    "explanation": "Oxygen (O2) is the final electron acceptor in aerobic respiration, being reduced to form water."
  },
  {
    "id": "q11",
    "question": "What are the main components of the electron transport chain?",
    "options": ["Only cytochromes", "Complexes I, II, III, and IV", "Only NADH and FADH2", "ATP synthase only"],
    "correctOption": 1,
    "explanation": "The electron transport chain consists of four main protein complexes (I-IV) plus coenzyme Q and cytochrome c."
  },
  {
    "id": "q12",
    "question": "What is chemiosmosis?",
    "options": ["Direct ATP synthesis", "ATP synthesis driven by proton gradient", "Electron transport", "CO2 production"],
    "correctOption": 1,
    "explanation": "Chemiosmosis is the process of ATP synthesis driven by the proton gradient across the inner mitochondrial membrane."
  },
  {
    "id": "q13",
    "question": "How many ATP molecules can theoretically be produced from one NADH?",
    "options": ["1.5 ATP", "2.5 ATP", "3.5 ATP", "4 ATP"],
    "correctOption": 1,
    "explanation": "One NADH can theoretically produce about 2.5 ATP molecules through oxidative phosphorylation."
  },
  {
    "id": "q14",
    "question": "How many ATP molecules can theoretically be produced from one FADH2?",
    "options": ["1.5 ATP", "2.5 ATP", "3.5 ATP", "4 ATP"],
    "correctOption": 0,
    "explanation": "One FADH2 can theoretically produce about 1.5 ATP molecules through oxidative phosphorylation."
  },
  {
    "id": "q15",
    "question": "What is the function of ATP synthase?",
    "options": ["Electron transport", "Proton pumping", "ATP synthesis from ADP and Pi", "CO2 production"],
    "correctOption": 2,
    "explanation": "ATP synthase synthesizes ATP from ADP and inorganic phosphate using the energy from proton flow."
  },
  {
    "id": "q16",
    "question": "What is oxidative phosphorylation?",
    "options": ["Glucose oxidation", "ATP synthesis coupled to electron transport", "Phosphate removal", "Direct energy transfer"],
    "correctOption": 1,
    "explanation": "Oxidative phosphorylation is ATP synthesis coupled to electron transport and oxygen consumption."
  },
  {
    "id": "q17",
    "question": "What creates the proton gradient in mitochondria?",
    "options": ["ATP synthase", "Proton pumping by electron transport complexes", "CO2 production", "Water formation"],
    "correctOption": 1,
    "explanation": "Electron transport complexes pump protons from the matrix to the intermembrane space, creating the gradient."
  },
  {
    "id": "q18",
    "question": "What is the P/O ratio?",
    "options": ["Pyruvate to oxygen ratio", "Phosphate to oxygen ratio (ATP yield)", "Protein to oxygen ratio", "pH to oxygen ratio"],
    "correctOption": 1,
    "explanation": "The P/O ratio represents the number of ATP molecules synthesized per oxygen atom consumed."
  },
  {
    "id": "q19",
    "question": "How does cyanide affect cellular respiration?",
    "options": ["It enhances electron transport", "It blocks Complex IV", "It increases ATP production", "It has no effect"],
    "correctOption": 1,
    "explanation": "Cyanide blocks Complex IV of the electron transport chain, preventing oxygen reduction and ATP synthesis."
  },
  {
    "id": "q20",
    "question": "What is the role of coenzyme Q (ubiquinone)?",
    "options": ["ATP synthesis", "Mobile electron carrier between complexes", "Proton pumping", "CO2 fixation"],
    "correctOption": 1,
    "explanation": "Coenzyme Q is a mobile electron carrier that transfers electrons between Complexes I/II and Complex III."
  },
  {
    "id": "q21",
    "question": "What is uncoupling in mitochondria?",
    "options": ["Enhanced ATP synthesis", "Separation of electron transport from ATP synthesis", "Increased oxygen consumption", "Decreased heat production"],
    "correctOption": 1,
    "explanation": "Uncoupling separates electron transport from ATP synthesis, releasing energy as heat instead of capturing it in ATP."
  },
  {
    "id": "q22",
    "question": "What is the role of cytochrome c in electron transport?",
    "options": ["Proton pumping", "Mobile electron carrier between complexes III and IV", "ATP synthesis", "Oxygen binding"],
    "correctOption": 1,
    "explanation": "Cytochrome c is a mobile electron carrier that transfers electrons from Complex III to Complex IV."
  },
  {
    "id": "q23",
    "question": "Why is oxygen essential for maximum ATP production?",
    "options": ["It provides carbon for ATP", "It serves as the final electron acceptor", "It breaks down glucose", "It synthesizes NADH"],
    "correctOption": 1,
    "explanation": "Oxygen is essential as the final electron acceptor, allowing the electron transport chain to operate and produce maximum ATP."
  },
  {
    "id": "q24",
    "question": "What happens during substrate-level phosphorylation in the Krebs cycle?",
    "options": ["Direct ATP formation from GTP", "Electron transport", "Proton pumping", "CO2 release"],
    "correctOption": 0,
    "explanation": "Substrate-level phosphorylation in the Krebs cycle produces GTP (equivalent to ATP) directly from succinyl-CoA."
  },
  {
    "id": "q25",
    "question": "How is the Krebs cycle regulated?",
    "options": ["Only by temperature", "By product inhibition and allosteric regulation", "By oxygen levels only", "It runs continuously"],
    "correctOption": 1,
    "explanation": "The Krebs cycle is regulated by product inhibition, allosteric regulation, and covalent modification of key enzymes."
  },
  {
    "id": "q26",
    "question": "What is the significance of the cristae in mitochondria?",
    "options": ["DNA storage", "Increased surface area for electron transport", "Protein synthesis", "Lipid storage"],
    "correctOption": 1,
    "explanation": "Cristae increase the surface area of the inner membrane, providing more space for electron transport complexes."
  },
  {
    "id": "q27",
    "question": "How does DNP (dinitrophenol) affect mitochondrial function?",
    "options": ["It enhances ATP synthesis", "It acts as an uncoupler", "It blocks electron transport", "It increases oxygen consumption only"],
    "correctOption": 1,
    "explanation": "DNP is an uncoupler that allows protons to bypass ATP synthase, releasing energy as heat instead of ATP."
  },
  {
    "id": "q28",
    "question": "What is the total theoretical ATP yield from one glucose molecule?",
    "options": ["32 ATP", "36-38 ATP", "40 ATP", "50 ATP"],
    "correctOption": 1,
    "explanation": "The theoretical maximum yield is about 36-38 ATP molecules per glucose through complete aerobic respiration."
  },
  {
    "id": "q29",
    "question": "Why do actual ATP yields often fall short of theoretical maximum?",
    "options": ["Enzymes are inefficient", "Proton leak and transport costs", "Oxygen limitation", "Temperature effects"],
    "correctOption": 1,
    "explanation": "Actual yields are lower due to proton leak across membranes and energy costs of transporting metabolites."
  },
  {
    "id": "q30",
    "question": "How do brown fat cells generate heat?",
    "options": ["By burning glucose directly", "Through uncoupling proteins (thermogenin)", "By increasing electron transport", "By storing more ATP"],
    "correctOption": 1,
    "explanation": "Brown fat cells contain uncoupling proteins (thermogenin) that allow energy to be released as heat for thermogenesis."
  }
]');