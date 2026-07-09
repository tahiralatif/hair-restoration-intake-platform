import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  'Personal Info',
  'Hair Loss History',
  'Current Treatments',
  'Previous Transplants',
  'Norwood Scale',
  'Photo Upload',
  'Desired Outcome',
  'Budget & Scheduling',
  'Confirmation',
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Numbers */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  {
                    'bg-primary text-primary-foreground': isCurrent,
                    'bg-success text-white': isCompleted,
                    'bg-muted text-muted-foreground': isUpcoming,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs text-center hidden sm:block transition-colors',
                  {
                    'text-primary font-medium': isCurrent,
                    'text-foreground': isCompleted,
                    'text-muted-foreground': isUpcoming,
                  }
                )}
              >
                {stepTitles[step - 1]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Title (Mobile) */}
      <div className="sm:hidden text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-lg font-semibold text-primary">
          {stepTitles[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}
