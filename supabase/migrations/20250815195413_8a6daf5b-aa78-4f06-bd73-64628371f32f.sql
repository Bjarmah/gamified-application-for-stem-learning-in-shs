-- Create comprehensive quizzes for all new sub-modules

-- Mathematics Quizzes
INSERT INTO quizzes (title, description, time_limit, passing_score, module_id, questions) VALUES 
(
  'Solving Linear Equations Quiz',
  'Test your understanding of linear equation solving methods and real-world applications',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Solving Linear Equations' LIMIT 1),
  '[
    {
      "id": "math1a_q1",
      "question": "Solve: 2x + 7 = 15",
      "options": ["x = 4", "x = 8", "x = 11", "x = 22"],
      "correctOption": 0,
      "explanation": "Subtract 7 from both sides: 2x = 8. Divide both sides by 2: x = 4."
    },
    {
      "id": "math1a_q2", 
      "question": "What is the first step to solve: 3x - 5 = 16?",
      "options": ["Divide by 3", "Add 5 to both sides", "Subtract 5", "Multiply by 3"],
      "correctOption": 1,
      "explanation": "To isolate the variable term 3x, we first add 5 to both sides to eliminate the -5."
    },
    {
      "id": "math1a_q3",
      "question": "A phone charging station charges GH₵2 base fee plus GH₵1 per hour. If the total bill is GH₵11, how many hours was the phone charged?",
      "options": ["7 hours", "9 hours", "11 hours", "13 hours"],
      "correctOption": 1,
      "explanation": "Set up equation: 2 + 1x = 11. Solve: x = 9 hours."
    },
    {
      "id": "math1a_q4",
      "question": "Solve: 4x + 12 = 3x + 20",
      "options": ["x = 4", "x = 8", "x = 12", "x = 32"],
      "correctOption": 1,
      "explanation": "Subtract 3x from both sides: x + 12 = 20. Subtract 12: x = 8."
    },
    {
      "id": "math1a_q5",
      "question": "If 5x - 3 = 2x + 15, what is the value of x?",
      "options": ["x = 6", "x = 8", "x = 12", "x = 18"],
      "correctOption": 0,
      "explanation": "Subtract 2x: 3x - 3 = 15. Add 3: 3x = 18. Divide by 3: x = 6."
    }
  ]'
),
(
  'Linear Inequalities Quiz',
  'Master the concepts and applications of linear inequalities',
  1500,
  75,
  (SELECT id FROM modules WHERE title = 'Linear Inequalities' LIMIT 1),
  '[
    {
      "id": "math1b_q1",
      "question": "Solve: -3x + 9 ≤ 15",
      "options": ["x ≥ -2", "x ≤ -2", "x ≥ 2", "x ≤ 2"],
      "correctOption": 0,
      "explanation": "Subtract 9: -3x ≤ 6. Divide by -3 (flip sign): x ≥ -2."
    },
    {
      "id": "math1b_q2",
      "question": "Which graph represents x < 4?",
      "options": ["Open circle at 4, arrow left", "Closed circle at 4, arrow left", "Open circle at 4, arrow right", "Closed circle at 4, arrow right"],
      "correctOption": 0,
      "explanation": "x < 4 means values less than 4, so open circle (4 not included) with arrow pointing left."
    },
    {
      "id": "math1b_q3", 
      "question": "A school needs at least GH₵500 for a trip. They have GH₵150 and sell water at GH₵1 each. How many bottles must they sell?",
      "options": ["At least 350", "At least 500", "At least 650", "Exactly 350"],
      "correctOption": 0,
      "explanation": "150 + 1x ≥ 500, so x ≥ 350. They need at least 350 bottles."
    },
    {
      "id": "math1b_q4",
      "question": "When solving -2x > 6, what happens to the inequality sign?",
      "options": ["Stays the same", "Flips direction", "Becomes equal", "Disappears"],
      "correctOption": 1,
      "explanation": "When dividing by a negative number, the inequality sign flips direction."
    },
    {
      "id": "math1b_q5",
      "question": "Solve: 2x + 5 < 13",
      "options": ["x < 4", "x > 4", "x < 9", "x > 9"],
      "correctOption": 0,
      "explanation": "Subtract 5: 2x < 8. Divide by 2: x < 4."
    }
  ]'
),
(
  'Systems of Linear Equations Quiz',
  'Apply multiple methods to solve systems of linear equations',
  2100,
  75,
  (SELECT id FROM modules WHERE title = 'Systems of Linear Equations' LIMIT 1),
  '[
    {
      "id": "math1c_q1",
      "question": "Solve using substitution: x + y = 8 and x - y = 2",
      "options": ["(5, 3)", "(3, 5)", "(4, 4)", "(6, 2)"],
      "correctOption": 0,
      "explanation": "From the second equation: x = y + 2. Substitute: (y + 2) + y = 8 → 2y = 6 → y = 3, x = 5."
    },
    {
      "id": "math1c_q2",
      "question": "Which method is best for the system: 3x + y = 10 and 3x - y = 2?",
      "options": ["Substitution", "Elimination", "Graphing", "All equally good"],
      "correctOption": 1,
      "explanation": "Elimination is best because the y-coefficients are opposites, making elimination immediate."
    },
    {
      "id": "math1c_q3",
      "question": "Ama sold 20 oranges and 30 bananas for GH₵25, and 15 oranges and 20 bananas for GH₵18. What is the price per orange?",
      "options": ["GH₵0.50", "GH₵0.60", "GH₵0.75", "GH₵1.00"],
      "correctOption": 1,
      "explanation": "Set up: 20o + 30b = 25 and 15o + 20b = 18. Solving gives orange = GH₵0.60."
    },
    {
      "id": "math1c_q4",
      "question": "Solve: 2x + 3y = 7 and 4x + 6y = 14",
      "options": ["One solution", "No solution", "Infinite solutions", "Cannot determine"],
      "correctOption": 2,
      "explanation": "The second equation is 2 times the first, so they represent the same line with infinite solutions."
    },
    {
      "id": "math1c_q5",
      "question": "Using elimination to solve x + 2y = 8 and 3x - 2y = 4, what is x?",
      "options": ["x = 2", "x = 3", "x = 4", "x = 6"],
      "correctOption": 1,
      "explanation": "Add the equations: (x + 2y) + (3x - 2y) = 8 + 4 → 4x = 12 → x = 3."
    }
  ]'
);

-- Physics Quizzes
INSERT INTO quizzes (title, description, time_limit, passing_score, module_id, questions) VALUES
(
  'Kinematics - Motion in One Dimension Quiz',
  'Test your understanding of motion, velocity, acceleration and kinematic equations',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Kinematics - Motion in One Dimension' LIMIT 1),
  '[
    {
      "id": "phys1a_q1",
      "question": "A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?",
      "options": ["2 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"],
      "correctOption": 1,
      "explanation": "Using v = v₀ + at: 20 = 0 + a(5), so a = 4 m/s²."
    },
    {
      "id": "phys1a_q2",
      "question": "An object thrown upward at 15 m/s will reach maximum height when:",
      "options": ["v = 15 m/s", "v = 0 m/s", "v = -15 m/s", "a = 0 m/s²"],
      "correctOption": 1,
      "explanation": "At maximum height, the velocity is zero before the object starts falling back down."
    },
    {
      "id": "phys1a_q3",
      "question": "A taxi traveling at 60 km/h (16.7 m/s) needs to brake. If it decelerates at 8 m/s², what is the stopping distance?",
      "options": ["17.4 m", "20.1 m", "25.3 m", "33.4 m"],
      "correctOption": 0,
      "explanation": "Using v² = v₀² + 2ax: 0 = (16.7)² + 2(-8)x. Solving: x = 17.4 m."
    },
    {
      "id": "phys1a_q4",
      "question": "What is displacement?",
      "options": ["Total distance traveled", "Change in position", "Speed over time", "Always positive"],
      "correctOption": 1,
      "explanation": "Displacement is the change in position from initial to final location, and can be positive or negative."
    },
    {
      "id": "phys1a_q5",
      "question": "Using x = x₀ + v₀t + ½at², if an object starts from rest (x₀ = 0, v₀ = 0) with a = 2 m/s² for 3 seconds, what distance does it travel?",
      "options": ["6 m", "9 m", "12 m", "18 m"],
      "correctOption": 1,
      "explanation": "x = 0 + 0 + ½(2)(3²) = ½(2)(9) = 9 m."
    }
  ]'
),
(
  'Dynamics - Forces and Newton''s Laws Quiz',
  'Master Newton''s laws and their applications to various force scenarios',
  2100,
  75,
  (SELECT id FROM modules WHERE title = 'Dynamics - Forces and Newton''s Laws' LIMIT 1),
  '[
    {
      "id": "phys1b_q1",
      "question": "A 5 kg object experiences a net force of 20 N. What is its acceleration?",
      "options": ["2 m/s²", "4 m/s²", "15 m/s²", "25 m/s²"],
      "correctOption": 1,
      "explanation": "Using F = ma: 20 = 5 × a, so a = 4 m/s²."
    },
    {
      "id": "phys1b_q2",
      "question": "According to Newton''s third law, if you push a wall with 50 N force, the wall pushes back with:",
      "options": ["25 N", "50 N", "100 N", "0 N"],
      "correctOption": 1,
      "explanation": "Newton''s third law states action and reaction forces are equal in magnitude and opposite in direction."
    },
    {
      "id": "phys1b_q3",
      "question": "A truck with mass 8000 kg on a 15° incline has driving force 12,000 N and friction 3,000 N. What is the component of weight down the incline?",
      "options": ["20,320 N", "77,280 N", "2,030 N", "80,000 N"],
      "correctOption": 0,
      "explanation": "Weight component = mg sin(15°) = 8000 × 9.8 × sin(15°) ≈ 20,320 N."
    },
    {
      "id": "phys1b_q4",
      "question": "Newton''s first law is also known as:",
      "options": ["Law of acceleration", "Law of inertia", "Law of action-reaction", "Law of gravity"],
      "correctOption": 1,
      "explanation": "Newton''s first law describes inertia - the tendency of objects to resist changes in motion."
    },
    {
      "id": "phys1b_q5",
      "question": "Which of the following is a contact force?",
      "options": ["Gravitational force", "Magnetic force", "Friction force", "Electric force"],
      "correctOption": 2,
      "explanation": "Friction is a contact force that occurs when surfaces touch each other."
    }
  ]'
),
(
  'Work, Energy, and Power Quiz',
  'Master the principles of work, energy, and power in physical systems',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Work, Energy, and Power' LIMIT 1),
  '[
    {
      "id": "phys1c_q1",
      "question": "A 2 kg object moving at 4 m/s has kinetic energy of:",
      "options": ["8 J", "16 J", "32 J", "4 J"],
      "correctOption": 1,
      "explanation": "KE = ½mv² = ½(2)(4²) = ½(2)(16) = 16 J"
    },
    {
      "id": "phys1c_q2",
      "question": "If you lift a 5 kg box 2 m high, the work done against gravity is:",
      "options": ["10 J", "98 J", "49 J", "20 J"],
      "correctOption": 1,
      "explanation": "W = mgh = (5 kg)(9.8 m/s²)(2 m) = 98 J"
    },
    {
      "id": "phys1c_q3",
      "question": "Water falls 120 m through the Akosombo Dam. If 1000 kg of water falls, what is its potential energy at the top?",
      "options": ["120,000 J", "1,176,000 J", "12,000 J", "1,200 J"],
      "correctOption": 1,
      "explanation": "PE = mgh = 1000 × 9.8 × 120 = 1,176,000 J"
    },
    {
      "id": "phys1c_q4",
      "question": "According to the work-energy theorem:",
      "options": ["Work equals kinetic energy", "Net work equals change in kinetic energy", "Work equals potential energy", "Work is always positive"],
      "correctOption": 1,
      "explanation": "The work-energy theorem states that net work done on an object equals its change in kinetic energy."
    },
    {
      "id": "phys1c_q5",
      "question": "Power is defined as:",
      "options": ["Work per unit time", "Force times distance", "Energy times time", "Mass times acceleration"],
      "correctOption": 0,
      "explanation": "Power is the rate of doing work, measured as work per unit time (P = W/t)."
    }
  ]'
);

-- ICT Quizzes
INSERT INTO quizzes (title, description, time_limit, passing_score, module_id, questions) VALUES
(
  'Programming Logic & Algorithms Quiz',
  'Test your understanding of algorithms, flowcharts, and problem-solving strategies',
  1500,
  75,
  (SELECT id FROM modules WHERE title = 'Programming Logic & Algorithms' LIMIT 1),
  '[
    {
      "id": "ict1a_q1",
      "question": "Which flowchart symbol represents a decision point?",
      "options": ["Rectangle", "Diamond", "Oval", "Parallelogram"],
      "correctOption": 1,
      "explanation": "A diamond shape represents decision points in flowcharts, typically containing yes/no or true/false questions."
    },
    {
      "id": "ict1a_q2",
      "question": "What is the main purpose of pseudocode?",
      "options": ["To run on computers", "To plan algorithms before coding", "To replace programming languages", "To create flowcharts"],
      "correctOption": 1,
      "explanation": "Pseudocode helps plan and structure algorithms using natural language before writing actual code."
    },
    {
      "id": "ict1a_q3",
      "question": "In the Ghana National ID registration algorithm, what should be checked first?",
      "options": ["Document validity", "Age requirement", "Previous registration", "Name spelling"],
      "correctOption": 1,
      "explanation": "Age requirement (18+ years) should be checked first as it''s a fundamental eligibility criterion."
    },
    {
      "id": "ict1a_q4",
      "question": "Which characteristic is NOT required for a good algorithm?",
      "options": ["Clear steps", "Finite execution", "Complex language", "Effective solution"],
      "correctOption": 2,
      "explanation": "Good algorithms should be clear and simple, not complex. Complex language makes algorithms harder to understand and implement."
    },
    {
      "id": "ict1a_q5",
      "question": "What flowchart symbol is used for input/output operations?",
      "options": ["Rectangle", "Diamond", "Parallelogram", "Circle"],
      "correctOption": 2,
      "explanation": "A parallelogram is used to represent input and output operations in flowcharts."
    }
  ]'
),
(
  'Introduction to Scratch Programming Quiz',
  'Test your knowledge of Scratch programming concepts and visual programming',
  1800,
  75,
  (SELECT id FROM modules WHERE title = 'Introduction to Scratch Programming' LIMIT 1),
  '[
    {
      "id": "ict1b_q1",
      "question": "Which Scratch block category contains the ''forever'' loop block?",
      "options": ["Motion", "Control", "Events", "Sensing"],
      "correctOption": 1,
      "explanation": "Control blocks manage program flow, including loops like ''forever'', ''repeat'', and conditional statements."
    },
    {
      "id": "ict1b_q2",
      "question": "What happens when you click the green flag in Scratch?",
      "options": ["Saves the project", "Starts scripts with ''when green flag clicked''", "Creates a new sprite", "Opens help menu"],
      "correctOption": 1,
      "explanation": "The green flag triggers all scripts that start with the ''when green flag clicked'' event block."
    },
    {
      "id": "ict1b_q3",
      "question": "In a Ghana geography learning game, which Scratch feature would be best for storing region names?",
      "options": ["Variables", "Lists", "Costumes", "Sounds"],
      "correctOption": 1,
      "explanation": "Lists are perfect for storing multiple related items like region names, allowing easy access and manipulation."
    },
    {
      "id": "ict1b_q4",
      "question": "What is broadcasting in Scratch?",
      "options": ["Playing sounds loudly", "Sending messages between sprites", "Sharing projects online", "Making sprites visible"],
      "correctOption": 1,
      "explanation": "Broadcasting allows sprites to communicate by sending and receiving messages to coordinate actions."
    },
    {
      "id": "ict1b_q5",
      "question": "Which programming concept does the Scratch ''repeat 10'' block demonstrate?",
      "options": ["Sequence", "Selection", "Iteration", "Function"],
      "correctOption": 2,
      "explanation": "The repeat block demonstrates iteration (loops) - repeating a set of instructions multiple times."
    }
  ]'
),
(
  'HTML Fundamentals for Web Development Quiz',
  'Test your understanding of HTML structure, elements, and web development basics',
  1500,
  75,
  (SELECT id FROM modules WHERE title = 'HTML Fundamentals for Web Development' LIMIT 1),
  '[
    {
      "id": "ict1c_q1",
      "question": "Which HTML tag is used for the largest heading?",
      "options": ["<h6>", "<header>", "<h1>", "<title>"],
      "correctOption": 2,
      "explanation": "The <h1> tag creates the largest heading, with headings getting smaller from h1 to h6."
    },
    {
      "id": "ict1c_q2",
      "question": "What does the ''alt'' attribute in an <img> tag provide?",
      "options": ["Image source", "Alternative text description", "Image alignment", "Image size"],
      "correctOption": 1,
      "explanation": "The ''alt'' attribute provides alternative text that describes the image for accessibility and when images can''t load."
    },
    {
      "id": "ict1c_q3",
      "question": "For the Ghana National Museum website, which HTML element would be most appropriate for the main content area?",
      "options": ["<div>", "<main>", "<section>", "<article>"],
      "correctOption": 1,
      "explanation": "The <main> element represents the primary content area of a document, making it most appropriate for the main content."
    },
    {
      "id": "ict1c_q4",
      "question": "What is the correct structure of a basic HTML document?",
      "options": ["<html><body><head>", "<html><head><body>", "<body><html><head>", "<head><html><body>"],
      "correctOption": 1,
      "explanation": "The correct structure is <html> containing <head> (metadata) followed by <body> (visible content)."
    },
    {
      "id": "ict1c_q5",
      "question": "Which attribute makes an HTML element unique on a page?",
      "options": ["class", "id", "name", "type"],
      "correctOption": 1,
      "explanation": "The ''id'' attribute provides a unique identifier for an element, and should be unique within the entire page."
    }
  ]'
);