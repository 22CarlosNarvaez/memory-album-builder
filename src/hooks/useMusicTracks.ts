import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string | null;
  audio_url: string;
  created_at: string;
}

export const useMusicTracks = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTracks(data);
    }
    setLoading(false);
  };

  const addTrack = async (file: File, title: string, artist: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('music')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('music')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from('music_tracks')
      .insert({ title, artist: artist || null, audio_url: publicUrl });

    if (insertError) throw insertError;

    await fetchTracks();
  };

  const deleteTrack = async (id: string, audioUrl: string) => {
    const fileName = audioUrl.split('/').pop();
    
    if (fileName) {
      await supabase.storage.from('music').remove([fileName]);
    }

    await supabase.from('music_tracks').delete().eq('id', id);
    await fetchTracks();
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return { tracks, loading, addTrack, deleteTrack, refetch: fetchTracks };
};
