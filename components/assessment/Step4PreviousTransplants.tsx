'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PreviousTransplants, TransplantMethod, SatisfactionLevel } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';

interface Step4Props {
  data?: Partial<PreviousTransplants>;
  onNext: (data: PreviousTransplants) => void;
  onBack: () => void;
}

export function Step4PreviousTransplants({ data, onNext, onBack }: Step4Props) {
  const [formData, setFormData] = useState<Partial<PreviousTransplants>>({
    hadPreviousTransplant: data?.hadPreviousTransplant ?? false,
    transplantDate: data?.transplantDate || '',
    transplantMethod: data?.transplantMethod || 'FUE',
    graftsTransplanted: data?.graftsTransplanted || 0,
    satisfaction: data?.satisfaction || 'neutral',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PreviousTransplants, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.hadPreviousTransplant) {
      if (!formData.transplantDate || formData.transplantDate.trim() === '') {
        newErrors.transplantDate = 'Please specify when the transplant was performed';
      }

      if (!formData.transplantMethod) {
        newErrors.transplantMethod = 'Please select the transplant method';
      }

      if (!formData.graftsTransplanted || formData.graftsTransplanted <= 0) {
        newErrors.graftsTransplanted = 'Please enter the number of grafts transplanted';
      }

      if (!formData.satisfaction) {
        newErrors.satisfaction = 'Please rate your satisfaction';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData as PreviousTransplants);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Had Previous Transplant */}
        <FormField
          label="Have you had a hair transplant before?"
          htmlFor="hadPreviousTransplant"
          required
        >
          <RadioGroup
            value={formData.hadPreviousTransplant ? 'yes' : 'no'}
            onValueChange={(value) => handleInputChange('hadPreviousTransplant', value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="transplant-yes" />
              <Label htmlFor="transplant-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="transplant-no" />
              <Label htmlFor="transplant-no">No</Label>
            </div>
          </RadioGroup>
        </FormField>

        {/* Conditional Fields - Only show if had previous transplant */}
        {formData.hadPreviousTransplant && (
          <div className="space-y-6 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold">Previous Transplant Details</h3>

            {/* Transplant Date */}
            <FormField
              label="When was the transplant performed?"
              htmlFor="transplantDate"
              required
              error={errors.transplantDate}
            >
              <Input
                id="transplantDate"
                value={formData.transplantDate}
                onChange={(e) => handleInputChange('transplantDate', e.target.value)}
                placeholder="e.g., January 2020, 2 years ago"
              />
            </FormField>

            {/* Transplant Method */}
            <FormField
              label="Which transplant method was used?"
              htmlFor="transplantMethod"
              required
              error={errors.transplantMethod}
            >
              <Select
                value={formData.transplantMethod}
                onValueChange={(value) => handleInputChange('transplantMethod', value as TransplantMethod)}
              >
                <SelectTrigger id="transplantMethod">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FUE">FUE (Follicular Unit Extraction)</SelectItem>
                  <SelectItem value="FUT">FUT (Follicular Unit Transplantation)</SelectItem>
                  <SelectItem value="other">Other / Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            {/* Number of Grafts */}
            <FormField
              label="Approximately how many grafts were transplanted?"
              htmlFor="graftsTransplanted"
              required
              error={errors.graftsTransplanted}
            >
              <Input
                id="graftsTransplanted"
                type="number"
                min="0"
                value={formData.graftsTransplanted || ''}
                onChange={(e) => handleInputChange('graftsTransplanted', parseInt(e.target.value) || 0)}
                placeholder="e.g., 2000"
              />
            </FormField>

            {/* Satisfaction Level */}
            <FormField
              label="How satisfied were you with the results?"
              htmlFor="satisfaction"
              required
              error={errors.satisfaction}
            >
              <Select
                value={formData.satisfaction}
                onValueChange={(value) => handleInputChange('satisfaction', value as SatisfactionLevel)}
              >
                <SelectTrigger id="satisfaction">
                  <SelectValue placeholder="Select satisfaction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsatisfied">Unsatisfied</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="satisfied">Satisfied</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        )}

        {!formData.hadPreviousTransplant && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              You have indicated that you have not had a previous hair transplant.
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
