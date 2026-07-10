'use client';

import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { HairLossHistory } from '@/lib/types';
import { Step2HairLossHistory } from './Step2HairLossHistory';

export function Step2HairLossHistoryWrapper() {
  const router = useRouter();
  const { state, actions } = useAssessment();

  const handleNext = (data: HairLossHistory) => {
    actions.updateStep(2, { hairLossHistory: data });
    router.push('/assessment/3');
  };

  const handleBack = () => {
    router.push('/assessment/1');
  };

  return (
    <Step2HairLossHistory
      data={state.formData.hairLossHistory}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
