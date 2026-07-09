'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { Button } from '@/components/ui/button';
import { PersonalInfo, Gender } from '@/lib/types';
import { validateEmail, validatePhone, validateRequired, validateAge } from '@/lib/validation';
import { useAssessment } from '@/lib/contexts/AssessmentContext';

export function Step1PersonalInfo() {
  const { state, actions } = useAssessment();
  const [formData, setFormData] = useState<Partial<PersonalInfo>>({
    firstName: state.formData.personalInfo?.firstName || '',
    lastName: state.formData.personalInfo?.lastName || '',
    email: state.formData.personalInfo?.email || '',
    phone: state.formData.personalInfo?.phone || '',
    dateOfBirth: state.formData.personalInfo?.dateOfBirth || '',
    age: state.formData.personalInfo?.age || 0,
    gender: state.formData.personalInfo?.gender || 'male',
    address: state.formData.personalInfo?.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculate age from date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const ageValidation = validateAge(formData.dateOfBirth);
      if (ageValidation.isValid && ageValidation.age) {
        setFormData((prev) => ({ ...prev, age: ageValidation.age }));
      }
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (field: keyof PersonalInfo, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: keyof PersonalInfo['address'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate first name
    const firstNameValidation = validateRequired(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error!;
    }

    // Validate last name
    const lastNameValidation = validateRequired(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error!;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email || '');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    // Validate phone
    const phoneValidation = validatePhone(formData.phone || '');
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error!;
    }

    // Validate date of birth
    const dobValidation = validateAge(formData.dateOfBirth || '');
    if (!dobValidation.isValid) {
      newErrors.dateOfBirth = dobValidation.error!;
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Validate address fields
    if (!formData.address?.street || formData.address.street.trim() === '') {
      newErrors.street = 'Street address is required';
    }
    if (!formData.address?.city || formData.address.city.trim() === '') {
      newErrors.city = 'City is required';
    }
    if (!formData.address?.state || formData.address.state.trim() === '') {
      newErrors.state = 'State is required';
    }
    if (!formData.address?.zipCode || formData.address.zipCode.trim() === '') {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      actions.updateStep(1, { personalInfo: formData as PersonalInfo });
      actions.nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <FormField
          label="First Name"
          htmlFor="firstName"
          required
          error={errors.firstName}
        >
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
          />
        </FormField>

        {/* Last Name */}
        <FormField
          label="Last Name"
          htmlFor="lastName"
          required
          error={errors.lastName}
        >
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
          />
        </FormField>

        {/* Email */}
        <FormField
          label="Email Address"
          htmlFor="email"
          required
          error={errors.email}
        >
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john.doe@example.com"
          />
        </FormField>

        {/* Phone */}
        <FormField
          label="Phone Number"
          htmlFor="phone"
          required
          error={errors.phone}
        >
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </FormField>

        {/* Date of Birth */}
        <FormField
          label="Date of Birth"
          htmlFor="dateOfBirth"
          required
          error={errors.dateOfBirth}
          description={formData.age && formData.age > 0 ? `Age: ${formData.age} years` : undefined}
        >
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </FormField>

        {/* Gender */}
        <FormField
          label="Gender"
          htmlFor="gender"
          required
          error={errors.gender}
        >
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value as Gender)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address</h3>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            label="Street Address"
            htmlFor="street"
            required
            error={errors.street}
          >
            <Input
              id="street"
              value={formData.address?.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="123 Main St"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="City"
              htmlFor="city"
              required
              error={errors.city}
            >
              <Input
                id="city"
                value={formData.address?.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="New York"
              />
            </FormField>

            <FormField
              label="State"
              htmlFor="state"
              required
              error={errors.state}
            >
              <Input
                id="state"
                value={formData.address?.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                placeholder="NY"
              />
            </FormField>

            <FormField
              label="ZIP Code"
              htmlFor="zipCode"
              required
              error={errors.zipCode}
            >
              <Input
                id="zipCode"
                value={formData.address?.zipCode}
                onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                placeholder="10001"
              />
            </FormField>
          </div>

          <FormField
            label="Country"
            htmlFor="country"
            required
          >
            <Input
              id="country"
              value={formData.address?.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="United States"
            />
          </FormField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button type="submit" size="lg" className="min-w-32">
          Next
        </Button>
      </div>
    </form>
  );
}
