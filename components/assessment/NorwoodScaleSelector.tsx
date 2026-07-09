import { NorwoodScale } from '@/lib/types';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NorwoodScaleSelectorProps {
  value?: NorwoodScale;
  onChange: (scale: NorwoodScale) => void;
}

const norwoodStages: { value: NorwoodScale; label: string; description: string }[] = [
  { value: '1', label: 'Stage 1', description: 'Minimal or no hair loss' },
  { value: '2', label: 'Stage 2', description: 'Slight recession at temples' },
  { value: '3', label: 'Stage 3', description: 'Deeper temple recession' },
  { value: '3V', label: 'Stage 3 Vertex', description: 'Temple recession + crown thinning' },
  { value: '4', label: 'Stage 4', description: 'Increased frontal and crown loss' },
  { value: '5', label: 'Stage 5', description: 'Wider frontal and crown loss' },
  { value: '6', label: 'Stage 6', description: 'Bridge of hair between front and crown gone' },
  { value: '7', label: 'Stage 7', description: 'Only horseshoe pattern remains' },
];

export function NorwoodScaleSelector({ value, onChange }: NorwoodScaleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {norwoodStages.map((stage) => {
          const isSelected = value === stage.value;
          
          return (
            <button
              key={stage.value}
              type="button"
              onClick={() => onChange(stage.value)}
              className={cn(
                'relative flex flex-col items-center gap-3 p-4 border-2 rounded-xl transition-all hover:shadow-md',
                {
                  'border-primary bg-primary/5': isSelected,
                  'border-border hover:border-primary/50': !isSelected,
                }
              )}
            >
              {/* Check Icon */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              {/* Norwood Stage Illustration */}
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stage.label.replace('Stage ', '')}</div>
                </div>
              </div>

              {/* Stage Label */}
              <div className="text-center space-y-1">
                <p className="font-semibold text-sm">{stage.label}</p>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Information Box */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold text-sm mb-2">About the Norwood Scale</h4>
        <p className="text-sm text-muted-foreground">
          The Norwood Scale is the leading classification system used to measure the extent of male pattern baldness. 
          Select the stage that best matches your current hair loss pattern.
        </p>
      </div>

      {value && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm">
            <span className="font-semibold">Selected: </span>
            {norwoodStages.find(s => s.value === value)?.label} - {norwoodStages.find(s => s.value === value)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
