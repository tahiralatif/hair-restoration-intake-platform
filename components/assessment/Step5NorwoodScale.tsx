'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NorwoodScale } from '@/lib/types';
import { NorwoodScaleSelector } from './NorwoodScaleSelector';
import { ChevronLeft } from 'lucide-react';

interface Step5Props {
  data?: NorwoodScale;
  onNext: (data: NorwoodScale) => void;
  onBack: () => void;
}

export function Step5NorwoodScale({ data, onNext, onBack }: Step5Props) {
  const [selectedStage, setSelectedStage] = useState<NorwoodScale | undefined>(data);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStage) {
      setError('Please select your current Norwood scale stage');
      return;
    }

    onNext(selectedStage);
  };

  const handleStageChange = (stage: NorwoodScale) => {
    setSelectedStage(stage);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Norwood Scale Assessment</h2>
          <p className="text-muted-foreground mt-2">
            Select the stage that best represents your current hair loss pattern. This helps us understand your condition and recommend the most appropriate treatment.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        <NorwoodScaleSelector
          value={selectedStage}
          onChange={handleStageChange}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          Next
        </Button>
      </div>
    </form>
  );
}
