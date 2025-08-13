-- Create comprehensive quizzes for mathematics modules based on the JSON content

-- First, let's insert the Trigonometry module and quiz
INSERT INTO modules (id, subject_id, title, description, content, difficulty_level, order_index, estimated_duration) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'a975b867-ad1f-436f-9943-ba3afdfb4f9d', 'Trigonometry', 'Master SOH-CAH-TOA, identities, and real-world applications', 'Comprehensive trigonometry module covering ratios, identities, equations, and applications', 'intermediate', 2, 90),
('550e8400-e29b-41d4-a716-446655440002', 'a975b867-ad1f-436f-9943-ba3afdfb4f9d', 'Statistics & Probability', 'Data analysis, measures of central tendency, and probability distributions', 'Complete statistics module with data classification, central tendency, dispersion, and probability', 'advanced', 3, 75);

-- Create comprehensive quiz for Trigonometry module
INSERT INTO quizzes (id, module_id, title, description, time_limit, passing_score, questions) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Trigonometry Mastery Assessment', 'Comprehensive test covering trigonometric ratios, identities, equations, and real-world applications', 1800, 75, '[
  {
    "id": "trig-1",
    "question": "What does SOH stand for in SOH-CAH-TOA?",
    "options": ["Sine = Opposite/Hypotenuse", "Side Over Hypotenuse", "Sine Over Height", "Sum Of Heights"],
    "correct_answer": 0,
    "explanation": "SOH means Sine = Opposite/Hypotenuse, one of the basic trigonometric ratios."
  },
  {
    "id": "trig-2", 
    "question": "What is the value of sin 30°?",
    "options": ["1/2", "√2/2", "√3/2", "1"],
    "correct_answer": 0,
    "explanation": "sin 30° = 1/2 is a standard angle value that should be memorized."
  },
  {
    "id": "trig-3",
    "question": "What is the value of cos 60°?",
    "options": ["√3/2", "1/2", "√2/2", "0"],
    "correct_answer": 1,
    "explanation": "cos 60° = 1/2, which equals sin 30° due to complementary angles."
  },
  {
    "id": "trig-4",
    "question": "On the unit circle, what are the coordinates of a point at angle θ?",
    "options": ["(sin θ, cos θ)", "(cos θ, sin θ)", "(tan θ, 1)", "(1, tan θ)"],
    "correct_answer": 1,
    "explanation": "On the unit circle, coordinates are (cos θ, sin θ) where cos is x-coordinate and sin is y-coordinate."
  },
  {
    "id": "trig-5",
    "question": "Which is a fundamental trigonometric identity?",
    "options": ["sin²θ + cos²θ = 2", "sin²θ + cos²θ = 1", "sin θ = cos θ", "tan θ = 1"],
    "correct_answer": 1,
    "explanation": "The Pythagorean identity sin²θ + cos²θ = 1 is the most fundamental trigonometric identity."
  },
  {
    "id": "trig-6",
    "question": "How many solutions does sin θ = 1/2 have in the interval 0° ≤ θ < 360°?",
    "options": ["1", "2", "3", "4"],
    "correct_answer": 1,
    "explanation": "sin θ = 1/2 has two solutions: θ = 30° and θ = 150° (Quadrants I and II where sine is positive)."
  },
  {
    "id": "trig-7",
    "question": "A ranger at Kakum National Park observes a canopy tower from 45m away at an angle of elevation of 53°. What is the approximate height of the tower?",
    "options": ["36 m", "45 m", "59 m", "71 m"],
    "correct_answer": 2,
    "explanation": "Using tan 53° ≈ 1.327, height = 45 × tan 53° ≈ 45 × 1.327 ≈ 59.7 m."
  },
  {
    "id": "trig-8",
    "question": "Which rule is best for finding the third side when you know two sides and the included angle?",
    "options": ["Sine rule", "Cosine rule", "Pythagoras theorem", "None of these"],
    "correct_answer": 1,
    "explanation": "The cosine rule c² = a² + b² - 2ab cos C is perfect for the SAS (Side-Angle-Side) case."
  },
  {
    "id": "trig-9",
    "question": "What is the period of the function y = sin(2x)?",
    "options": ["π", "2π", "π/2", "4π"],
    "correct_answer": 0,
    "explanation": "For y = sin(kx), the period is 2π/k. So for sin(2x), period = 2π/2 = π."
  },
  {
    "id": "trig-10",
    "question": "A surveyor needs to find the distance between two points on opposite shores of Lake Volta. From a third point 3 km from each shore, the angle between the two sight lines is 70°. What is the approximate distance between the two points?",
    "options": ["2.8 km", "3.1 km", "4.2 km", "6.0 km"],
    "correct_answer": 1,
    "explanation": "Using the cosine rule: c² = 3² + 3² - 2(3)(3)cos(70°) ≈ 18 - 18(0.342) ≈ 12.84, so c ≈ 3.1 km."
  }
]');

-- Create comprehensive quiz for Statistics & Probability module  
INSERT INTO quizzes (id, module_id, title, description, time_limit, passing_score, questions) VALUES
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Statistics & Probability Assessment', 'Test your knowledge of data analysis, measures of central tendency, dispersion, and probability', 1800, 75, '[
  {
    "id": "stat-1",
    "question": "Which type of data consists of categories that cannot be ranked?",
    "options": ["Ordinal", "Nominal", "Interval", "Ratio"],
    "correct_answer": 1,
    "explanation": "Nominal data consists of categories without inherent order or ranking, like colors or names."
  },
  {
    "id": "stat-2",
    "question": "What is the median of the dataset: 3, 7, 8, 12, 15?",
    "options": ["7", "8", "9", "10"],
    "correct_answer": 1,
    "explanation": "The median is the middle value when data is ordered. With 5 values, the median is the 3rd value: 8."
  },
  {
    "id": "stat-3", 
    "question": "Which measure is most affected by extreme values (outliers)?",
    "options": ["Mean", "Median", "Mode", "Range"],
    "correct_answer": 0,
    "explanation": "The mean is most affected by outliers because it uses all values in its calculation."
  },
  {
    "id": "stat-4",
    "question": "What does the standard deviation measure?",
    "options": ["Central tendency", "Spread of data", "Skewness", "Correlation"],
    "correct_answer": 1,
    "explanation": "Standard deviation measures how spread out the data points are from the mean."
  },
  {
    "id": "stat-5",
    "question": "In a normal distribution, approximately what percentage of data falls within one standard deviation of the mean?",
    "options": ["50%", "68%", "95%", "99.7%"],
    "correct_answer": 1,
    "explanation": "In a normal distribution, approximately 68% of data falls within one standard deviation of the mean."
  },
  {
    "id": "stat-6",
    "question": "What is the probability of getting heads when flipping a fair coin?",
    "options": ["0", "0.25", "0.5", "1"],
    "correct_answer": 2,
    "explanation": "A fair coin has equal probability for heads and tails, so P(heads) = 1/2 = 0.5."
  },
  {
    "id": "stat-7",
    "question": "If two events A and B are independent, then P(A and B) equals:",
    "options": ["P(A) + P(B)", "P(A) × P(B)", "P(A) - P(B)", "P(A) ÷ P(B)"],
    "correct_answer": 1,
    "explanation": "For independent events, the probability of both occurring is the product: P(A and B) = P(A) × P(B)."
  },
  {
    "id": "stat-8",
    "question": "A bag contains 5 red balls and 3 blue balls. What is the probability of drawing a red ball?",
    "options": ["3/8", "5/8", "3/5", "5/3"],
    "correct_answer": 1,
    "explanation": "P(red) = number of red balls / total balls = 5/(5+3) = 5/8."
  },
  {
    "id": "stat-9",
    "question": "Which graph is best for showing the distribution of a continuous variable?",
    "options": ["Bar chart", "Pie chart", "Histogram", "Line graph"],
    "correct_answer": 2,
    "explanation": "A histogram is specifically designed to show the distribution of continuous data by grouping values into bins."
  },
  {
    "id": "stat-10",
    "question": "A student survey in Ghana shows test scores: 65, 70, 75, 80, 85. What is the range?",
    "options": ["20", "75", "15", "10"],
    "correct_answer": 0,
    "explanation": "Range = highest value - lowest value = 85 - 65 = 20."
  }
]');

-- Add more questions to the existing Algebra quiz
UPDATE quizzes SET questions = '[
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
  },
  {
    "id": "alg-3",
    "question": "Which method is best for solving x² - 5x + 6 = 0?",
    "options": ["Graphing", "Factoring", "Completing the square", "Quadratic formula"],
    "correct_answer": 1,
    "explanation": "This equation factors easily: (x-2)(x-3) = 0, giving x = 2 or x = 3."
  },
  {
    "id": "alg-4", 
    "question": "What is the discriminant of 2x² + 3x - 1 = 0?",
    "options": ["5", "17", "11", "7"],
    "correct_answer": 1,
    "explanation": "Discriminant = b² - 4ac = 3² - 4(2)(-1) = 9 + 8 = 17."
  },
  {
    "id": "alg-5",
    "question": "If a parabola opens upward, what can you say about the coefficient of x²?",
    "options": ["It is negative", "It is positive", "It is zero", "It can be any value"],
    "correct_answer": 1,
    "explanation": "When the coefficient of x² (the a value) is positive, the parabola opens upward."
  },
  {
    "id": "alg-6",
    "question": "A shop in Kumasi has profit P(x) = -2x² + 80x - 300 where x is units sold. At what x is profit maximized?",
    "options": ["10", "15", "20", "40"],
    "correct_answer": 2,
    "explanation": "For a quadratic ax² + bx + c with a < 0, maximum occurs at x = -b/(2a) = -80/(2×-2) = 20."
  },
  {
    "id": "alg-7",
    "question": "What is the y-intercept of y = 3x² - 5x + 2?",
    "options": ["3", "-5", "2", "0"],
    "correct_answer": 2,
    "explanation": "The y-intercept occurs when x = 0, so y = 3(0)² - 5(0) + 2 = 2."
  },
  {
    "id": "alg-8",
    "question": "Which equation has no real solutions?",
    "options": ["x² - 4 = 0", "x² + 1 = 0", "x² - 1 = 0", "x² = 0"],
    "correct_answer": 1,
    "explanation": "x² + 1 = 0 means x² = -1, which has no real solutions since squares are always non-negative."
  }
]' WHERE id = '14d8dd0a-52b4-4514-bc76-bfdb77874cb6';

-- Create quiz for the Geometry module
INSERT INTO quizzes (id, module_id, title, description, time_limit, passing_score, questions) VALUES
('550e8400-e29b-41d4-a716-446655440005', '0f325af7-8c16-4fd6-baf9-529f1ed51b61', 'Geometry Wars Assessment', 'Master angles, shapes, proofs, and geometric relationships', 1500, 70, '[
  {
    "id": "geom-1",
    "question": "What is the sum of interior angles in a triangle?",
    "options": ["90°", "180°", "270°", "360°"],
    "correct_answer": 1,
    "explanation": "The sum of interior angles in any triangle is always 180°."
  },
  {
    "id": "geom-2",
    "question": "Two parallel lines are cut by a transversal. What can you say about corresponding angles?",
    "options": ["They are supplementary", "They are equal", "They are complementary", "They have no relationship"],
    "correct_answer": 1,
    "explanation": "When parallel lines are cut by a transversal, corresponding angles are equal."
  },
  {
    "id": "geom-3",
    "question": "What is the area of a triangle with base 8 cm and height 6 cm?",
    "options": ["14 cm²", "24 cm²", "48 cm²", "28 cm²"],
    "correct_answer": 1,
    "explanation": "Area of triangle = ½ × base × height = ½ × 8 × 6 = 24 cm²."
  },
  {
    "id": "geom-4",
    "question": "In a right triangle, if one acute angle is 35°, what is the other acute angle?",
    "options": ["35°", "45°", "55°", "65°"],
    "correct_answer": 2,
    "explanation": "In a right triangle, the two acute angles are complementary: 90° - 35° = 55°."
  },
  {
    "id": "geom-5",
    "question": "What is the circumference of a circle with radius 7 cm? (Use π ≈ 22/7)",
    "options": ["22 cm", "44 cm", "154 cm", "49 cm"],
    "correct_answer": 1,
    "explanation": "Circumference = 2πr = 2 × (22/7) × 7 = 44 cm."
  },
  {
    "id": "geom-6",
    "question": "Which quadrilateral has all sides equal and all angles 90°?",
    "options": ["Rectangle", "Rhombus", "Square", "Parallelogram"],
    "correct_answer": 2,
    "explanation": "A square has all sides equal and all angles are right angles (90°)."
  },
  {
    "id": "geom-7",
    "question": "What is the sum of exterior angles of any polygon?",
    "options": ["180°", "360°", "540°", "720°"],
    "correct_answer": 1,
    "explanation": "The sum of exterior angles of any polygon is always 360°."
  },
  {
    "id": "geom-8",
    "question": "Two angles are complementary. If one angle is 37°, what is the other?",
    "options": ["143°", "53°", "37°", "127°"],
    "correct_answer": 1,
    "explanation": "Complementary angles sum to 90°: 90° - 37° = 53°."
  }
]');