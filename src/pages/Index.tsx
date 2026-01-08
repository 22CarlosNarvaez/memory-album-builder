import { useMemories } from '@/hooks/useMemories';
import { useMusicTracks } from '@/hooks/useMusicTracks';
import { MemoryCard } from '@/components/MemoryCard';
import { AddMemoryDialog } from '@/components/AddMemoryDialog';
import { AddMusicDialog } from '@/components/AddMusicDialog';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Camera, Heart } from 'lucide-react';

const Index = () => {
  const { memories, loading: memoriesLoading, addMemory, deleteMemory } = useMemories();
  const { tracks, loading: tracksLoading, addTrack, deleteTrack } = useMusicTracks();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-handwriting text-3xl text-foreground">Mis Recuerdos</h1>
                <p className="text-sm text-muted-foreground">Momentos que valen la pena recordar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AddMusicDialog onAdd={addTrack} />
              <AddMemoryDialog onAdd={addMemory} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Memories Grid */}
          <section>
            {memoriesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card p-3 pb-12 animate-pulse">
                    <div className="aspect-square bg-muted rounded" />
                    <div className="mt-3 h-5 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : memories.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 mx-auto text-primary/30 mb-4" />
                <h2 className="font-handwriting text-2xl text-muted-foreground mb-2">
                  Tu álbum está vacío
                </h2>
                <p className="text-muted-foreground">
                  Agrega tu primer recuerdo usando el botón de arriba
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {memories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onDelete={deleteMemory}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Music Player Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <h2 className="font-handwriting text-xl text-foreground mb-4 flex items-center gap-2">
              🎵 Música de fondo
            </h2>
            {tracksLoading ? (
              <div className="bg-card rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/2 mx-auto mb-4" />
                <div className="h-2 bg-muted rounded mb-4" />
                <div className="flex justify-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="h-10 w-10 bg-muted rounded-full" />
                </div>
              </div>
            ) : (
              <MusicPlayer tracks={tracks} onDelete={deleteTrack} />
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;
