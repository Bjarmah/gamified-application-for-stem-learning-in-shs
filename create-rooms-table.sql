-- Create rooms table for the room-based quiz system
-- Run this in your Supabase SQL editor

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    room_code TEXT UNIQUE NOT NULL,
    max_members INTEGER DEFAULT 50,
    is_public BOOLEAN DEFAULT false,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create room_quizzes table
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

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rooms
DROP POLICY IF EXISTS "Users can view public rooms" ON rooms;
CREATE POLICY "Users can view public rooms" ON rooms
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can view rooms they belong to" ON rooms;
CREATE POLICY "Users can view rooms they belong to" ON rooms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = rooms.id 
            AND rm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create rooms" ON rooms;
CREATE POLICY "Users can create rooms" ON rooms
    FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Room owners can update their rooms" ON rooms;
CREATE POLICY "Room owners can update their rooms" ON rooms
    FOR UPDATE USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Room owners can delete their rooms" ON rooms;
CREATE POLICY "Room owners can delete their rooms" ON rooms
    FOR DELETE USING (created_by = auth.uid());

-- Create RLS policies for room_members
DROP POLICY IF EXISTS "Users can view room members of rooms they belong to" ON room_members;
CREATE POLICY "Users can view room members of rooms they belong to" ON room_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_members.room_id 
            AND rm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Room owners can add/remove members" ON room_members;
CREATE POLICY "Room owners can add/remove members" ON room_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_members.room_id 
            AND rm.user_id = auth.uid() 
            AND rm.role = 'owner'
        )
    );

-- Create RLS policies for room_quizzes
DROP POLICY IF EXISTS "Users can view quizzes in rooms they belong to" ON room_quizzes;
CREATE POLICY "Users can view quizzes in rooms they belong to" ON room_quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_quizzes.room_id 
            AND rm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Room owners can create/edit quizzes" ON room_quizzes;
CREATE POLICY "Room owners can create/edit quizzes" ON room_quizzes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_quizzes.room_id 
            AND rm.user_id = auth.uid() 
            AND rm.role = 'owner'
        )
    );

-- Create RLS policies for room_quiz_attempts
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON room_quiz_attempts;
CREATE POLICY "Users can view their own quiz attempts" ON room_quiz_attempts
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own quiz attempts" ON room_quiz_attempts;
CREATE POLICY "Users can create their own quiz attempts" ON room_quiz_attempts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for room_messages
DROP POLICY IF EXISTS "Users can view messages in rooms they belong to" ON room_messages;
CREATE POLICY "Users can view messages in rooms they belong to" ON room_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_messages.room_id 
            AND rm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can send messages to rooms they belong to" ON room_messages;
CREATE POLICY "Users can send messages to rooms they belong to" ON room_messages
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM room_members rm 
            WHERE rm.room_id = room_messages.room_id 
            AND rm.user_id = auth.uid()
        )
    );

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS set_rooms_updated_at ON rooms;
CREATE TRIGGER set_rooms_updated_at
BEFORE UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_room_quizzes_updated_at ON room_quizzes;
CREATE TRIGGER set_room_quizzes_updated_at
BEFORE UPDATE ON room_quizzes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Verify tables were created
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('rooms', 'room_members', 'room_quizzes', 'room_quiz_attempts', 'room_messages')
ORDER BY table_name;
