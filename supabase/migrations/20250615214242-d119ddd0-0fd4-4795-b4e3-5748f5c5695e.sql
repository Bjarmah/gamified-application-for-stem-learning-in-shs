
-- Clear existing data and insert SHS subjects
DELETE FROM modules;
DELETE FROM quizzes;
DELETE FROM subjects;

-- Insert SHS subjects with gaming focus
INSERT INTO subjects (name, description, color, icon) VALUES
('Mathematics', 'Gamified SHS Mathematics - Solve puzzles, unlock achievements, and master math through interactive challenges!', '#8B5CF6', 'Calculator'),
('Physics', 'Physics Adventure - Explore the laws of nature through experiments, simulations, and real-world missions!', '#F97316', 'Atom'),
('Chemistry', 'Chemistry Lab Quest - Mix compounds, discover reactions, and become a master chemist through hands-on experiments!', '#10B981', 'FlaskConical'),
('Biology', 'Life Science Explorer - Journey through living systems, DNA mysteries, and ecological adventures!', '#EAB308', 'Activity'),
('Elective ICT', 'Code Master Challenge - Build apps, create websites, and solve programming puzzles to level up your tech skills!', '#3B82F6', 'Monitor'),
('Robotics', 'Robot Builder Academy - Design, program, and control robots while learning engineering fundamentals!', '#EC4899', 'Bot');

-- Mathematics modules with gaming elements
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Algebra Quest: Solving the Mystery of X',
  'Embark on an algebraic adventure! Solve equations to unlock treasure chests and defeat mathematical monsters.',
  'beginner',
  45,
  1,
  '🎮 MISSION BRIEFING: You are Agent X, tasked with solving algebraic mysteries! 

🏆 LEARNING OBJECTIVES:
- Master linear equations and inequalities
- Unlock the secrets of quadratic equations
- Defeat the Factoring Dragon using special techniques

🎯 GAME MECHANICS:
- Earn XP points for each equation solved correctly
- Unlock power-ups: Quadratic Formula Shield, Factoring Sword
- Boss Battle: The Polynomial Beast (requires mastering all techniques)

📚 CONTENT COVERED:
1. Linear Equations: 2x + 5 = 13 (Beginner quests)
2. Quadratic Equations: x² - 5x + 6 = 0 (Intermediate dungeons)
3. Systems of Equations: Coordinate plane treasure maps
4. Word Problems: Real-world mission scenarios

🎖️ ACHIEVEMENTS TO UNLOCK:
- Equation Solver (solve 50 linear equations)
- Quadratic Master (complete quadratic formula challenges)
- System Solver (solve 3x3 systems)
- Speed Demon (solve 10 equations under 30 seconds each)'
FROM subjects s WHERE s.name = 'Mathematics';

INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Geometry Wars: Shapes, Angles & Proofs',
  'Command geometric shapes in epic battles! Use angle measurements and proof strategies to conquer geometric challenges.',
  'intermediate',
  50,
  2,
  '⚔️ GEOMETRY BATTLEFIELD AWAITS!

🎮 STORYLINE: The Kingdom of Euclidia is under attack! Only a master of shapes and angles can save the realm.

🏆 LEARNING OBJECTIVES:
- Master angle relationships and parallel line theorems
- Conquer triangle congruence and similarity
- Unlock the power of coordinate geometry

🎯 BATTLE MECHANICS:
- Triangle Army: Deploy congruent triangles (SSS, SAS, ASA formations)
- Circle Shields: Use circumference and area calculations for defense
- Coordinate Catapults: Plot points and calculate distances for attacks

📚 GEOMETRIC ARSENAL:
1. Angle Warfare: Complementary and supplementary angle strategies
2. Triangle Tactics: Pythagorean theorem for distance calculations
3. Circle Spells: π-powered area and circumference magic
4. Coordinate Combat: Distance formula and midpoint strategies

🎖️ WARRIOR ACHIEVEMENTS:
- Angle Master (identify all angle relationships)
- Triangle Commander (prove 20 triangle congruencies)  
- Circle Sage (solve complex circle problems)
- Coordinate Champion (master coordinate plane navigation)

🗡️ FINAL BOSS: The Proof Dragon - requires logical reasoning and multi-step geometric proofs!'
FROM subjects s WHERE s.name = 'Mathematics';

-- Physics modules with gaming elements
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Motion Master: The Physics Racing Championship',
  'Rev up your engines! Use kinematics and dynamics to design the ultimate racing vehicle and dominate the physics track!',
  'beginner',
  45,
  1,
  '🏎️ WELCOME TO PHYSICS SPEEDWAY!

🎮 RACING SIMULATION: Design cars using real physics principles to win championships!

🏆 LEARNING OBJECTIVES:
- Master velocity, acceleration, and displacement
- Understand forces and Newton''s laws of motion
- Apply projectile motion for epic jumps

🎯 RACING MECHANICS:
- Tune your car''s acceleration using F = ma
- Calculate optimal launch angles for jumps (projectile motion)
- Use friction coefficients for perfect cornering
- Energy conservation for fuel efficiency

📚 PHYSICS GARAGE:
1. Speed & Velocity: Design speedometers and GPS systems
2. Acceleration: Turbo boost calculations
3. Forces: Aerodynamics and tire grip optimization
4. Projectile Motion: Stunt jump calculations

🏁 RACE MODES:
- Time Trial: Fastest lap using optimal physics
- Stunt Challenge: Perfect projectile motion jumps
- Fuel Economy: Energy conservation race
- Physics Grand Prix: Ultimate championship

🎖️ DRIVER ACHIEVEMENTS:
- Speed Demon (master velocity calculations)
- Jump Master (perfect projectile motion)
- Force Expert (optimize car performance)
- Physics Champion (win the grand prix)'
FROM subjects s WHERE s.name = 'Physics';

INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Energy Empire: Power Up the Future',
  'Build and manage your own energy empire! Harness electricity, magnetism, and renewable energy to power cities.',
  'intermediate',
  55,
  2,
  '⚡ BUILD YOUR ENERGY EMPIRE!

🎮 CITY BUILDER: Construct power plants and manage electrical grids using real physics principles!

🏆 LEARNING OBJECTIVES:
- Master electrical circuits and Ohm''s law
- Understand electromagnetic induction
- Explore renewable energy systems

🎯 EMPIRE MECHANICS:
- Design circuits: Calculate voltage, current, and resistance
- Build generators: Apply electromagnetic induction principles
- Manage power grid: Use transformers and transmission lines
- Research renewable energy: Solar, wind, and hydroelectric

📚 ENERGY TECHNOLOGIES:
1. Electric Circuits: Wire cities with optimal current flow
2. Magnetism: Design motors and generators
3. Electromagnetic Waves: Build communication systems
4. Renewable Energy: Sustainable power solutions

🏭 CONSTRUCTION PROJECTS:
- Hydroelectric Dam: Convert potential energy to electricity
- Wind Farm: Harness kinetic energy of moving air
- Solar Array: Photovoltaic energy conversion
- Nuclear Plant: Einstein''s E=mc² in action

🎖️ ENERGY ACHIEVEMENTS:
- Circuit Master (design 100% efficient circuits)
- Green Pioneer (build renewable energy grid)
- Electromagnetic Engineer (perfect induction systems)
- Power Mogul (supply energy to 1 million citizens)'
FROM subjects s WHERE s.name = 'Physics';

-- Chemistry modules with gaming elements
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Alchemy Academy: The Periodic Table Adventure',
  'Welcome to Hogwarts for Chemists! Master the periodic table, collect elements, and brew powerful chemical compounds!',
  'beginner',
  40,
  1,
  '🧪 WELCOME TO ALCHEMY ACADEMY!

🎮 MAGICAL CHEMISTRY: Collect elements and create compounds using real chemical principles!

🏆 LEARNING OBJECTIVES:
- Master the periodic table and element properties
- Understand atomic structure and electron configuration
- Learn chemical bonding and compound formation

🎯 ALCHEMY MECHANICS:
- Element Collection: Discover all 118 elements
- Compound Crafting: Combine elements using bonding rules
- Reaction Brewing: Balance chemical equations for powerful effects
- Laboratory Upgrades: Unlock advanced equipment

📚 ACADEMY CURRICULUM:
1. Atomic Structure: Protons, neutrons, electrons as building blocks
2. Periodic Trends: Element families and their magical properties
3. Chemical Bonding: Ionic vs covalent spell combinations
4. Compound Creation: Following the law of conservation of mass

🏰 ACADEMY LOCATIONS:
- Element Library: Learn about each element''s unique properties
- Bonding Laboratory: Practice ionic and covalent combinations
- Reaction Chamber: Balance equations and predict products
- Crystal Garden: Grow and study molecular structures

🎖️ ALCHEMIST ACHIEVEMENTS:
- Element Collector (discover all main group elements)
- Bonding Master (create 50 different compounds)
- Equation Balancer (balance 100 chemical reactions)
- Grand Alchemist (synthesize complex organic molecules)'
FROM subjects s WHERE s.name = 'Chemistry';

INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Molecular Kitchen: Organic Chemistry Cooking Show',
  'Chef! Time to cook with molecules! Create delicious dishes while learning organic chemistry and biochemical reactions.',
  'intermediate',
  50,
  2,
  '👨‍🍳 WELCOME TO MOLECULAR KITCHEN!

🎮 COOKING SIMULATION: Prepare gourmet dishes using organic chemistry principles!

🏆 LEARNING OBJECTIVES:
- Master organic functional groups and nomenclature
- Understand biochemical processes in cooking
- Learn about polymers and food chemistry

🎯 KITCHEN MECHANICS:
- Recipe Creation: Combine organic molecules for flavor compounds
- Temperature Control: Understand reaction kinetics and enzymes
- Food Preservation: Apply chemistry to extend shelf life
- Molecular Gastronomy: Create foams, gels, and spherification

📚 CULINARY CHEMISTRY:
1. Carbohydrates: Sugars, starches, and caramelization reactions
2. Proteins: Amino acids, denaturation, and Maillard reactions
3. Lipids: Fats, oils, and emulsification science
4. Enzymes: Biological catalysts in cooking processes

🍽️ SIGNATURE DISHES:
- Perfect Steak: Maillard reaction optimization
- Artisan Bread: Fermentation and gluten chemistry
- Molecular Spheres: Sodium alginate polymerization
- Chocolate Tempering: Crystal structure control

🎖️ CHEF ACHIEVEMENTS:
- Organic Master (identify all functional groups)
- Reaction Expert (control 20 cooking reactions)
- Enzyme Whisperer (optimize biological processes)
- Molecular Gastronomist (create impossible textures)'
FROM subjects s WHERE s.name = 'Chemistry';

-- Biology modules with gaming elements
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Cell City: Microscopic Metropolis Manager',
  'Become the mayor of Cell City! Manage organelles, optimize cellular processes, and keep your microscopic citizens happy!',
  'beginner',
  45,
  1,
  '🏙️ WELCOME TO CELL CITY!

🎮 CITY MANAGEMENT: Build and manage a thriving cellular metropolis!

🏆 LEARNING OBJECTIVES:
- Master cell structure and organelle functions
- Understand cellular processes and metabolism
- Learn about cell division and reproduction

🎯 CITY MECHANICS:
- Organelle Construction: Build nucleus (city hall), mitochondria (power plants)
- Resource Management: Glucose, oxygen, and ATP economics
- Transportation: Endoplasmic reticulum highway system
- Waste Management: Lysosome recycling centers

📚 CELLULAR INFRASTRUCTURE:
1. Nucleus: Command center with DNA blueprints
2. Mitochondria: Power plants generating ATP energy
3. Ribosomes: Protein factories throughout the city
4. Cell Membrane: Security gates controlling entry/exit

🏗️ CITY DISTRICTS:
- Industrial Zone: Ribosomes and protein synthesis
- Energy Sector: Mitochondrial power generation
- Transport Hub: Golgi apparatus shipping center
- Recycling Plant: Lysosomes breaking down waste

🎖️ MAYOR ACHIEVEMENTS:
- Infrastructure Master (build all major organelles)
- Energy Efficiency Expert (optimize ATP production)
- Traffic Controller (perfect transport systems)
- Growth Manager (successfully complete cell division)'
FROM subjects s WHERE s.name = 'Biology';

INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'DNA Detective: Genetic Mystery Solver',
  'Put on your detective hat! Solve genetic mysteries using DNA analysis, inheritance patterns, and molecular biology techniques.',
  'intermediate',
  50,
  2,
  '🔍 DNA DETECTIVE AGENCY!

🎮 MYSTERY SOLVING: Use genetics and molecular biology to crack complex cases!

🏆 LEARNING OBJECTIVES:
- Master DNA structure and replication
- Understand inheritance patterns and genetics
- Learn molecular techniques like PCR and gel electrophoresis

🎯 DETECTIVE MECHANICS:
- DNA Fingerprinting: Match suspects using genetic markers
- Inheritance Analysis: Solve family relationship mysteries
- Mutation Investigation: Identify genetic disorders
- Evolution Cases: Trace species relationships through DNA

📚 FORENSIC TOOLKIT:
1. DNA Structure: Double helix analysis and base pairing
2. Genetic Code: Translate DNA to proteins for evidence
3. Inheritance Patterns: Mendelian genetics and pedigrees
4. Molecular Techniques: PCR amplification and sequencing

🕵️ CASE FILES:
- The Missing Heir: Use blood type genetics to find the rightful heir
- Wildlife Smuggling: DNA barcoding to identify illegal animal trade
- Ancient Mystery: Extract DNA from archaeological samples
- Medical Marvel: Diagnose genetic disorders using pedigree analysis

🎖️ DETECTIVE ACHIEVEMENTS:
- DNA Expert (master double helix structure)
- Inheritance Specialist (solve 50 genetic puzzles)
- Lab Technician (perform virtual PCR and electrophoresis)
- Master Detective (solve the ultimate genetic mystery)'
FROM subjects s WHERE s.name = 'Biology';

-- ICT modules with gaming elements
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Code Warriors: Programming Battle Arena',
  'Enter the digital battlefield! Write code to command your army of algorithms and defeat bugs in epic programming battles!',
  'beginner',
  50,
  1,
  '⚔️ WELCOME TO THE CODE ARENA!

🎮 PROGRAMMING COMBAT: Write code to control warriors and defeat the Bug Empire!

🏆 LEARNING OBJECTIVES:
- Master programming fundamentals and logic
- Learn multiple programming languages
- Understand algorithms and data structures

🎯 BATTLE MECHANICS:
- Code Your Army: Write functions to control warrior behavior
- Algorithm Weapons: Use sorting and searching for tactical advantage
- Debug Missions: Find and fix code bugs to save allies
- Boss Battles: Complex programming challenges

📚 WARRIOR TRAINING:
1. Variables & Data Types: Equip warriors with proper gear
2. Control Structures: Program tactical decisions (if/else, loops)
3. Functions: Create special abilities and power-ups
4. Arrays: Organize army formations and inventories

⚔️ BATTLE MODES:
- Tutorial Arena: Learn basic syntax through guided battles
- Algorithm Olympics: Compete in sorting and searching competitions
- Bug Hunt: Debug corrupted code to rescue captured allies
- Final Boss: The Infinite Loop Dragon

🎖️ WARRIOR ACHIEVEMENTS:
- Syntax Master (error-free code for 100 battles)
- Algorithm Architect (implement 10 different algorithms)
- Bug Slayer (find and fix 50 code bugs)
- Code Sensei (mentor other programming warriors)'
FROM subjects s WHERE s.name = 'Elective ICT';

INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Web Builder Tycoon: Digital Empire Creator',
  'Build your digital empire! Create websites, apps, and online businesses while mastering web development and digital marketing.',
  'intermediate',
  55,
  2,
  '🏢 BUILD YOUR DIGITAL EMPIRE!

🎮 BUSINESS SIMULATION: Create websites and apps to build a tech empire!

🏆 LEARNING OBJECTIVES:
- Master HTML, CSS, and JavaScript
- Learn responsive web design principles  
- Understand user experience and digital marketing

🎯 TYCOON MECHANICS:
- Website Portfolio: Build sites for different clients and industries
- User Satisfaction: Optimize UX/UI for higher ratings
- SEO Mastery: Improve search rankings and web traffic
- Revenue Growth: Monetize sites through various strategies

📚 DEVELOPMENT TOOLKIT:
1. HTML Foundation: Structure websites with semantic markup
2. CSS Styling: Design beautiful, responsive layouts
3. JavaScript Interactivity: Add dynamic features and animations
4. Digital Marketing: SEO, analytics, and user engagement

🏗️ PROJECT TYPES:
- Portfolio Website: Showcase your digital creations
- E-commerce Store: Build online shopping experiences
- Social Media App: Create the next viral platform
- Educational Platform: Gamified learning websites

🎖️ TYCOON ACHIEVEMENTS:
- HTML Architect (master semantic markup)
- CSS Artist (create stunning visual designs)
- JavaScript Wizard (build interactive experiences)
- Digital Mogul (earn $1M in virtual revenue)'
FROM subjects s WHERE s.name = 'Elective ICT';

-- Robotics modules with gaming elements
INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'Robot Academy: Build Your Mechanical Army',
  'Welcome to Robot Academy! Design, build, and program robots to complete missions and compete in the ultimate robot championship!',
  'beginner',
  45,
  1,
  '🤖 ROBOT ACADEMY AWAITS!

🎮 ROBOT BUILDING: Design and program robots for exciting missions and competitions!

🏆 LEARNING OBJECTIVES:
- Understand basic robotics principles and components
- Learn programming logic for robot control
- Master sensors and actuators integration

🎯 ACADEMY MECHANICS:
- Robot Design: Choose chassis, wheels, sensors, and actuators
- Mission Programming: Write code to complete specific tasks
- Competition Mode: Race against other robots
- Upgrade System: Unlock advanced components and features

📚 ROBOTICS FUNDAMENTALS:
1. Mechanical Systems: Motors, gears, wheels, and structural design
2. Sensors: Ultrasonic, light, touch, and camera sensors
3. Programming: Block-based and text programming for robot control
4. Problem Solving: Breaking complex tasks into simple robot commands

🏆 MISSION TYPES:
- Maze Navigation: Program robots to find the exit
- Line Following: Use sensors to track colored paths
- Object Sorting: Identify and organize different objects
- Rescue Mission: Navigate obstacles to reach targets

🎖️ ROBOTICS ACHIEVEMENTS:
- Mechanical Engineer (master robot construction)
- Sensor Specialist (integrate 5 different sensor types)
- Programming Pro (complete 25 robot missions)
- Championship Winner (dominate robot competitions)'
FROM subjects s WHERE s.name = 'Robotics';

INSERT INTO modules (subject_id, title, description, difficulty_level, estimated_duration, order_index, content) 
SELECT 
  s.id,
  'AI Assistant Creator: Your Personal Robot Companion',
  'Create your own AI assistant! Program smart robots that can learn, adapt, and help solve real-world problems using artificial intelligence.',
  'intermediate',
  60,
  2,
  '🧠 CREATE YOUR AI COMPANION!

🎮 AI DEVELOPMENT: Build intelligent robots that learn and adapt to help humans!

🏆 LEARNING OBJECTIVES:
- Understand artificial intelligence and machine learning basics
- Learn about neural networks and decision-making algorithms
- Explore robotics applications in healthcare, education, and daily life

🎯 AI MECHANICS:
- Neural Network Design: Build simple AI brains for robots
- Training Mode: Teach robots through examples and feedback
- Smart Behaviors: Program robots that adapt to new situations
- Real-world Applications: Deploy AI assistants for practical tasks

📚 AI CURRICULUM:
1. Machine Learning: Pattern recognition and prediction algorithms
2. Computer Vision: Teaching robots to "see" and interpret images
3. Natural Language: Voice commands and conversation systems
4. Ethics: Responsible AI development and robot safety

🤖 AI PROJECTS:
- Personal Assistant: Schedule management and reminder systems
- Healthcare Helper: Monitor vital signs and provide health tips
- Education Tutor: Adaptive learning companion for students
- Home Automation: Smart home control and energy management

🎖️ AI ACHIEVEMENTS:
- Neural Network Architect (design working AI systems)
- Machine Learning Master (train robots with 90% accuracy)
- Vision Expert (implement computer vision successfully)
- AI Pioneer (create AI that helps solve real problems)'
FROM subjects s WHERE s.name = 'Robotics';

-- Insert sample quizzes for each subject
INSERT INTO quizzes (module_id, title, description, questions, time_limit, passing_score) 
SELECT 
  m.id,
  'Algebra Quest Challenge',
  'Test your equation-solving skills in this gamified quiz adventure!',
  '[
    {
      "question": "Solve for x: 2x + 8 = 20",
      "options": ["x = 4", "x = 6", "x = 8", "x = 10"],
      "correct_answer": 1,
      "explanation": "Subtract 8 from both sides: 2x = 12, then divide by 2: x = 6"
    },
    {
      "question": "What is the vertex of the parabola y = x² - 4x + 3?",
      "options": ["(2, -1)", "(2, 1)", "(-2, -1)", "(-2, 1)"],
      "correct_answer": 0,
      "explanation": "Using vertex form or completing the square, the vertex is at (2, -1)"
    }
  ]'::jsonb,
  900,
  70
FROM modules m 
JOIN subjects s ON m.subject_id = s.id 
WHERE s.name = 'Mathematics' AND m.title = 'Algebra Quest: Solving the Mystery of X';

INSERT INTO quizzes (module_id, title, description, questions, time_limit, passing_score) 
SELECT 
  m.id,
  'Physics Racing Quiz',
  'Test your motion and forces knowledge in this high-speed quiz!',
  '[
    {
      "question": "A car accelerates from 0 to 60 mph in 6 seconds. What is its acceleration?",
      "options": ["10 mph/s", "6 mph/s", "60 mph/s", "360 mph/s"],
      "correct_answer": 0,
      "explanation": "Acceleration = change in velocity / time = 60 mph / 6 s = 10 mph/s"
    },
    {
      "question": "Which of Newton''s laws explains why you feel pushed back in your seat when a car accelerates?",
      "options": ["First Law (Inertia)", "Second Law (F=ma)", "Third Law (Action-Reaction)", "Law of Gravitation"],
      "correct_answer": 0,
      "explanation": "Newton''s First Law states that objects at rest tend to stay at rest - your body resists the acceleration"
    }
  ]'::jsonb,
  600,
  75
FROM modules m 
JOIN subjects s ON m.subject_id = s.id 
WHERE s.name = 'Physics' AND m.title = 'Motion Master: The Physics Racing Championship';
