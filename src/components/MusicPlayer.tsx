import { useState, useRef, useEffect } from 'react';
import { MusicTrack } from '@/hooks/useMusicTracks';
import { Play, Pause, SkipBack, SkipForward, Volume2, Trash2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MusicPlayerProps {
  tracks: MusicTrack[];
  onDelete: (id: string, audioUrl: string) => void;
}

export const MusicPlayer = ({ tracks, onDelete }: MusicPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress || 0);
    }
  };

  const handleEnded = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : tracks.length - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex < tracks.length - 1 ? currentIndex + 1 : 0);
  };

  const handleProgressClick = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
      setProgress(value[0]);
    }
  };

  if (tracks.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 text-center">
        <Music className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No hay música aún</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.audio_url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedData={() => {
            if (isPlaying && audioRef.current) {
              audioRef.current.play();
            }
          }}
        />
      )}

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-handwriting text-xl text-foreground">
            {currentTrack?.title || 'Sin título'}
          </h3>
          {currentTrack?.artist && (
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          )}
        </div>

        <Slider
          value={[progress]}
          onValueChange={handleProgressClick}
          max={100}
          step={0.1}
          className="cursor-pointer"
        />

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            onValueChange={(v) => setVolume(v[0])}
            max={100}
            className="flex-1"
          />
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs text-muted-foreground mb-2">Lista de reproducción:</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted/50 ${
                  index === currentIndex ? 'bg-primary/10' : ''
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPlaying(true);
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{track.title}</p>
                  {track.artist && (
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 hover:opacity-100 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(track.id, track.audio_url);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
