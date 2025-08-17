-- Remove all biology modules and related data from Supabase database

-- First, get the Biology subject ID
DO $$
DECLARE
    biology_subject_id uuid;
    module_rec RECORD;
BEGIN
    -- Get the Biology subject ID
    SELECT id INTO biology_subject_id 
    FROM subjects 
    WHERE name = 'Biology';
    
    IF biology_subject_id IS NOT NULL THEN
        -- Delete quiz attempts for biology quizzes
        DELETE FROM quiz_attempts 
        WHERE quiz_id IN (
            SELECT q.id 
            FROM quizzes q 
            JOIN modules m ON q.module_id = m.id 
            WHERE m.subject_id = biology_subject_id
        );
        
        -- Delete quizzes for biology modules
        DELETE FROM quizzes 
        WHERE module_id IN (
            SELECT id 
            FROM modules 
            WHERE subject_id = biology_subject_id
        );
        
        -- Delete user progress for biology modules
        DELETE FROM user_progress 
        WHERE module_id IN (
            SELECT id 
            FROM modules 
            WHERE subject_id = biology_subject_id
        );
        
        -- Finally, delete all biology modules
        DELETE FROM modules 
        WHERE subject_id = biology_subject_id;
        
        RAISE NOTICE 'Successfully deleted all biology modules and related data';
    ELSE
        RAISE NOTICE 'No Biology subject found';
    END IF;
END $$;