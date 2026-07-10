'use client';

import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { PreviousTransplants } from '@/lib/types';
import { Step4PreviousTransplants } from './Step4PreviousTransplants';

export function Step4PreviousTransplantsWrapper() {
  const router = useRouter();
  const { state, actions } = useAssessment();

  const handleNext = (data: PreviousTransplants) => {
    actions.updateStep(4, { previousTransplants: data });
    router.push('/assessment/5');
  };

  const handleBack = () => {
    router.push('/assessment/3');
  };

  return (
    <Step4PreviousTransplants
      data={state.formData.previousTransplants}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
