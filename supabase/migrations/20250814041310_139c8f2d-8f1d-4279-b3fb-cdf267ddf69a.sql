-- Update quiz time limit to 20 minutes (1200 seconds)
UPDATE public.quizzes 
SET time_limit = 1200 
WHERE id = '6671b56d-d2bc-4bcd-9b72-e415f2ed46e3';