-- Add room-based quiz system
-- This migration adds support for room-based quizzes and room members

-- Create room_members table
CREATE TABLE IF NOT EXISTS room_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, user_id)
);

-- Create room_quizzes table (separate from module quizzes)
CREATE TABLE IF NOT EXISTS room_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    time_limit INTEGER, -- in minutes
    passing_score INTEGER DEFAULT 70,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room_quiz_attempts table
CREATE TABLE IF NOT EXISTS room_quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID NOT NULL REFERENCES room_quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    answers JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room_messages table
CREATE TABLE IF NOT EXISTS room_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);
CREATE INDEX IF NOT EXISTS idx_room_quizzes_room_id ON room_quizzes(room_id);
CREATE INDEX IF NOT EXISTS idx_room_quiz_attempts_quiz_id ON room_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_room_quiz_attempts_user_id ON room_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_room_messages_room_id ON room_messages(room_id);

-- Add RLS policies
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

-- Room members policies
CREATE POLICY "Users can view room members of rooms they belong to" ON room_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_members.room_id 
            AND rm.user_id = auth.uid()
        )
    );

CREATE POLICY "Room owners can add/remove members" ON room_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_members.room_id 
            AND rm.user_id = auth.uid() 
            AND rm.role = 'owner'
        )
    );

-- Room quizzes policies
CREATE POLICY "Users can view quizzes in rooms they belong to" ON room_quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_quizzes.room_id 
            AND rm.user_id = auth.uid()
        )
    );

CREATE POLICY "Room owners can create/edit quizzes" ON room_quizzes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_quizzes.room_id 
            AND rm.user_id = auth.uid() 
            AND rm.role = 'owner'
        )
    );

-- Room quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON room_quiz_attempts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own quiz attempts" ON room_quiz_attempts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Room messages policies
CREATE POLICY "Users can view messages in rooms they belong to" ON room_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_messages.room_id 
            AND rm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to rooms they belong to" ON room_messages
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_messages.room_id 
            AND rm.user_id = auth.uid()
        )
    );

-- Add unique room code column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_code TEXT UNIQUE;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS max_members INTEGER DEFAULT 50;

-- Create function to generate unique room codes
CREATE OR REPLACE FUNCTION generate_room_code() RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_already BOOLEAN;
BEGIN
    LOOP
        -- Generate 8-character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM rooms WHERE room_code = code) INTO exists_already;
        
        -- If code doesn't exist, return it
        IF NOT exists_already THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to create a new room with owner
CREATE OR REPLACE FUNCTION create_room_with_owner(
    room_name TEXT,
    room_description TEXT,
    room_subject_id UUID,
    room_is_public BOOLEAN,
    room_max_members INTEGER,
    owner_user_id UUID
) RETURNS UUID AS $$
DECLARE
    new_room_id UUID;
    room_code TEXT;
BEGIN
    -- Generate unique room code
    room_code := generate_room_code();
    
    -- Create the room
    INSERT INTO rooms (name, description, subject_id, is_public, max_members, room_code, created_by)
    VALUES (room_name, room_description, room_subject_id, room_is_public, room_max_members, room_code, owner_user_id)
    RETURNING id INTO new_room_id;
    
    -- Add the creator as owner
    INSERT INTO room_members (room_id, user_id, role)
    VALUES (new_room_id, owner_user_id, 'owner');
    
    RETURN new_room_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to join a room
CREATE OR REPLACE FUNCTION join_room_by_code(
    room_code_input TEXT,
    user_id_input UUID
) RETURNS BOOLEAN AS $$
DECLARE
    target_room_id UUID;
    current_member_count INTEGER;
    max_member_count INTEGER;
BEGIN
    -- Find the room by code
    SELECT id, max_members INTO target_room_id, max_member_count
    FROM rooms 
    WHERE room_code = room_code_input AND is_public = true;
    
    IF target_room_id IS NULL THEN
        RETURN false; -- Room not found or not public
    END IF;
    
    -- Check if user is already a member
    IF EXISTS (SELECT 1 FROM room_members WHERE room_id = target_room_id AND user_id = user_id_input) THEN
        RETURN false; -- Already a member
    END IF;
    
    -- Check if room is full
    SELECT COUNT(*) INTO current_member_count
    FROM room_members 
    WHERE room_id = target_room_id;
    
    IF current_member_count >= max_member_count THEN
        RETURN false; -- Room is full
    END IF;
    
    -- Add user to room
    INSERT INTO room_members (room_id, user_id, role)
    VALUES (target_room_id, user_id_input, 'member');
    
    RETURN true; -- Successfully joined
END;
$$ LANGUAGE plpgsql;

