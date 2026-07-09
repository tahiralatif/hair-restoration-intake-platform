'use client';

import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { CurrentTreatments } from '@/lib/types';
import { Step3CurrentTreatments } from './Step3CurrentTreatments';

export function Step3CurrentTreatmentsWrapper() {
  const { state, actions } = useAssessment();

  const handleNext = (data: CurrentTreatments) => {
    actions.updateStep(3, { currentTreatments: data });
    actions.nextStep();
  };

  const handleBack = () => {
    actions.previousStep();
  };

  return (
    <Step3CurrentTreatments
      data={state.formData.currentTreatments}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
