-- Continue updating remaining modules with comprehensive content
-- Update Mathematics modules

UPDATE modules SET 
content = '{
  "text": {
    "introduction": "Quadratic functions represent one of the most important classes of mathematical functions, appearing in physics (projectile motion), engineering (optimization problems), economics (profit/cost models), and many other fields. Understanding their behavior is essential for advanced mathematics.",
    "sections": [
      {
        "title": "Standard and Vertex Form",
        "content": "A quadratic function has the form f(x) = ax² + bx + c (standard form) where a ≠ 0. The coefficient ''a'' determines the parabola''s direction (up if a > 0, down if a < 0) and width. Vertex form f(x) = a(x - h)² + k directly shows the vertex (h, k) and axis of symmetry x = h."
      },
      {
        "title": "Key Features",
        "content": "The vertex is the turning point at x = -b/(2a). The axis of symmetry is the vertical line through the vertex. X-intercepts (roots) occur where f(x) = 0, found by factoring, completing the square, or the quadratic formula. The y-intercept is f(0) = c."
      },
      {
        "title": "Solving Quadratic Equations",
        "content": "Quadratic equations ax² + bx + c = 0 can be solved by: (1) Factoring if the trinomial factors nicely, (2) Quadratic formula x = [-b ± √(b² - 4ac)]/(2a), (3) Completing the square. The discriminant Δ = b² - 4ac determines the nature of solutions."
      },
      {
        "title": "Applications and Modeling",
        "content": "Quadratics model many real-world situations: projectile paths, optimization problems (maximum/minimum values), area problems, and profit functions. The vertex often represents optimal values - maximum height, minimum cost, or maximum profit."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "For the function f(x) = -2x² + 8x - 6, what is the vertex?",
      "options": ["(2, 2)", "(2, -2)", "(-2, 2)", "(4, -6)"],
      "correctAnswer": 0,
      "explanation": "Using x = -b/(2a) = -8/(-4) = 2, then f(2) = -2(4) + 8(2) - 6 = 2. Vertex is (2, 2)."
    },
    {
      "type": "multiple-choice",
      "question": "The discriminant of x² - 6x + 9 = 0 is:",
      "options": ["0", "36", "18", "-18"],
      "correctAnswer": 0,
      "explanation": "Δ = b² - 4ac = 36 - 4(1)(9) = 0, indicating one repeated real root (perfect square)."
    }
  ],
  "exercises": [
    {
      "type": "modeling",
      "title": "Business Optimization",
      "instructions": "A small shop''s daily profit P (in cedis) is modeled by P(x) = -2x² + 60x - 200, where x is the number of items sold. Find the number of items that maximizes profit and the maximum profit.",
      "hint": "Find the vertex of the parabola. Since a < 0, the vertex represents the maximum point."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Projectile Motion at Kakum Canopy Walk",
      "scenario": "Visitors to Ghana''s Kakum National Park experience the famous canopy walkway. Understanding projectile motion helps in safety calculations and designing zip-line attractions.",
      "tasks": [
        "Model the path of a dropped object from the canopy walk using a quadratic function",
        "Calculate the maximum height and time of flight for a horizontally launched projectile",
        "Determine safe landing zones for potential zip-line installations"
      ],
      "learningObjectives": [
        "Apply quadratic functions to real-world motion problems",
        "Understand the relationship between mathematics and safety engineering",
        "Connect mathematical models to tourism and conservation"
      ],
      "ghanaContext": "Kakum National Park attracts over 100,000 visitors annually, making it crucial to apply mathematical principles for safety and development of eco-tourism activities."
    }
  ]
}',
estimated_duration = 60,
difficulty_level = 'intermediate'
WHERE title LIKE '%Quadratic%' OR (title LIKE '%Functions%' AND subject_id = (SELECT id FROM subjects WHERE name = 'Mathematics'));

-- Update ICT Programming modules
UPDATE modules SET 
content = '{
  "text": {
    "introduction": "Programming is the art of creating instructions for computers to solve problems and automate tasks. Understanding fundamental programming concepts - algorithms, data structures, and logical thinking - is essential in our digital world.",
    "sections": [
      {
        "title": "Programming Logic and Algorithms",
        "content": "An algorithm is a step-by-step procedure to solve a problem. Good algorithms are clear, efficient, and produce correct results. Programming logic involves breaking complex problems into smaller, manageable parts using sequence (steps in order), selection (if-then decisions), and iteration (loops)."
      },
      {
        "title": "Data Types and Variables",
        "content": "Variables store data that programs can manipulate. Common data types include integers (whole numbers), floats (decimal numbers), strings (text), and booleans (true/false). Choosing appropriate data types affects program efficiency and accuracy."
      },
      {
        "title": "Control Structures",
        "content": "Control structures determine program flow: sequential execution (line by line), conditional statements (if-else), loops (for, while), and functions (reusable code blocks). These structures enable complex decision-making and repetitive tasks."
      },
      {
        "title": "Problem-Solving Strategies",
        "content": "Effective programming requires systematic problem-solving: understand the problem, plan the solution, implement the code, test thoroughly, and debug errors. Pseudocode and flowcharts help visualize solutions before coding."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "Which control structure repeats a block of code while a condition is true?",
      "options": ["if-else", "for loop", "while loop", "function"],
      "correctAnswer": 2,
      "explanation": "A while loop continues executing its code block as long as the specified condition remains true."
    },
    {
      "type": "multiple-choice",
      "question": "What data type would be most appropriate for storing a student''s name?",
      "options": ["integer", "float", "string", "boolean"],
      "correctAnswer": 2,
      "explanation": "Names are text data, so the string data type is most appropriate for storing textual information."
    }
  ],
  "exercises": [
    {
      "type": "algorithm-design",
      "title": "Ghana Card Registration System",
      "instructions": "Design an algorithm for a simplified Ghana Card registration system. Include data validation, duplicate checking, and ID number generation.",
      "hint": "Break the problem into steps: collect data, validate input, check for duplicates, generate unique ID, store information."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Digital Ghana Initiative",
      "scenario": "Ghana''s Digital Ghana Initiative aims to transform the country through technology. Programming skills are crucial for developing digital solutions for healthcare, education, agriculture, and governance.",
      "tasks": [
        "Design a simple algorithm for an electronic voting system",
        "Create a flowchart for a mobile money transaction process",
        "Develop pseudocode for a farmer information management system"
      ],
      "learningObjectives": [
        "Apply programming concepts to national development challenges",
        "Understand the role of technology in governance and society",
        "Connect programming skills to career opportunities in Ghana"
      ],
      "ghanaContext": "Ghana''s digital transformation creates opportunities for local programmers to develop solutions that address uniquely Ghanaian challenges while contributing to global technology trends."
    }
  ]
}',
estimated_duration = 55,
difficulty_level = 'beginner'
WHERE title LIKE '%Programming%' AND subject_id = (SELECT id FROM subjects WHERE name = 'ICT');