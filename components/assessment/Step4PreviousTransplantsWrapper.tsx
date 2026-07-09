'use client';

import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { PreviousTransplants } from '@/lib/types';
import { Step4PreviousTransplants } from './Step4PreviousTransplants';

export function Step4PreviousTransplantsWrapper() {
  const { state, actions } = useAssessment();

  const handleNext = (data: PreviousTransplants) => {
    actions.updateStep(4, { previousTransplants: data });
    actions.nextStep();
  };

  const handleBack = () => {
    actions.previousStep();
  };

  return (
    <Step4PreviousTransplants
      data={state.formData.previousTransplants}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
