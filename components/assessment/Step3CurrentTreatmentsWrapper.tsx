'use client';

import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { CurrentTreatments } from '@/lib/types';
import { Step3CurrentTreatments } from './Step3CurrentTreatments';

export function Step3CurrentTreatmentsWrapper() {
  const router = useRouter();
  const { state, actions } = useAssessment();

  const handleNext = (data: CurrentTreatments) => {
    actions.updateStep(3, { currentTreatments: data });
    router.push('/assessment/4');
  };

  const handleBack = () => {
    router.push('/assessment/2');
  };

  return (
    <Step3CurrentTreatments
      data={state.formData.currentTreatments}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
