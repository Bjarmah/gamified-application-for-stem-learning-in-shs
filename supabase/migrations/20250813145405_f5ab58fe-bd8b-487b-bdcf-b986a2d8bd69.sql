-- Create Chemistry quizzes

-- Alchemy Academy: The Periodic Table Adventure Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Periodic Table Adventure Quiz',
  'Master atomic structure, periodic trends, and element properties',
  '98198175-69b2-47d5-bf14-e5dea0b09ccb',
  '[
    {
      "id": 1,
      "question": "Which subatomic particle determines the atomic number of an element?",
      "options": ["Neutrons", "Protons", "Electrons", "Quarks"],
      "correctAnswer": 1,
      "explanation": "The atomic number is defined by the number of protons in the nucleus."
    },
    {
      "id": 2,
      "question": "What happens to atomic radius as you move down a group in the periodic table?",
      "options": ["Decreases", "Increases", "Stays the same", "Becomes zero"],
      "correctAnswer": 1,
      "explanation": "Atomic radius increases down a group due to additional electron shells."
    },
    {
      "id": 3,
      "question": "Which group contains the noble gases?",
      "options": ["Group 1", "Group 17", "Group 18", "Group 2"],
      "correctAnswer": 2,
      "explanation": "Group 18 (formerly Group VIII) contains the noble gases with complete electron shells."
    },
    {
      "id": 4,
      "question": "What is the electron configuration of sodium (Na)?",
      "options": ["1s² 2s² 2p⁶ 3s¹", "1s² 2s² 2p⁵", "1s² 2s² 2p⁶ 3s²", "1s² 2s¹"],
      "correctAnswer": 0,
      "explanation": "Sodium has 11 electrons: 2 in 1s, 2 in 2s, 6 in 2p, and 1 in 3s."
    },
    {
      "id": 5,
      "question": "Which element has the highest electronegativity?",
      "options": ["Oxygen", "Nitrogen", "Fluorine", "Chlorine"],
      "correctAnswer": 2,
      "explanation": "Fluorine has the highest electronegativity value of 4.0 on the Pauling scale."
    },
    {
      "id": 6,
      "question": "What type of bond forms between a metal and a nonmetal?",
      "options": ["Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"],
      "correctAnswer": 1,
      "explanation": "Metals lose electrons and nonmetals gain electrons, forming ionic bonds."
    },
    {
      "id": 7,
      "question": "How many valence electrons does carbon have?",
      "options": ["2", "4", "6", "8"],
      "correctAnswer": 1,
      "explanation": "Carbon is in Group 14, so it has 4 valence electrons."
    },
    {
      "id": 8,
      "question": "Which period contains the element chlorine?",
      "options": ["Period 2", "Period 3", "Period 4", "Period 5"],
      "correctAnswer": 1,
      "explanation": "Chlorine (Cl) is in Period 3 of the periodic table."
    },
    {
      "id": 9,
      "question": "What is the maximum number of electrons in the p sublevel?",
      "options": ["2", "6", "10", "14"],
      "correctAnswer": 1,
      "explanation": "The p sublevel has 3 orbitals, each holding 2 electrons maximum (3 × 2 = 6)."
    },
    {
      "id": 10,
      "question": "Which property generally decreases across a period from left to right?",
      "options": ["Atomic radius", "Ionization energy", "Electronegativity", "Nuclear charge"],
      "correctAnswer": 0,
      "explanation": "Atomic radius decreases across a period due to increased nuclear charge pulling electrons closer."
    }
  ]'::jsonb,
  600,
  70
);

-- Molecular Kitchen: Organic Chemistry Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Organic Chemistry Kitchen Quiz',
  'Test your knowledge of organic compounds, functional groups, and reactions',
  'faec09fd-ba11-4ad8-a622-ddb72b978d91',
  '[
    {
      "id": 1,
      "question": "What is the functional group in alcohols?",
      "options": ["-COOH", "-OH", "-CHO", "-NH2"],
      "correctAnswer": 1,
      "explanation": "Alcohols contain the hydroxyl (-OH) functional group."
    },
    {
      "id": 2,
      "question": "How many bonds can carbon form?",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": 2,
      "explanation": "Carbon has 4 valence electrons and can form 4 covalent bonds."
    },
    {
      "id": 3,
      "question": "What is the molecular formula for methane?",
      "options": ["CH3", "CH4", "C2H6", "C2H4"],
      "correctAnswer": 1,
      "explanation": "Methane is the simplest alkane with one carbon and four hydrogens (CH4)."
    },
    {
      "id": 4,
      "question": "Which functional group is characteristic of carboxylic acids?",
      "options": ["-OH", "-CHO", "-COOH", "-NH2"],
      "correctAnswer": 2,
      "explanation": "Carboxylic acids contain the carboxyl group (-COOH)."
    },
    {
      "id": 5,
      "question": "What type of reaction occurs when an alkene reacts with hydrogen?",
      "options": ["Substitution", "Addition", "Elimination", "Oxidation"],
      "correctAnswer": 1,
      "explanation": "Adding hydrogen to an alkene is an addition reaction, specifically hydrogenation."
    },
    {
      "id": 6,
      "question": "Which of these is an isomer of butane (C4H10)?",
      "options": ["Propane", "2-methylpropane", "Pentane", "Ethane"],
      "correctAnswer": 1,
      "explanation": "2-methylpropane (isobutane) has the same molecular formula as butane but different structure."
    },
    {
      "id": 7,
      "question": "What is the general formula for alkanes?",
      "options": ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
      "correctAnswer": 1,
      "explanation": "Alkanes are saturated hydrocarbons with formula CnH2n+2."
    },
    {
      "id": 8,
      "question": "Which compound would be produced by oxidizing a primary alcohol?",
      "options": ["Ketone", "Aldehyde", "Ether", "Alkane"],
      "correctAnswer": 1,
      "explanation": "Primary alcohols oxidize first to aldehydes, then to carboxylic acids."
    },
    {
      "id": 9,
      "question": "What type of hydrocarbon contains a benzene ring?",
      "options": ["Alkane", "Alkene", "Alkyne", "Aromatic"],
      "correctAnswer": 3,
      "explanation": "Aromatic compounds contain benzene rings with delocalized electrons."
    },
    {
      "id": 10,
      "question": "Which process is used to separate crude oil into different fractions?",
      "options": ["Filtration", "Distillation", "Crystallization", "Chromatography"],
      "correctAnswer": 1,
      "explanation": "Fractional distillation separates crude oil based on different boiling points."
    }
  ]'::jsonb,
  600,
  70
);

-- Elective ICT quizzes

-- Code Warriors: Programming Battle Arena Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Programming Battle Arena Quiz',
  'Test your programming concepts, algorithms, and problem-solving skills',
  '2d80d343-3848-44f3-90d2-b5e2ec76cb49',
  '[
    {
      "id": 1,
      "question": "What is a variable in programming?",
      "options": ["A fixed value", "A named storage location", "A type of loop", "A function"],
      "correctAnswer": 1,
      "explanation": "A variable is a named storage location that can hold different values during program execution."
    },
    {
      "id": 2,
      "question": "Which data type would you use to store a whole number?",
      "options": ["Float", "String", "Integer", "Boolean"],
      "correctAnswer": 2,
      "explanation": "Integer data type is used to store whole numbers without decimal points."
    },
    {
      "id": 3,
      "question": "What is the purpose of a loop in programming?",
      "options": ["Store data", "Make decisions", "Repeat code", "Define functions"],
      "correctAnswer": 2,
      "explanation": "Loops are used to repeat a block of code multiple times."
    },
    {
      "id": 4,
      "question": "Which symbol is typically used for assignment in most programming languages?",
      "options": ["==", "=", "!=", "<="],
      "correctAnswer": 1,
      "explanation": "The single equals sign (=) is used for assignment in most programming languages."
    },
    {
      "id": 5,
      "question": "What is an algorithm?",
      "options": ["A programming language", "A step-by-step procedure", "A data type", "A variable"],
      "correctAnswer": 1,
      "explanation": "An algorithm is a step-by-step procedure for solving a problem."
    },
    {
      "id": 6,
      "question": "Which control structure allows you to make decisions in code?",
      "options": ["Loop", "Array", "If statement", "Variable"],
      "correctAnswer": 2,
      "explanation": "If statements allow programs to make decisions based on conditions."
    },
    {
      "id": 7,
      "question": "What is debugging?",
      "options": ["Writing new code", "Finding and fixing errors", "Running programs", "Saving files"],
      "correctAnswer": 1,
      "explanation": "Debugging is the process of finding and fixing errors (bugs) in code."
    },
    {
      "id": 8,
      "question": "What is a function in programming?",
      "options": ["A type of variable", "A reusable block of code", "A data structure", "A loop"],
      "correctAnswer": 1,
      "explanation": "A function is a reusable block of code that performs a specific task."
    },
    {
      "id": 9,
      "question": "Which of these is a comparison operator?",
      "options": ["=", "+", "==", "*"],
      "correctAnswer": 2,
      "explanation": "== is a comparison operator used to check if two values are equal."
    },
    {
      "id": 10,
      "question": "What is pseudocode?",
      "options": ["A programming language", "Plain language description of code logic", "A type of error", "A data type"],
      "correctAnswer": 1,
      "explanation": "Pseudocode is a plain language description of programming logic before writing actual code."
    }
  ]'::jsonb,
  600,
  70
);

-- Web Builder Tycoon: Digital Empire Creator Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Digital Empire Creator Quiz',
  'Master web development, HTML, CSS, and database concepts',
  '4d74ab67-7995-4820-b851-18c02f694393',
  '[
    {
      "id": 1,
      "question": "What does HTML stand for?",
      "options": ["Hypertext Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"],
      "correctAnswer": 0,
      "explanation": "HTML stands for Hypertext Markup Language, used for creating web pages."
    },
    {
      "id": 2,
      "question": "Which HTML tag is used to create a hyperlink?",
      "options": ["<link>", "<a>", "<href>", "<url>"],
      "correctAnswer": 1,
      "explanation": "The <a> (anchor) tag is used to create hyperlinks in HTML."
    },
    {
      "id": 3,
      "question": "What does CSS stand for?",
      "options": ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      "correctAnswer": 1,
      "explanation": "CSS stands for Cascading Style Sheets, used for styling web pages."
    },
    {
      "id": 4,
      "question": "Which HTML tag is used to display images?",
      "options": ["<image>", "<img>", "<pic>", "<photo>"],
      "correctAnswer": 1,
      "explanation": "The <img> tag is used to embed images in HTML documents."
    },
    {
      "id": 5,
      "question": "What is a database?",
      "options": ["A programming language", "An organized collection of data", "A type of website", "A web browser"],
      "correctAnswer": 1,
      "explanation": "A database is an organized collection of structured data stored electronically."
    },
    {
      "id": 6,
      "question": "Which CSS property is used to change text color?",
      "options": ["font-color", "text-color", "color", "font-style"],
      "correctAnswer": 2,
      "explanation": "The ''color'' property in CSS is used to change the color of text."
    },
    {
      "id": 7,
      "question": "What does SQL stand for?",
      "options": ["Simple Query Language", "Structured Query Language", "Standard Query Language", "System Query Language"],
      "correctAnswer": 1,
      "explanation": "SQL stands for Structured Query Language, used for managing databases."
    },
    {
      "id": 8,
      "question": "Which HTML element defines the main content area?",
      "options": ["<header>", "<footer>", "<main>", "<sidebar>"],
      "correctAnswer": 2,
      "explanation": "The <main> element represents the main content area of a document."
    },
    {
      "id": 9,
      "question": "What is responsive web design?",
      "options": ["Fast loading websites", "Websites that respond to user clicks", "Design that adapts to different screen sizes", "Interactive websites"],
      "correctAnswer": 2,
      "explanation": "Responsive web design creates websites that adapt to different screen sizes and devices."
    },
    {
      "id": 10,
      "question": "Which HTTP status code indicates ''Page Not Found''?",
      "options": ["200", "301", "404", "500"],
      "correctAnswer": 2,
      "explanation": "HTTP status code 404 indicates that the requested page was not found."
    }
  ]'::jsonb,
  600,
  70
);

-- Physics quizzes

-- Energy Empire: Power Up the Future Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Energy Empire Quiz',
  'Master energy forms, conservation, and transformations',
  'f2e95a61-f9f4-479a-9100-f0f0898c9d1a',
  '[
    {
      "id": 1,
      "question": "What is kinetic energy?",
      "options": ["Energy stored in position", "Energy of motion", "Energy from heat", "Energy from light"],
      "correctAnswer": 1,
      "explanation": "Kinetic energy is the energy possessed by an object due to its motion."
    },
    {
      "id": 2,
      "question": "What is the SI unit of energy?",
      "options": ["Watt", "Newton", "Joule", "Kilogram"],
      "correctAnswer": 2,
      "explanation": "The joule (J) is the SI unit of energy, work, and heat."
    },
    {
      "id": 3,
      "question": "According to the law of conservation of energy:",
      "options": ["Energy can be created", "Energy can be destroyed", "Energy cannot be created or destroyed", "Energy always increases"],
      "correctAnswer": 2,
      "explanation": "The law of conservation of energy states that energy cannot be created or destroyed, only transformed."
    },
    {
      "id": 4,
      "question": "What type of energy does a stretched spring possess?",
      "options": ["Kinetic energy", "Thermal energy", "Potential energy", "Chemical energy"],
      "correctAnswer": 2,
      "explanation": "A stretched spring possesses elastic potential energy due to its deformed position."
    },
    {
      "id": 5,
      "question": "Which energy transformation occurs in a generator?",
      "options": ["Chemical to electrical", "Mechanical to electrical", "Thermal to mechanical", "Light to chemical"],
      "correctAnswer": 1,
      "explanation": "A generator converts mechanical energy (motion) into electrical energy."
    },
    {
      "id": 6,
      "question": "What is power in physics?",
      "options": ["Amount of energy", "Rate of doing work", "Force applied", "Distance traveled"],
      "correctAnswer": 1,
      "explanation": "Power is the rate of doing work or transferring energy, measured in watts."
    },
    {
      "id": 7,
      "question": "Solar panels convert which type of energy?",
      "options": ["Thermal to electrical", "Light to electrical", "Chemical to electrical", "Mechanical to electrical"],
      "correctAnswer": 1,
      "explanation": "Solar panels convert light energy (photons) directly into electrical energy."
    },
    {
      "id": 8,
      "question": "What happens to the total energy in a closed system?",
      "options": ["It increases", "It decreases", "It remains constant", "It becomes zero"],
      "correctAnswer": 2,
      "explanation": "In a closed system, total energy remains constant due to conservation of energy."
    },
    {
      "id": 9,
      "question": "Which has more kinetic energy: a 2kg object at 10 m/s or a 1kg object at 14 m/s?",
      "options": ["2kg object", "1kg object", "Same amount", "Cannot determine"],
      "correctAnswer": 1,
      "explanation": "KE = ½mv². For 2kg: ½(2)(10)² = 100J. For 1kg: ½(1)(14)² = 98J. The 1kg object has more."
    },
    {
      "id": 10,
      "question": "Geothermal energy comes from:",
      "options": ["Wind", "Water", "Earth''s internal heat", "Ocean waves"],
      "correctAnswer": 2,
      "explanation": "Geothermal energy harnesses heat from the Earth''s interior."
    }
  ]'::jsonb,
  600,
  70
);

-- Motion Master: The Physics Racing Championship Quiz
INSERT INTO quizzes (title, description, module_id, questions, time_limit, passing_score) 
VALUES (
  'Physics Racing Championship Quiz',
  'Test your knowledge of motion, forces, and Newton''s laws',
  '694b5022-0fce-4ef8-b350-79cc09a33536',
  '[
    {
      "id": 1,
      "question": "What is velocity?",
      "options": ["Speed only", "Distance traveled", "Speed with direction", "Time taken"],
      "correctAnswer": 2,
      "explanation": "Velocity is speed with a specific direction, making it a vector quantity."
    },
    {
      "id": 2,
      "question": "What is Newton''s first law of motion?",
      "options": ["F = ma", "Every action has an equal and opposite reaction", "An object in motion stays in motion unless acted upon", "Momentum is conserved"],
      "correctAnswer": 2,
      "explanation": "Newton''s first law states that objects at rest stay at rest and objects in motion stay in motion unless acted upon by an unbalanced force."
    },
    {
      "id": 3,
      "question": "What is acceleration?",
      "options": ["Change in position", "Change in velocity over time", "Total distance", "Final velocity"],
      "correctAnswer": 1,
      "explanation": "Acceleration is the rate of change of velocity with respect to time."
    },
    {
      "id": 4,
      "question": "If a car travels 100m in 10s, what is its average speed?",
      "options": ["1000 m/s", "10 m/s", "100 m/s", "0.1 m/s"],
      "correctAnswer": 1,
      "explanation": "Average speed = distance/time = 100m/10s = 10 m/s."
    },
    {
      "id": 5,
      "question": "What is the formula for Newton''s second law?",
      "options": ["F = ma", "E = mc²", "P = mv", "v = u + at"],
      "correctAnswer": 0,
      "explanation": "Newton''s second law states that Force equals mass times acceleration (F = ma)."
    },
    {
      "id": 6,
      "question": "What is friction?",
      "options": ["A pushing force", "A pulling force", "A force that opposes motion", "A magnetic force"],
      "correctAnswer": 2,
      "explanation": "Friction is a force that opposes the motion of objects in contact."
    },
    {
      "id": 7,
      "question": "If an object has zero acceleration, what can you conclude?",
      "options": ["It''s not moving", "Net force is zero", "It has no mass", "It''s moving very fast"],
      "correctAnswer": 1,
      "explanation": "If acceleration is zero, then by F = ma, the net force must be zero."
    },
    {
      "id": 8,
      "question": "What is momentum?",
      "options": ["Mass times velocity", "Force times time", "Mass times acceleration", "Velocity times time"],
      "correctAnswer": 0,
      "explanation": "Momentum (p) equals mass times velocity (p = mv)."
    },
    {
      "id": 9,
      "question": "Which best describes Newton''s third law?",
      "options": ["F = ma", "Objects resist changes in motion", "For every action, there''s an equal and opposite reaction", "Energy is conserved"],
      "correctAnswer": 2,
      "explanation": "Newton''s third law states that for every action force, there''s an equal and opposite reaction force."
    },
    {
      "id": 10,
      "question": "What is the acceleration due to gravity on Earth?",
      "options": ["9.8 m/s", "9.8 m/s²", "10 m/s", "10 m/s²"],
      "correctAnswer": 1,
      "explanation": "The acceleration due to gravity on Earth is approximately 9.8 m/s²."
    }
  ]'::jsonb,
  600,
  70
);