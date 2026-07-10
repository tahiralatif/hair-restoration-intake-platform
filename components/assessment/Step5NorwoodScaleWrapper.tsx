'use client';

import { useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { NorwoodScale } from '@/lib/types';
import { Step5NorwoodScale } from './Step5NorwoodScale';

export function Step5NorwoodScaleWrapper() {
  const router = useRouter();
  const { state, actions } = useAssessment();

  const handleNext = (data: NorwoodScale) => {
    actions.updateStep(5, { norwoodScale: data });
    router.push('/assessment/6');
  };

  const handleBack = () => {
    router.push('/assessment/4');
  };

  return (
    <Step5NorwoodScale
      data={state.formData.norwoodScale}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
