-- Add image support to room messages
ALTER TABLE public.room_messages ADD COLUMN image_url TEXT;

-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public) VALUES ('room-images', 'room-images', true);

-- Create RLS policies for room image uploads
CREATE POLICY "Users can upload images to their rooms" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'room-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Room images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'room-images');

CREATE POLICY "Users can update their own room images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'room-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own room images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'room-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);