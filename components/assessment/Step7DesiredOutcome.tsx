'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { DesiredOutcome, TimelinePreference } from '@/lib/types';
import { validateRequired } from '@/lib/validation';

// ============================================================================
// Constants
// ============================================================================

const SPECIFIC_AREAS = [
  { id: 'hairline', label: 'Hairline' },
  { id: 'crown', label: 'Crown' },
  { id: 'temples', label: 'Temples' },
  { id: 'vertex', label: 'Vertex (top of head)' },
  { id: 'overall-density', label: 'Overall Density' },
];

const TIMELINE_OPTIONS: Array<{ value: TimelinePreference; label: string }> = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-12-months', label: '6-12 months' },
  { value: 'flexible', label: 'Flexible / Just exploring options' },
];

// ============================================================================
// Component
// ============================================================================

export function Step7DesiredOutcome() {
  const { state, actions } = useAssessment();
  const [formData, setFormData] = useState<DesiredOutcome>(
    state.formData.desiredOutcome || {
      primaryGoal: '',
      specificAreas: [],
      expectations: '',
      timelinePreference: 'flexible',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Character limits
  const PRIMARY_GOAL_MAX = 500;
  const EXPECTATIONS_MAX = 500;

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    if (state.formData.desiredOutcome) {
      setFormData(state.formData.desiredOutcome);
    }
  }, [state.formData.desiredOutcome]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleChange = (field: keyof DesiredOutcome, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAreaToggle = (areaId: string) => {
    const currentAreas = formData.specificAreas || [];
    const updatedAreas = currentAreas.includes(areaId)
      ? currentAreas.filter((id) => id !== areaId)
      : [...currentAreas, areaId];
    
    handleChange('specificAreas', updatedAreas);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate primary goal
    const goalValidation = validateRequired(formData.primaryGoal, 'Primary goal');
    if (!goalValidation.isValid && goalValidation.error) {
      newErrors.primaryGoal = goalValidation.error;
    }

    // Validate specific areas
    if (!formData.specificAreas || formData.specificAreas.length === 0) {
      newErrors.specificAreas = 'Please select at least one area';
    }

    // Validate expectations
    const expectationsValidation = validateRequired(formData.expectations, 'Expectations');
    if (!expectationsValidation.isValid && expectationsValidation.error) {
      newErrors.expectations = expectationsValidation.error;
    }

    // Validate timeline preference
    const timelineValidation = validateRequired(formData.timelinePreference, 'Timeline preference');
    if (!timelineValidation.isValid && timelineValidation.error) {
      newErrors.timelinePreference = timelineValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      actions.updateStep(7, { desiredOutcome: formData });
      actions.nextStep();
    }
  };

  const handleBack = () => {
    actions.updateStep(7, { desiredOutcome: formData });
    actions.previousStep();
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Desired Outcome</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your goals and expectations for hair restoration treatment.
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary Goal */}
        <FormField
          label="What is your primary goal for hair restoration?"
          error={errors.primaryGoal}
          required
        >
          <Textarea
            value={formData.primaryGoal}
            onChange={(e) => handleChange('primaryGoal', e.target.value)}
            placeholder="Describe your primary goal in detail..."
            rows={4}
            maxLength={PRIMARY_GOAL_MAX}
            className={errors.primaryGoal ? 'border-red-500' : ''}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">
              {formData.primaryGoal.length} / {PRIMARY_GOAL_MAX} characters
            </span>
          </div>
        </FormField>

        {/* Specific Areas */}
        <FormField
          label="Which specific areas are you most concerned about?"
          error={errors.specificAreas}
          required
        >
          <div className="space-y-3">
            {SPECIFIC_AREAS.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox
                  id={area.id}
                  checked={formData.specificAreas?.includes(area.id)}
                  onCheckedChange={() => handleAreaToggle(area.id)}
                />
                <label
                  htmlFor={area.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {area.label}
                </label>
              </div>
            ))}
          </div>
        </FormField>

        {/* Expectations */}
        <FormField
          label="What are your expectations from the treatment?"
          error={errors.expectations}
          required
        >
          <Textarea
            value={formData.expectations}
            onChange={(e) => handleChange('expectations', e.target.value)}
            placeholder="Describe what you hope to achieve and what results you're expecting..."
            rows={4}
            maxLength={EXPECTATIONS_MAX}
            className={errors.expectations ? 'border-red-500' : ''}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">
              {formData.expectations.length} / {EXPECTATIONS_MAX} characters
            </span>
          </div>
        </FormField>

        {/* Timeline Preference */}
        <FormField
          label="When would you like to proceed with treatment?"
          error={errors.timelinePreference}
          required
        >
          <Select
            value={formData.timelinePreference}
            onValueChange={(value) => handleChange('timelinePreference', value as TimelinePreference)}
          >
            <SelectTrigger className={errors.timelinePreference ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your preferred timeline" />
            </SelectTrigger>
            <SelectContent>
              {TIMELINE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
