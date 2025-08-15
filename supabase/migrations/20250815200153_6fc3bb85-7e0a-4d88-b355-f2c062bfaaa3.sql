-- Create all the new sub-modules in the database to match our local content

-- First, get the subject IDs we'll need
-- Mathematics
INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content) 
SELECT 
    'Solving Linear Equations',
    'Master the fundamentals of solving single-variable linear equations with step-by-step methods and real-world applications.',
    id,
    'SHS 1',
    45,
    'Linear equations are the foundation of algebra and essential for solving real-world problems.'
FROM subjects WHERE name = 'Mathematics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Linear Inequalities',
    'Learn to solve and graph linear inequalities, understanding when solutions represent ranges rather than single values.',
    id,
    'SHS 1', 
    40,
    'Linear inequalities use inequality symbols and represent ranges of values rather than single solutions.'
FROM subjects WHERE name = 'Mathematics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Systems of Linear Equations',
    'Solve systems of linear equations using substitution, elimination, and graphical methods with real-world applications.',
    id,
    'SHS 1',
    50,
    'A system of linear equations consists of two or more linear equations with the same variables.'
FROM subjects WHERE name = 'Mathematics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Introduction to Quadratic Functions',
    'Discover the fundamentals of quadratic functions, their characteristics, and how they model real-world parabolic relationships.',
    id,
    'SHS 2',
    45,
    'Quadratic functions are polynomial functions of degree 2, creating parabolas.'
FROM subjects WHERE name = 'Mathematics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Solving Quadratic Equations',
    'Master multiple methods for solving quadratic equations: factoring, completing the square, and the quadratic formula.',
    id,
    'SHS 2',
    55,
    'Solving quadratic equations means finding the values that make the equation true.'
FROM subjects WHERE name = 'Mathematics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Quadratic Applications & Modeling',
    'Apply quadratic functions to solve real-world problems in business, physics, and engineering with Ghana-focused scenarios.',
    id,
    'SHS 2',
    50,
    'Quadratic functions model many real-world situations from projectile motion to business optimization.'
FROM subjects WHERE name = 'Mathematics';

-- Physics
INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Kinematics - Motion in One Dimension',
    'Understand the fundamental concepts of motion including displacement, velocity, and acceleration in straight-line motion.',
    id,
    'SHS 1',
    50,
    'Kinematics is the study of motion without considering the forces that cause it.'
FROM subjects WHERE name = 'Physics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Dynamics - Forces and Newton''s Laws',
    'Explore the relationship between forces and motion through Newton''s three fundamental laws of motion.',
    id,
    'SHS 1',
    55,
    'Dynamics studies the relationship between forces and motion using Newton''s laws.'
FROM subjects WHERE name = 'Physics';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Work, Energy, and Power',
    'Understand the concepts of work, energy, and power, and learn about energy conservation in mechanical systems.',
    id,
    'SHS 1',
    45,
    'Energy is the capacity to do work, and these concepts are fundamental to understanding physical processes.'
FROM subjects WHERE name = 'Physics';

-- ICT (need to find the correct subject name)
INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Programming Logic & Algorithms',
    'Master the fundamental concepts of programming logic, problem-solving, and algorithm design using flowcharts and pseudocode.',
    id,
    'SHS 1',
    50,
    'Programming logic forms the foundation of all software development.'
FROM subjects WHERE name = 'Elective ICT';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Introduction to Scratch Programming',
    'Learn programming fundamentals through Scratch''s visual programming environment, creating interactive projects and games.',
    id,
    'SHS 1',
    55,
    'Scratch is a visual programming language that makes learning programming fun and accessible.'
FROM subjects WHERE name = 'Elective ICT';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'HTML Fundamentals for Web Development',
    'Learn the building blocks of web development by mastering HTML structure, elements, and creating your first web pages.',
    id,
    'SHS 1',
    45,
    'HTML is the foundation of all websites, providing structure and content using tags and elements.'
FROM subjects WHERE name = 'Elective ICT';

-- Chemistry
INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Atomic Theory Foundations',
    'Explore the historical development of atomic theory and understand the fundamental structure of atoms.',
    id,
    'SHS 1',
    45,
    'Atomic theory explains the fundamental structure and behavior of matter.'
FROM subjects WHERE name = 'Chemistry';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Electron Configuration Basics',
    'Master electron arrangement in atoms using the aufbau principle, Pauli exclusion principle, and Hund''s rule.',
    id,
    'SHS 1',
    50,
    'Electron configuration describes how electrons are distributed in atomic orbitals.'
FROM subjects WHERE name = 'Chemistry';

-- Biology
INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Cell Membrane Structure & Transport',
    'Explore the fluid mosaic model of cell membranes and understand various transport mechanisms across membranes.',
    id,
    'SHS 1',
    50,
    'Cell membranes control what enters and exits cells through various transport mechanisms.'
FROM subjects WHERE name = 'Biology';

INSERT INTO modules (title, description, subject_id, difficulty_level, estimated_duration, content)
SELECT 
    'Photosynthesis Process',
    'Master the mechanisms of photosynthesis, including light-dependent and light-independent reactions in plants.',
    id,
    'SHS 1',
    55,
    'Photosynthesis converts light energy into chemical energy, producing glucose and oxygen.'
FROM subjects WHERE name = 'Biology';