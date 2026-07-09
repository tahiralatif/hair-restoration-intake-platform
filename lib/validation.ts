// Form Validation Utilities

import { ValidationError } from './types';

// ============================================================================
// Email Validation
// ============================================================================

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  // Standard email regex pattern
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

// ============================================================================
// Phone Number Validation
// ============================================================================

export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Allow digits, spaces, hyphens, parentheses, and plus sign
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Phone number can only contain digits, spaces, hyphens, parentheses, and plus sign' };
  }

  // Remove all non-digit characters to check length
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must have at least 10 digits' };
  }

  return { isValid: true };
}

// ============================================================================
// Required Field Validation
// ============================================================================

export function validateRequired(value: any, fieldName: string): { isValid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

// ============================================================================
// File Size Validation
// ============================================================================

export function validateFileSize(file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
    };
  }

  return { isValid: true };
}

// ============================================================================
// File Type Validation
// ============================================================================

export function validateFileType(file: File, allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']): { isValid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type must be one of: ${allowedTypes.map(t => t.replace('image/', '')).join(', ')}` 
    };
  }

  return { isValid: true };
}

// ============================================================================
// Age Validation
// ============================================================================

export function validateAge(dateOfBirth: string, minAge: number = 18): { isValid: boolean; error?: string; age?: number } {
  if (!dateOfBirth || dateOfBirth.trim() === '') {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  if (isNaN(dob.getTime())) {
    return { isValid: false, error: 'Invalid date of birth' };
  }

  if (dob > today) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { isValid: false, error: `You must be at least ${minAge} years old`, age };
  }

  return { isValid: true, age };
}

// ============================================================================
// Error Message Formatter
// ============================================================================

export function formatErrorMessage(field: string, error: string): string {
  return `${field}: ${error}`;
}

export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;
  
  return `Please fix the following errors:\n${errors.map(e => `• ${e.message}`).join('\n')}`;
}

// ============================================================================
// Batch Validation
// ============================================================================

export function validateMultipleFields(validations: { field: string; validation: () => { isValid: boolean; error?: string } }[]): ValidationError[] {
  const errors: ValidationError[] = [];

  validations.forEach(({ field, validation }) => {
    const result = validation();
    if (!result.isValid && result.error) {
      errors.push({ field, message: result.error });
    }
  });

  return errors;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidZipCode(zipCode: string, country: string = 'US'): boolean {
  if (country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  }
  // Add more countries as needed
  return zipCode.length > 0;
}
