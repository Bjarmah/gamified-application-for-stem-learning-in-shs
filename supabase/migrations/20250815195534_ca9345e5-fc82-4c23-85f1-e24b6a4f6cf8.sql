-- Continue creating quizzes for remaining Mathematics sub-modules

INSERT INTO quizzes (title, description, time_limit, passing_score, module_id, questions) VALUES
(
  'Introduction to Quadratic Functions Quiz',
  'Test your understanding of quadratic functions, parabolas, and their characteristics',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Introduction to Quadratic Functions' LIMIT 1),
  '[
    {
      "id": "math2a_q1",
      "question": "For f(x) = -2x² + 4x - 1, which way does the parabola open?",
      "options": ["Upward", "Downward", "Neither", "Both directions"],
      "correctOption": 1,
      "explanation": "Since a = -2 < 0, the parabola opens downward and has a maximum point."
    },
    {
      "id": "math2a_q2",
      "question": "What is the y-intercept of f(x) = 3x² - 2x + 5?",
      "options": ["3", "-2", "5", "0"],
      "correctOption": 2,
      "explanation": "The y-intercept occurs when x = 0, so f(0) = 5. The y-intercept is always the constant term c."
    },
    {
      "id": "math2a_q3",
      "question": "A sports stadium roof follows h(x) = -0.1x² + 4x. What is the maximum height?",
      "options": ["20 m", "40 m", "4 m", "0.1 m"],
      "correctOption": 1,
      "explanation": "Maximum occurs at x = -b/(2a) = -4/(2×-0.1) = 20. h(20) = -0.1(400) + 80 = 40 m."
    },
    {
      "id": "math2a_q4",
      "question": "What determines whether a parabola opens upward or downward?",
      "options": ["The b coefficient", "The c coefficient", "The a coefficient", "The vertex location"],
      "correctOption": 2,
      "explanation": "The coefficient a determines direction: a > 0 opens upward, a < 0 opens downward."
    },
    {
      "id": "math2a_q5",
      "question": "For a quadratic function f(x) = ax² + bx + c, the axis of symmetry is:",
      "options": ["x = -b/(2a)", "x = b/(2a)", "x = -c/(2a)", "x = c/(2b)"],
      "correctOption": 0,
      "explanation": "The axis of symmetry formula is x = -b/(2a), which gives the x-coordinate of the vertex."
    }
  ]'
),
(
  'Solving Quadratic Equations Quiz',
  'Master multiple methods for solving quadratic equations including factoring and the quadratic formula',
  2100,
  75,
  (SELECT id FROM modules WHERE title = 'Solving Quadratic Equations' LIMIT 1),
  '[
    {
      "id": "math2b_q1",
      "question": "Solve by factoring: x² - 9 = 0",
      "options": ["x = 3", "x = ±3", "x = 9", "x = ±9"],
      "correctOption": 1,
      "explanation": "x² - 9 = (x - 3)(x + 3) = 0, so x = 3 or x = -3, written as x = ±3."
    },
    {
      "id": "math2b_q2",
      "question": "For 3x² - 2x + 5 = 0, what does the discriminant tell us?",
      "options": ["Two real solutions", "One real solution", "No real solutions", "Cannot determine"],
      "correctOption": 2,
      "explanation": "Discriminant = (-2)² - 4(3)(5) = 4 - 60 = -56 < 0, so no real solutions."
    },
    {
      "id": "math2b_q3",
      "question": "Farmer Kofi has 100m of fencing for a garden against his house. For area = 1200 m², the equation is x(100-2x) = 1200. What are the solutions?",
      "options": ["x = 20, 30", "x = 15, 40", "x = 25, 35", "x = 10, 50"],
      "correctOption": 0,
      "explanation": "Expanding: 100x - 2x² = 1200, or 2x² - 100x + 1200 = 0. Solving gives x = 20 or 30."
    },
    {
      "id": "math2b_q4",
      "question": "Which method is best for solving x² - 7x + 12 = 0?",
      "options": ["Quadratic formula", "Factoring", "Completing the square", "Graphing"],
      "correctOption": 1,
      "explanation": "This factors easily: (x-3)(x-4) = 0, so factoring is the quickest method."
    },
    {
      "id": "math2b_q5",
      "question": "Using the quadratic formula for 2x² - 7x + 3 = 0, what is the discriminant?",
      "options": ["25", "49", "1", "-23"],
      "correctOption": 0,
      "explanation": "Discriminant = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25."
    }
  ]'
),
(
  'Quadratic Applications & Modeling Quiz',
  'Apply quadratic functions to solve real-world problems in business and optimization',
  2400,
  75,
  (SELECT id FROM modules WHERE title = 'Quadratic Applications & Modeling' LIMIT 1),
  '[
    {
      "id": "math2c_q1",
      "question": "A ball is thrown upward with equation h(t) = -5t² + 20t + 3. When does it hit the ground?",
      "options": ["t = 3s", "t = 4.14s", "t = 5s", "t = 20s"],
      "correctOption": 1,
      "explanation": "Set h(t) = 0: -5t² + 20t + 3 = 0. Using quadratic formula: t = (20 ± √(400 + 60))/10 ≈ 4.14s (taking positive root)."
    },
    {
      "id": "math2c_q2",
      "question": "For revenue R = 50p - 2p², what price gives maximum revenue?",
      "options": ["p = 12.5", "p = 25", "p = 50", "p = 100"],
      "correctOption": 0,
      "explanation": "For R = -2p² + 50p, maximum occurs at p = -50/(2×-2) = 12.5."
    },
    {
      "id": "math2c_q3",
      "question": "Akosua''s mobile money profit is P(f) = -2f² + 180f - 1800. What fee maximizes profit?",
      "options": ["45 pesewas", "90 pesewas", "180 pesewas", "360 pesewas"],
      "correctOption": 0,
      "explanation": "Maximum at f = -180/(2×-2) = 45 pesewas."
    },
    {
      "id": "math2c_q4",
      "question": "A projectile''s height follows h(t) = -16t² + 64t + 80. What is the maximum height?",
      "options": ["80 ft", "144 ft", "64 ft", "96 ft"],
      "correctOption": 1,
      "explanation": "Maximum at t = -64/(2×-16) = 2. h(2) = -16(4) + 64(2) + 80 = 144 ft."
    },
    {
      "id": "math2c_q5",
      "question": "A rectangular plot has perimeter 200m. To maximize area, what should the dimensions be?",
      "options": ["40m × 60m", "50m × 50m", "30m × 70m", "45m × 55m"],
      "correctOption": 1,
      "explanation": "For fixed perimeter, a square maximizes area. With perimeter 200m, each side = 50m."
    }
  ]'
);

-- Chemistry Quizzes for sub-modules
INSERT INTO quizzes (title, description, time_limit, passing_score, module_id, questions) VALUES
(
  'Atomic Theory Foundations Quiz',
  'Test your understanding of atomic theory, particle structure, and historical models',
  1500,
  75,
  (SELECT id FROM modules WHERE title = 'Atomic Theory Foundations' LIMIT 1),
  '[
    {
      "id": "chem1a_q1",
      "question": "Who proposed that atoms are indivisible particles?",
      "options": ["Thomson", "Rutherford", "Dalton", "Bohr"],
      "correctOption": 2,
      "explanation": "John Dalton proposed the first modern atomic theory, stating that atoms are indivisible and indestructible."
    },
    {
      "id": "chem1a_q2",
      "question": "What did Rutherford''s gold foil experiment prove?",
      "options": ["Atoms contain electrons", "The nucleus is positively charged", "Atoms are mostly empty space", "Both B and C"],
      "correctOption": 3,
      "explanation": "Rutherford''s experiment showed that atoms are mostly empty space with a small, dense, positively charged nucleus."
    },
    {
      "id": "chem1a_q3",
      "question": "In Ghana''s gold mining, what makes gold chemically stable?",
      "options": ["Complete electron shells", "Large atomic mass", "High density", "Metallic bonding"],
      "correctOption": 0,
      "explanation": "Gold''s chemical stability comes from its complete electron configuration, making it resistant to corrosion."
    },
    {
      "id": "chem1a_q4",
      "question": "Which particle determines an element''s identity?",
      "options": ["Electrons", "Protons", "Neutrons", "All particles equally"],
      "correctOption": 1,
      "explanation": "The number of protons (atomic number) uniquely identifies each element."
    },
    {
      "id": "chem1a_q5",
      "question": "Thomson''s plum pudding model suggested:",
      "options": ["Electrons orbit the nucleus", "Atoms are solid spheres", "Electrons are embedded in positive matter", "Atoms have energy levels"],
      "correctOption": 2,
      "explanation": "Thomson proposed that electrons were embedded in a positively charged sphere, like plums in a pudding."
    }
  ]'
),
(
  'Electron Configuration Basics Quiz',
  'Master electron arrangement in atoms and the aufbau principle',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Electron Configuration Basics' LIMIT 1),
  '[
    {
      "id": "chem1b_q1",
      "question": "What is the electron configuration of carbon (Z=6)?",
      "options": ["1s² 2s² 2p²", "1s² 2s⁴", "1s² 2p⁴", "1s⁶"],
      "correctOption": 0,
      "explanation": "Carbon has 6 electrons: 2 in 1s, 2 in 2s, and 2 in 2p subshells."
    },
    {
      "id": "chem1b_q2",
      "question": "According to Hund''s rule, electrons:",
      "options": ["Fill orbitals randomly", "Pair up immediately", "Occupy orbitals singly first", "Skip energy levels"],
      "correctOption": 2,
      "explanation": "Hund''s rule states electrons occupy orbitals singly before pairing up to minimize repulsion."
    },
    {
      "id": "chem1b_q3",
      "question": "Ghana''s bauxite contains aluminum. What is aluminum''s electron configuration?",
      "options": ["[Ne] 3s² 3p¹", "[Ne] 3s³", "[Ne] 3p³", "[Ar] 3s²"],
      "correctOption": 0,
      "explanation": "Aluminum (Z=13) has configuration [Ne] 3s² 3p¹, with 3 valence electrons."
    },
    {
      "id": "chem1b_q4",
      "question": "The maximum number of electrons in the 3d subshell is:",
      "options": ["6", "8", "10", "14"],
      "correctOption": 2,
      "explanation": "The d subshell has 5 orbitals, each holding 2 electrons maximum, for a total of 10."
    },
    {
      "id": "chem1b_q5",
      "question": "Which principle states that electrons fill lowest energy levels first?",
      "options": ["Pauli exclusion", "Hund''s rule", "Aufbau principle", "Heisenberg uncertainty"],
      "correctOption": 2,
      "explanation": "The aufbau principle states that electrons fill orbitals in order of increasing energy."
    }
  ]'
);

-- Biology Quizzes for sub-modules  
INSERT INTO quizzes (title, description, time_limit, passing_score, module_id, questions) VALUES
(
  'Cell Membrane Structure & Transport Quiz',
  'Test your understanding of cell membrane composition and transport mechanisms',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Cell Membrane Structure & Transport' LIMIT 1),
  '[
    {
      "id": "bio1a_q1",
      "question": "The cell membrane is primarily composed of:",
      "options": ["Proteins only", "Phospholipids only", "Phospholipid bilayer with embedded proteins", "Carbohydrates only"],
      "correctOption": 2,
      "explanation": "The fluid mosaic model shows the membrane as a phospholipid bilayer with embedded and peripheral proteins."
    },
    {
      "id": "bio1a_q2",
      "question": "Which transport process requires energy?",
      "options": ["Simple diffusion", "Osmosis", "Active transport", "Facilitated diffusion"],
      "correctOption": 2,
      "explanation": "Active transport moves substances against concentration gradients and requires ATP energy."
    },
    {
      "id": "bio1a_q3",
      "question": "In Ghana''s hot climate, plant cells prevent wilting through:",
      "options": ["Active transport", "Osmotic pressure", "Simple diffusion", "Endocytosis"],
      "correctOption": 1,
      "explanation": "Osmotic pressure from water entering cells creates turgor pressure that keeps plants rigid."
    },
    {
      "id": "bio1a_q4",
      "question": "What makes the cell membrane selectively permeable?",
      "options": ["Protein channels", "Phospholipid properties", "Cholesterol content", "All of the above"],
      "correctOption": 3,
      "explanation": "All components contribute: phospholipids control general permeability, proteins provide specific channels, cholesterol affects fluidity."
    },
    {
      "id": "bio1a_q5",
      "question": "Endocytosis is the process of:",
      "options": ["Releasing materials from cells", "Taking in materials by membrane folding", "Protein synthesis", "DNA replication"],
      "correctOption": 1,
      "explanation": "Endocytosis involves the cell membrane folding inward to engulf materials and bring them into the cell."
    }
  ]'
),
(
  'Photosynthesis Process Quiz',
  'Master the mechanisms of photosynthesis and light-dependent reactions',
  2100,
  75,
  (SELECT id FROM modules WHERE title = 'Photosynthesis Process' LIMIT 1),
  '[
    {
      "id": "bio2a_q1",
      "question": "The overall equation for photosynthesis is:",
      "options": ["6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", "CO₂ + H₂O → glucose", "glucose → CO₂ + H₂O"],
      "correctOption": 0,
      "explanation": "Photosynthesis converts carbon dioxide and water into glucose and oxygen using light energy."
    },
    {
      "id": "bio2a_q2",
      "question": "Where do the light-dependent reactions occur?",
      "options": ["Stroma", "Thylakoid membranes", "Cytoplasm", "Mitochondria"],
      "correctOption": 1,
      "explanation": "Light-dependent reactions occur in the thylakoid membranes where chlorophyll captures light energy."
    },
    {
      "id": "bio2a_q3",
      "question": "Ghana''s cocoa trees perform best under shade because:",
      "options": ["They need less CO₂", "Excessive light can damage photosystems", "They prefer cold temperatures", "They don''t need sunlight"],
      "correctOption": 1,
      "explanation": "Intense tropical sunlight can damage photosystem proteins, so cocoa thrives under partial shade."
    },
    {
      "id": "bio2a_q4",
      "question": "What is the primary function of chlorophyll?",
      "options": ["Absorb CO₂", "Produce oxygen", "Capture light energy", "Store glucose"],
      "correctOption": 2,
      "explanation": "Chlorophyll''s main function is to absorb light energy and convert it to chemical energy."
    },
    {
      "id": "bio2a_q5",
      "question": "The Calvin cycle produces:",
      "options": ["ATP", "NADPH", "Oxygen", "Glucose"],
      "correctOption": 3,
      "explanation": "The Calvin cycle (light-independent reactions) uses ATP and NADPH to produce glucose from CO₂."
    }
  ]'
);