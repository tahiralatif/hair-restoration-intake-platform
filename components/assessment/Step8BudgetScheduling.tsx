'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { BudgetScheduling, BudgetRange, ContactMethod } from '@/lib/types';
import { validateRequired } from '@/lib/validation';

// ============================================================================
// Constants
// ============================================================================

const BUDGET_OPTIONS: Array<{ value: BudgetRange; label: string }> = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-15k', label: '$10,000 - $15,000' },
  { value: 'over-15k', label: 'Over $15,000' },
  { value: 'need-consultation', label: 'Need consultation to determine' },
];

const CONTACT_METHODS: Array<{ value: ContactMethod; label: string }> = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text Message (SMS)' },
];

const AVAILABILITY_OPTIONS = [
  { id: 'weekday-morning', label: 'Weekday Mornings (9 AM - 12 PM)' },
  { id: 'weekday-afternoon', label: 'Weekday Afternoons (12 PM - 5 PM)' },
  { id: 'weekday-evening', label: 'Weekday Evenings (5 PM - 8 PM)' },
  { id: 'weekend-morning', label: 'Weekend Mornings (9 AM - 12 PM)' },
  { id: 'weekend-afternoon', label: 'Weekend Afternoons (12 PM - 5 PM)' },
];

// ============================================================================
// Component
// ============================================================================

export function Step8BudgetScheduling() {
  const { state, actions } = useAssessment();
  const [formData, setFormData] = useState<BudgetScheduling>(
    state.formData.budgetScheduling || {
      budgetRange: 'need-consultation',
      preferredContactMethod: 'email',
      availability: [],
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    if (state.formData.budgetScheduling) {
      setFormData(state.formData.budgetScheduling);
    }
  }, [state.formData.budgetScheduling]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleChange = (field: keyof BudgetScheduling, value: any) => {
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

  const handleAvailabilityToggle = (optionId: string) => {
    const currentAvailability = formData.availability || [];
    const updatedAvailability = currentAvailability.includes(optionId)
      ? currentAvailability.filter((id) => id !== optionId)
      : [...currentAvailability, optionId];
    
    handleChange('availability', updatedAvailability);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate budget range
    const budgetValidation = validateRequired(formData.budgetRange, 'Budget range');
    if (!budgetValidation.isValid && budgetValidation.error) {
      newErrors.budgetRange = budgetValidation.error;
    }

    // Validate contact method
    const contactValidation = validateRequired(formData.preferredContactMethod, 'Preferred contact method');
    if (!contactValidation.isValid && contactValidation.error) {
      newErrors.preferredContactMethod = contactValidation.error;
    }

    // Validate availability
    if (!formData.availability || formData.availability.length === 0) {
      newErrors.availability = 'Please select at least one availability option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      actions.updateStep(8, { budgetScheduling: formData });
      actions.nextStep();
    }
  };

  const handleBack = () => {
    actions.updateStep(8, { budgetScheduling: formData });
    actions.previousStep();
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Budget & Scheduling</h2>
        <p className="mt-2 text-sm text-gray-600">
          Help us understand your budget and scheduling preferences so we can provide the best recommendations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Budget Range */}
        <FormField
          label="What is your budget range for hair restoration treatment?"
          error={errors.budgetRange}
          required
        >
          <Select
            value={formData.budgetRange}
            onValueChange={(value) => handleChange('budgetRange', value as BudgetRange)}
          >
            <SelectTrigger className={errors.budgetRange ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Preferred Contact Method */}
        <FormField
          label="How would you prefer to be contacted?"
          error={errors.preferredContactMethod}
          required
        >
          <RadioGroup
            value={formData.preferredContactMethod}
            onValueChange={(value) => handleChange('preferredContactMethod', value as ContactMethod)}
            className="space-y-3"
          >
            {CONTACT_METHODS.map((method) => (
              <div key={method.value} className="flex items-center space-x-2">
                <RadioGroupItem value={method.value} id={method.value} />
                <Label htmlFor={method.value} className="font-normal cursor-pointer">
                  {method.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormField>

        {/* Availability */}
        <FormField
          label="When are you typically available for appointments?"
          error={errors.availability}
          required
          hint="Select all that apply"
        >
          <div className="space-y-3">
            {AVAILABILITY_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={formData.availability?.includes(option.id)}
                  onCheckedChange={() => handleAvailabilityToggle(option.id)}
                />
                <label
                  htmlFor={option.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
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
