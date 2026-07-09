'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { Step1PersonalInfo } from '@/components/assessment/Step1PersonalInfo';
import { Step2HairLossHistoryWrapper } from '@/components/assessment/Step2HairLossHistoryWrapper';
import { Step3CurrentTreatmentsWrapper } from '@/components/assessment/Step3CurrentTreatmentsWrapper';
import { Step4PreviousTransplantsWrapper } from '@/components/assessment/Step4PreviousTransplantsWrapper';
import { Step5NorwoodScaleWrapper } from '@/components/assessment/Step5NorwoodScaleWrapper';
import { Step6PhotoUpload } from '@/components/assessment/Step6PhotoUpload';
import { Step7DesiredOutcome } from '@/components/assessment/Step7DesiredOutcome';
import { Step8BudgetScheduling } from '@/components/assessment/Step8BudgetScheduling';
import { Step9Confirmation } from '@/components/assessment/Step9Confirmation';

// ============================================================================
// Step Component Mapping
// ============================================================================

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: Step1PersonalInfo,
  2: Step2HairLossHistoryWrapper,
  3: Step3CurrentTreatmentsWrapper,
  4: Step4PreviousTransplantsWrapper,
  5: Step5NorwoodScaleWrapper,
  6: Step6PhotoUpload,
  7: Step7DesiredOutcome,
  8: Step8BudgetScheduling,
  9: Step9Confirmation,
};

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentStepPage() {
  const params = useParams();
  const router = useRouter();
  const { state, actions } = useAssessment();

  // Parse step number from URL
  const stepParam = params.step as string;
  const stepNumber = parseInt(stepParam, 10);

  // Validate step number
  useEffect(() => {
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 9) {
      router.push('/assessment/1');
      return;
    }

    // Sync URL with context state
    if (state.currentStep !== stepNumber) {
      actions.setCurrentStep(stepNumber);
    }
  }, [stepNumber, state.currentStep, actions, router]);

  // Update URL when context step changes
  useEffect(() => {
    if (state.currentStep !== stepNumber && !isNaN(stepNumber)) {
      router.push(`/assessment/${state.currentStep}`);
    }
  }, [state.currentStep, stepNumber, router]);

  // Get the appropriate step component
  const StepComponent = STEP_COMPONENTS[stepNumber];

  // Show loading or error state
  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 9) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Invalid step. Redirecting...</p>
      </div>
    );
  }

  if (!StepComponent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Step not found</p>
      </div>
    );
  }

  return <StepComponent />;
}
