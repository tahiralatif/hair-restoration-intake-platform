'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Edit } from 'lucide-react';

// ============================================================================
// Component
// ============================================================================

export function Step9Confirmation() {
  const { state, actions } = useAssessment();
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { formData } = state;

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleEditStep = (step: number) => {
    actions.setCurrentStep(step);
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const patientId = await actions.submitAssessment();
      router.push(`/assessment/complete?id=${patientId}`);
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    actions.previousStep();
  };

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderSection = (title: string, step: number, content: React.ReactNode) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditStep(step)}
          className="text-primary hover:text-primary/90"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );

  const renderField = (label: string, value: string | undefined) => (
    <div className="flex justify-between py-2">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-900">{value || 'N/A'}</span>
    </div>
  );

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Review & Confirm</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please review your information carefully before submitting. You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        {formData.personalInfo && renderSection(
          'Personal Information',
          1,
          <div className="space-y-1">
            {renderField('Name', `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`)}
            {renderField('Email', formData.personalInfo.email)}
            {renderField('Phone', formData.personalInfo.phone)}
            {renderField('Date of Birth', formData.personalInfo.dateOfBirth)}
            {renderField('Gender', formData.personalInfo.gender)}
            {renderField('Address', `${formData.personalInfo.address.city}, ${formData.personalInfo.address.state}`)}
          </div>
        )}

        {/* Hair Loss History */}
        {formData.hairLossHistory && renderSection(
          'Hair Loss History',
          2,
          <div className="space-y-1">
            {renderField('Age When Started', formData.hairLossHistory.ageWhenStarted?.toString())}
            {renderField('Family History', formData.hairLossHistory.familyHistory ? 'Yes' : 'No')}
            {renderField('Progression Rate', formData.hairLossHistory.progressionRate)}
            {renderField('Affected Areas', formData.hairLossHistory.affectedAreas.join(', '))}
          </div>
        )}

        {/* Current Treatments */}
        {formData.currentTreatments && renderSection(
          'Current Treatments',
          3,
          <div className="space-y-1">
            {renderField('Using Minoxidil', formData.currentTreatments.usingMinoxidil ? 'Yes' : 'No')}
            {renderField('Using Finasteride', formData.currentTreatments.usingFinasteride ? 'Yes' : 'No')}
            {renderField('Duration', formData.currentTreatments.duration || 'N/A')}
            {renderField('Effectiveness', formData.currentTreatments.effectiveness || 'N/A')}
          </div>
        )}

        {/* Previous Transplants */}
        {formData.previousTransplants && renderSection(
          'Previous Hair Transplants',
          4,
          <div className="space-y-1">
            {renderField('Had Previous Transplant', formData.previousTransplants.hadPreviousTransplant ? 'Yes' : 'No')}
            {formData.previousTransplants.hadPreviousTransplant && (
              <>
                {renderField('Transplant Date', formData.previousTransplants.transplantDate)}
                {renderField('Method', formData.previousTransplants.transplantMethod)}
                {renderField('Grafts', formData.previousTransplants.graftsTransplanted?.toString())}
              </>
            )}
          </div>
        )}

        {/* Norwood Scale */}
        {formData.norwoodScale && renderSection(
          'Norwood Scale Assessment',
          5,
          <div className="space-y-1">
            {renderField('Norwood Stage', formData.norwoodScale)}
          </div>
        )}

        {/* Photos */}
        {formData.photos && renderSection(
          'Photos',
          6,
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">6 photos uploaded</span>
          </div>
        )}

        {/* Desired Outcome */}
        {formData.desiredOutcome && renderSection(
          'Desired Outcome',
          7,
          <div className="space-y-1">
            {renderField('Primary Goal', formData.desiredOutcome.primaryGoal.substring(0, 100) + (formData.desiredOutcome.primaryGoal.length > 100 ? '...' : ''))}
            {renderField('Specific Areas', formData.desiredOutcome.specificAreas.join(', '))}
            {renderField('Timeline', formData.desiredOutcome.timelinePreference)}
          </div>
        )}

        {/* Budget & Scheduling */}
        {formData.budgetScheduling && renderSection(
          'Budget & Scheduling',
          8,
          <div className="space-y-1">
            {renderField('Budget Range', formData.budgetScheduling.budgetRange)}
            {renderField('Contact Method', formData.budgetScheduling.preferredContactMethod)}
            {renderField('Availability', `${formData.budgetScheduling.availability.length} time slots selected`)}
          </div>
        )}
      </div>

      <Separator />

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => {
              setAgreedToTerms(checked as boolean);
              if (checked) setError('');
            }}
          />
          <div className="space-y-1 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I agree to the terms and conditions
            </label>
            <p className="text-sm text-gray-500">
              By submitting this assessment, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
              . Your information will be reviewed by our medical team.
            </p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !agreedToTerms}>
          {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
        </Button>
      </div>
    </div>
  );
}
