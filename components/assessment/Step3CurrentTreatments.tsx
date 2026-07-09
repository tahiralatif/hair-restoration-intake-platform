'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { CurrentTreatments, TreatmentEffectiveness } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';

interface Step3Props {
  data?: Partial<CurrentTreatments>;
  onNext: (data: CurrentTreatments) => void;
  onBack: () => void;
}

export function Step3CurrentTreatments({ data, onNext, onBack }: Step3Props) {
  const [formData, setFormData] = useState<Partial<CurrentTreatments>>({
    usingMinoxidil: data?.usingMinoxidil ?? false,
    usingFinasteride: data?.usingFinasteride ?? false,
    usingOtherMedications: data?.usingOtherMedications || [],
    duration: data?.duration || '',
    effectiveness: data?.effectiveness || 'somewhat-effective',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newOtherMed, setNewOtherMed] = useState('');

  const handleInputChange = (field: keyof CurrentTreatments, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addOtherMedication = () => {
    if (newOtherMed.trim()) {
      handleInputChange('usingOtherMedications', [...(formData.usingOtherMedications || []), newOtherMed.trim()]);
      setNewOtherMed('');
    }
  };

  const removeOtherMedication = (index: number) => {
    const updated = [...(formData.usingOtherMedications || [])];
    updated.splice(index, 1);
    handleInputChange('usingOtherMedications', updated);
  };

  const isUsingAnyTreatment = formData.usingMinoxidil || formData.usingFinasteride || (formData.usingOtherMedications && formData.usingOtherMedications.length > 0);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isUsingAnyTreatment) {
      if (!formData.duration || formData.duration.trim() === '') {
        newErrors.duration = 'Please specify how long you have been using treatments';
      }
      if (!formData.effectiveness) {
        newErrors.effectiveness = 'Please rate the effectiveness of your treatments';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData as CurrentTreatments);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Treatment Checkboxes */}
        <FormField
          label="Are you currently using any of the following treatments?"
          htmlFor="treatments"
          description="Select all that apply"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="minoxidil"
                checked={formData.usingMinoxidil}
                onCheckedChange={(checked) => handleInputChange('usingMinoxidil', checked)}
              />
              <Label htmlFor="minoxidil" className="text-sm font-normal cursor-pointer">
                Minoxidil (Rogaine)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="finasteride"
                checked={formData.usingFinasteride}
                onCheckedChange={(checked) => handleInputChange('usingFinasteride', checked)}
              />
              <Label htmlFor="finasteride" className="text-sm font-normal cursor-pointer">
                Finasteride (Propecia)
              </Label>
            </div>
          </div>
        </FormField>

        {/* Other Medications */}
        <FormField
          label="Other Hair Loss Treatments"
          htmlFor="otherMedications"
          description="PRP, laser therapy, supplements, etc."
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                id="otherMedications"
                value={newOtherMed}
                onChange={(e) => setNewOtherMed(e.target.value)}
                placeholder="Enter treatment name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOtherMedication();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addOtherMedication}
              >
                Add
              </Button>
            </div>
            {formData.usingOtherMedications && formData.usingOtherMedications.length > 0 && (
              <div className="space-y-2">
                {formData.usingOtherMedications.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm">{med}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOtherMedication(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {/* Conditional Fields - Only show if using any treatment */}
        {isUsingAnyTreatment && (
          <>
            {/* Duration */}
            <FormField
              label="How long have you been using these treatments?"
              htmlFor="duration"
              required
              error={errors.duration}
            >
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 6 months, 2 years"
              />
            </FormField>

            {/* Effectiveness */}
            <FormField
              label="How effective have these treatments been?"
              htmlFor="effectiveness"
              required
              error={errors.effectiveness}
            >
              <Select
                value={formData.effectiveness}
                onValueChange={(value) => handleInputChange('effectiveness', value as TreatmentEffectiveness)}
              >
                <SelectTrigger id="effectiveness">
                  <SelectValue placeholder="Select effectiveness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-effective">Not effective</SelectItem>
                  <SelectItem value="somewhat-effective">Somewhat effective</SelectItem>
                  <SelectItem value="very-effective">Very effective</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}

        {!isUsingAnyTreatment && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              You have indicated that you are not currently using any hair loss treatments.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          Next
        </Button>
      </div>
    </form>
  );
}
