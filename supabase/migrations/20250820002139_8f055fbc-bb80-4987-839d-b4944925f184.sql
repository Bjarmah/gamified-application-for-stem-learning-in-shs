-- Drop the insecure public_profiles view
DROP VIEW IF EXISTS public_profiles;

-- Enable RLS on tables that need it
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for room_members
CREATE POLICY "Users can view room members in rooms they belong to" 
ON room_members FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM room_members rm 
    WHERE rm.room_id = room_members.room_id 
    AND rm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join public rooms" 
ON room_members FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM rooms r 
    WHERE r.id = room_members.room_id 
    AND r.is_public = true
  ) 
  AND auth.uid() = user_id
);

-- Create RLS policies for rooms
CREATE POLICY "Anyone can view public rooms" 
ON rooms FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create rooms" 
ON rooms FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room owners can update their rooms" 
ON rooms FOR UPDATE 
USING (auth.uid() = created_by);

-- Create RLS policies for room_messages
CREATE POLICY "Users can view messages in rooms they belong to" 
ON room_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM room_members rm 
    WHERE rm.room_id = room_messages.room_id 
    AND rm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in rooms they belong to" 
ON room_messages FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM room_members rm 
    WHERE rm.room_id = room_messages.room_id 
    AND rm.user_id = auth.uid()
  ) 
  AND auth.uid() = user_id
);

-- Create RLS policies for room_quizzes
CREATE POLICY "Users can view quizzes in rooms they belong to" 
ON room_quizzes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM room_members rm 
    WHERE rm.room_id = room_quizzes.room_id 
    AND rm.user_id = auth.uid()
  )
);

CREATE POLICY "Room members with owner/moderator role can create quizzes" 
ON room_quizzes FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM room_members rm 
    WHERE rm.room_id = room_quizzes.room_id 
    AND rm.user_id = auth.uid()
    AND rm.role IN ('owner', 'moderator')
  ) 
  AND auth.uid() = created_by
);

-- Create RLS policies for room_quiz_attempts
CREATE POLICY "Users can view their own quiz attempts" 
ON room_quiz_attempts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts" 
ON room_quiz_attempts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix the handle_new_user function to have proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, school, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'school',
        'student'
    );
    RETURN NEW;
END;
$$;

-- Ensure the trigger exists for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();