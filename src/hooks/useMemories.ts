import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Memory {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMemories(data);
    }
    setLoading(false);
  };

  const addMemory = async (file: File, title: string, description: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('memories')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from('memories')
      .insert({ title, description, image_url: publicUrl });

    if (insertError) throw insertError;

    await fetchMemories();
  };

  const deleteMemory = async (id: string, imageUrl: string) => {
    const fileName = imageUrl.split('/').pop();
    
    if (fileName) {
      await supabase.storage.from('memories').remove([fileName]);
    }

    await supabase.from('memories').delete().eq('id', id);
    await fetchMemories();
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return { memories, loading, addMemory, deleteMemory, refetch: fetchMemories };
};
