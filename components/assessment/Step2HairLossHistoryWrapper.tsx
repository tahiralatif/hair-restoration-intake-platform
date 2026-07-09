'use client';

import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { HairLossHistory } from '@/lib/types';
import { Step2HairLossHistory } from './Step2HairLossHistory';

export function Step2HairLossHistoryWrapper() {
  const { state, actions } = useAssessment();

  const handleNext = (data: HairLossHistory) => {
    actions.updateStep(2, { hairLossHistory: data });
    actions.nextStep();
  };

  const handleBack = () => {
    actions.previousStep();
  };

  return (
    <Step2HairLossHistory
      data={state.formData.hairLossHistory}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
