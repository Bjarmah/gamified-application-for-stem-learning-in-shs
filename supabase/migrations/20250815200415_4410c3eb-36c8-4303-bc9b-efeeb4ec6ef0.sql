-- Update quizzes to link to the correct modules

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Solving Linear Equations' LIMIT 1)
WHERE title = 'Solving Linear Equations Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Linear Inequalities' LIMIT 1)
WHERE title = 'Linear Inequalities Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Systems of Linear Equations' LIMIT 1)
WHERE title = 'Systems of Linear Equations Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Introduction to Quadratic Functions' LIMIT 1)
WHERE title = 'Introduction to Quadratic Functions Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Solving Quadratic Equations' LIMIT 1)
WHERE title = 'Solving Quadratic Equations Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Quadratic Applications & Modeling' LIMIT 1)
WHERE title = 'Quadratic Applications & Modeling Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Kinematics - Motion in One Dimension' LIMIT 1)
WHERE title = 'Kinematics - Motion in One Dimension Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Dynamics - Forces and Newton''s Laws' LIMIT 1)
WHERE title = 'Dynamics - Forces and Newton''s Laws Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Work, Energy, and Power' LIMIT 1)
WHERE title = 'Work, Energy, and Power Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Programming Logic & Algorithms' LIMIT 1)
WHERE title = 'Programming Logic & Algorithms Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Introduction to Scratch Programming' LIMIT 1)
WHERE title = 'Introduction to Scratch Programming Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'HTML Fundamentals for Web Development' LIMIT 1)
WHERE title = 'HTML Fundamentals for Web Development Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Atomic Theory Foundations' LIMIT 1)
WHERE title = 'Atomic Theory Foundations Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Electron Configuration Basics' LIMIT 1)
WHERE title = 'Electron Configuration Basics Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Cell Membrane Structure & Transport' LIMIT 1)
WHERE title = 'Cell Membrane Structure & Transport Quiz';

UPDATE quizzes 
SET module_id = (SELECT id FROM modules WHERE title = 'Photosynthesis Process' LIMIT 1)
WHERE title = 'Photosynthesis Process Quiz';