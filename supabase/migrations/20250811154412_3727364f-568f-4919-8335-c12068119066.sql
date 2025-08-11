-- Remove robotics-related content from the database

-- First, remove any user progress related to robotics modules
DELETE FROM user_progress 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE subject_id = '5e1291f0-930c-49e6-b885-0b7c1decde3d'
);

-- Remove any quiz attempts for robotics quizzes
DELETE FROM quiz_attempts 
WHERE quiz_id IN (
  SELECT id FROM quizzes 
  WHERE module_id IN (
    SELECT id FROM modules 
    WHERE subject_id = '5e1291f0-930c-49e6-b885-0b7c1decde3d'
  )
);

-- Remove quizzes for robotics modules
DELETE FROM quizzes 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE subject_id = '5e1291f0-930c-49e6-b885-0b7c1decde3d'
);

-- Remove robotics modules
DELETE FROM modules 
WHERE subject_id = '5e1291f0-930c-49e6-b885-0b7c1decde3d';

-- Remove any messages in robotics rooms
DELETE FROM messages 
WHERE room_id IN (
  SELECT id FROM rooms 
  WHERE subject_id = '5e1291f0-930c-49e6-b885-0b7c1decde3d'
);

-- Remove robotics rooms
DELETE FROM rooms 
WHERE subject_id = '5e1291f0-930c-49e6-b885-0b7c1decde3d';

-- Finally, remove the robotics subject itself
DELETE FROM subjects 
WHERE id = '5e1291f0-930c-49e6-b885-0b7c1decde3d';