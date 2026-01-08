import { Memory } from '@/hooks/useMemories';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemoryCardProps {
  memory: Memory;
  onDelete: (id: string, imageUrl: string) => void;
}

export const MemoryCard = ({ memory, onDelete }: MemoryCardProps) => {
  return (
    <div className="group relative bg-card p-3 pb-12 shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-all duration-300 hover:shadow-xl">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={memory.image_url}
          alt={memory.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-handwriting text-lg text-foreground leading-tight">
          {memory.title}
        </h3>
        {memory.description && (
          <p className="font-handwriting text-sm text-muted-foreground leading-snug">
            {memory.description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
        onClick={() => onDelete(memory.id, memory.image_url)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
