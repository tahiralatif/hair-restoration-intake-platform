'use client';

import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { NorwoodScale } from '@/lib/types';
import { Step5NorwoodScale } from './Step5NorwoodScale';

export function Step5NorwoodScaleWrapper() {
  const { state, actions } = useAssessment();

  const handleNext = (data: NorwoodScale) => {
    actions.updateStep(5, { norwoodScale: data });
    actions.nextStep();
  };

  const handleBack = () => {
    actions.previousStep();
  };

  return (
    <Step5NorwoodScale
      data={state.formData.norwoodScale}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
