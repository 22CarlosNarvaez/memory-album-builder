import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Music } from 'lucide-react';
import { toast } from 'sonner';

interface AddMusicDialogProps {
  onAdd: (file: File, title: string, artist: string) => Promise<void>;
}

export const AddMusicDialog = ({ onAdd }: AddMusicDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !title) {
      toast.error('Por favor selecciona un archivo y agrega un título');
      return;
    }

    setLoading(true);
    try {
      await onAdd(file, title, artist);
      toast.success('¡Música agregada!');
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Error al agregar la música');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Música
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-2xl">Nueva Canción</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-2">
              <Music className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : 'Haz clic para seleccionar un archivo de audio'}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="music-title">Título de la canción</Label>
            <Input
              id="music-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nuestra canción"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artista (opcional)</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Ej: Ed Sheeran"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Canción'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
