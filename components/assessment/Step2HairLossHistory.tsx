'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { HairLossHistory, ProgressionRate } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';

interface Step2Props {
  data?: Partial<HairLossHistory>;
  onNext: (data: HairLossHistory) => void;
  onBack: () => void;
}

const affectedAreaOptions = [
  'Hairline',
  'Crown',
  'Temples',
  'Top of head',
  'Sides',
  'Back',
];

export function Step2HairLossHistory({ data, onNext, onBack }: Step2Props) {
  const [formData, setFormData] = useState<Partial<HairLossHistory>>({
    ageWhenStarted: data?.ageWhenStarted || 0,
    familyHistory: data?.familyHistory ?? true,
    progressionRate: data?.progressionRate || 'moderate',
    affectedAreas: data?.affectedAreas || [],
    medicalConditions: data?.medicalConditions || [],
    medications: data?.medications || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMedication, setNewMedication] = useState('');

  const handleInputChange = (field: keyof HairLossHistory, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAreaToggle = (area: string) => {
    const currentAreas = formData.affectedAreas || [];
    if (currentAreas.includes(area)) {
      handleInputChange('affectedAreas', currentAreas.filter((a) => a !== area));
    } else {
      handleInputChange('affectedAreas', [...currentAreas, area]);
    }
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      handleInputChange('medications', [...(formData.medications || []), newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    const updated = [...(formData.medications || [])];
    updated.splice(index, 1);
    handleInputChange('medications', updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ageWhenStarted || formData.ageWhenStarted < 1) {
      newErrors.ageWhenStarted = 'Please enter the age when hair loss started';
    }

    if (!formData.affectedAreas || formData.affectedAreas.length === 0) {
      newErrors.affectedAreas = 'Please select at least one affected area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData as HairLossHistory);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Age When Hair Loss Started */}
        <FormField
          label="At what age did your hair loss begin?"
          htmlFor="ageWhenStarted"
          required
          error={errors.ageWhenStarted}
        >
          <Select
            value={formData.ageWhenStarted?.toString()}
            onValueChange={(value) => handleInputChange('ageWhenStarted', value ? parseInt(value) : 0)}
          >
            <SelectTrigger id="ageWhenStarted">
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Select age</SelectItem>
              {Array.from({ length: 60 }, (_, i) => i + 15).map((age) => (
                <SelectItem key={age} value={age.toString()}>
                  {age} years old
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Family History */}
        <FormField
          label="Do you have a family history of hair loss?"
          htmlFor="familyHistory"
          required
        >
          <RadioGroup
            value={formData.familyHistory ? 'yes' : 'no'}
            onValueChange={(value) => handleInputChange('familyHistory', value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="family-yes" />
              <Label htmlFor="family-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="family-no" />
              <Label htmlFor="family-no">No</Label>
            </div>
          </RadioGroup>
        </FormField>

        {/* Progression Rate */}
        <FormField
          label="How would you describe your hair loss progression?"
          htmlFor="progressionRate"
          required
        >
          <RadioGroup
            value={formData.progressionRate}
            onValueChange={(value) => handleInputChange('progressionRate', value as ProgressionRate)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="slow" id="prog-slow" />
              <Label htmlFor="prog-slow">Slow (gradual over many years)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="prog-moderate" />
              <Label htmlFor="prog-moderate">Moderate (noticeable over a few years)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rapid" id="prog-rapid" />
              <Label htmlFor="prog-rapid">Rapid (significant change in months)</Label>
            </div>
          </RadioGroup>
        </FormField>

        {/* Affected Areas */}
        <FormField
          label="Which areas are affected by hair loss?"
          htmlFor="affectedAreas"
          required
          error={errors.affectedAreas}
          description="Select all that apply"
        >
          <div className="grid grid-cols-2 gap-4">
            {affectedAreaOptions.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={`area-${area}`}
                  checked={formData.affectedAreas?.includes(area)}
                  onCheckedChange={() => handleAreaToggle(area)}
                />
                <Label
                  htmlFor={`area-${area}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </FormField>

        {/* Medications */}
        <FormField
          label="Current Medications (if any)"
          htmlFor="medications"
          description="List any medications you're currently taking"
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                id="medications"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Enter medication name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMedication();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addMedication}
              >
                Add
              </Button>
            </div>
            {formData.medications && formData.medications.length > 0 && (
              <div className="space-y-2">
                {formData.medications.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm">{med}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>
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
