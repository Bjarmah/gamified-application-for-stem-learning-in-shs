-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- System can insert notifications for any user
CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create function to send notifications
CREATE OR REPLACE FUNCTION public.send_notification(
  target_user_id UUID,
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT DEFAULT 'info',
  notification_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (target_user_id, notification_title, notification_message, notification_type, notification_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create function to notify room members
CREATE OR REPLACE FUNCTION public.notify_room_members(
  room_id_param UUID,
  exclude_user_id UUID,
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT DEFAULT 'info',
  notification_data JSONB DEFAULT '{}'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_count INTEGER := 0;
  member_record RECORD;
BEGIN
  -- Send notification to all room members except the excluded user
  FOR member_record IN 
    SELECT rm.user_id 
    FROM room_members rm 
    WHERE rm.room_id = room_id_param 
    AND rm.user_id != exclude_user_id
  LOOP
    PERFORM send_notification(
      member_record.user_id,
      notification_title,
      notification_message,
      notification_type,
      notification_data
    );
    notification_count := notification_count + 1;
  END LOOP;
  
  RETURN notification_count;
END;
$$;

-- Add trigger for room member joins
CREATE OR REPLACE FUNCTION public.handle_room_member_join()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  room_name TEXT;
  user_name TEXT;
BEGIN
  -- Get room name
  SELECT name INTO room_name FROM rooms WHERE id = NEW.room_id;
  
  -- Get user name
  SELECT COALESCE(full_name, 'A user') INTO user_name 
  FROM profiles WHERE id = NEW.user_id;
  
  -- Notify other room members
  PERFORM notify_room_members(
    NEW.room_id,
    NEW.user_id,
    'New Member Joined',
    user_name || ' joined ' || room_name,
    'room_join',
    jsonb_build_object('room_id', NEW.room_id, 'user_id', NEW.user_id)
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for room member joins
CREATE TRIGGER on_room_member_join
  AFTER INSERT ON room_members
  FOR EACH ROW
  EXECUTE FUNCTION handle_room_member_join();

-- Add trigger for new room messages
CREATE OR REPLACE FUNCTION public.handle_room_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  room_name TEXT;
  user_name TEXT;
BEGIN
  -- Get room name
  SELECT name INTO room_name FROM rooms WHERE id = NEW.room_id;
  
  -- Get user name
  SELECT COALESCE(full_name, 'Someone') INTO user_name 
  FROM profiles WHERE id = NEW.user_id;
  
  -- Notify other room members
  PERFORM notify_room_members(
    NEW.room_id,
    NEW.user_id,
    'New Message in ' || room_name,
    user_name || ' sent a message',
    'room_message',
    jsonb_build_object('room_id', NEW.room_id, 'message_id', NEW.id)
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for room messages
CREATE TRIGGER on_room_message
  AFTER INSERT ON room_messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_room_message();

-- Add trigger for new quiz attempts
CREATE OR REPLACE FUNCTION public.handle_quiz_attempt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  quiz_title TEXT;
  user_name TEXT;
  room_id_var UUID;
BEGIN
  -- Get quiz title and room
  SELECT rq.title, rq.room_id INTO quiz_title, room_id_var 
  FROM room_quizzes rq WHERE rq.id = NEW.quiz_id;
  
  -- Get user name
  SELECT COALESCE(full_name, 'Someone') INTO user_name 
  FROM profiles WHERE id = NEW.user_id;
  
  -- Notify other room members
  PERFORM notify_room_members(
    room_id_var,
    NEW.user_id,
    'Quiz Completed',
    user_name || ' completed "' || quiz_title || '" with ' || NEW.percentage || '%',
    'quiz_complete',
    jsonb_build_object('quiz_id', NEW.quiz_id, 'score', NEW.percentage)
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for quiz attempts
CREATE TRIGGER on_quiz_attempt
  AFTER INSERT ON room_quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION handle_quiz_attempt();

-- Create index for better performance
CREATE INDEX idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, read);