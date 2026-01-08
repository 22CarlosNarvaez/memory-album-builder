-- Create table for memories (photos with descriptions)
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for music tracks
CREATE TABLE public.music_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view the album)
CREATE POLICY "Anyone can view memories" 
ON public.memories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert memories" 
ON public.memories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete memories" 
ON public.memories 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can view music" 
ON public.music_tracks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert music" 
ON public.music_tracks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete music" 
ON public.music_tracks 
FOR DELETE 
USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('memories', 'memories', true);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true);

-- Storage policies for memories bucket
CREATE POLICY "Anyone can view memory images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'memories');

CREATE POLICY "Anyone can upload memory images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'memories');

CREATE POLICY "Anyone can delete memory images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'memories');

-- Storage policies for music bucket
CREATE POLICY "Anyone can view music files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'music');

CREATE POLICY "Anyone can upload music files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'music');

CREATE POLICY "Anyone can delete music files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'music');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();