'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Patient, SavedAssessment } from '@/lib/types';
import { mockDataStore } from '@/lib/mockData';

// ============================================================================
// Types
// ============================================================================

interface AssessmentState {
  currentStep: number;
  formData: Partial<Patient>;
  resumeCode?: string;
  isComplete: boolean;
}

interface AssessmentActions {
  updateStep: (step: number, data: Partial<Patient>) => void;
  nextStep: () => void;
  previousStep: () => void;
  saveProgress: () => string;
  loadProgress: (resumeCode: string) => boolean;
  submitAssessment: () => Promise<string>;
  setCurrentStep: (step: number) => void;
  resetAssessment: () => void;
}

interface AssessmentContextValue {
  state: AssessmentState;
  actions: AssessmentActions;
}

// ============================================================================
// Context
// ============================================================================

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

// ============================================================================
// Constants
// ============================================================================

const TOTAL_STEPS = 9;
const STORAGE_KEY_PREFIX = 'hair-restoration-assessment-';
const EXPIRATION_DAYS = 30;

// ============================================================================
// Helper Functions
// ============================================================================

function generateResumeCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isResumeCodeValid(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

function getExpirationDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + EXPIRATION_DAYS);
  return date;
}

function isExpired(expirationDate: Date): boolean {
  return new Date() > new Date(expirationDate);
}

// ============================================================================
// Provider Component
// ============================================================================

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AssessmentState>({
    currentStep: 1,
    formData: {},
    isComplete: false,
  });

  // Load any existing draft on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for a draft with no resume code (in-progress session)
    const draftKey = `${STORAGE_KEY_PREFIX}draft`;
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (!isExpired(draft.expiresAt)) {
          setState({
            currentStep: draft.currentStep || 1,
            formData: draft.formData || {},
            isComplete: false,
          });
        } else {
          localStorage.removeItem(draftKey);
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, []);

  // Save draft automatically when formData changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (Object.keys(state.formData).length === 0) return;

    const draftKey = `${STORAGE_KEY_PREFIX}draft`;
    try {
      const draft = {
        currentStep: state.currentStep,
        formData: state.formData,
        savedAt: new Date().toISOString(),
        expiresAt: getExpirationDate().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [state.formData, state.currentStep]);

  // ============================================================================
  // Actions
  // ============================================================================

  const updateStep = useCallback((step: number, data: Partial<Patient>) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...data,
      },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep < TOTAL_STEPS) {
        return {
          ...prev,
          currentStep: prev.currentStep + 1,
        };
      }
      return prev;
    });
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep > 1) {
        return {
          ...prev,
          currentStep: prev.currentStep - 1,
        };
      }
      return prev;
    });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setState((prev) => ({
        ...prev,
        currentStep: step,
      }));
    }
  }, []);

  const saveProgress = useCallback((): string => {
    if (typeof window === 'undefined') {
      return '';
    }

    const resumeCode = generateResumeCode();
    const savedAssessment: SavedAssessment = {
      resumeCode,
      formData: state.formData,
      currentStep: state.currentStep,
      savedAt: new Date(),
      expiresAt: getExpirationDate(),
    };

    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${resumeCode}`;
      
      // Convert dates to ISO strings for storage
      const serialized = {
        ...savedAssessment,
        savedAt: savedAssessment.savedAt.toISOString(),
        expiresAt: savedAssessment.expiresAt.toISOString(),
      };
      
      localStorage.setItem(storageKey, JSON.stringify(serialized));
      
      setState((prev) => ({
        ...prev,
        resumeCode,
      }));

      return resumeCode;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return '';
    }
  }, [state.formData, state.currentStep]);

  const loadProgress = useCallback((resumeCode: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }

    if (!isResumeCodeValid(resumeCode)) {
      return false;
    }

    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${resumeCode}`;
      const saved = localStorage.getItem(storageKey);

      if (!saved) {
        return false;
      }

      const parsed = JSON.parse(saved);
      const savedAssessment: SavedAssessment = {
        ...parsed,
        savedAt: new Date(parsed.savedAt),
        expiresAt: new Date(parsed.expiresAt),
      };

      if (isExpired(savedAssessment.expiresAt)) {
        localStorage.removeItem(storageKey);
        return false;
      }

      setState({
        currentStep: savedAssessment.currentStep,
        formData: savedAssessment.formData,
        resumeCode: savedAssessment.resumeCode,
        isComplete: false,
      });

      return true;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return false;
    }
  }, []);

  const submitAssessment = useCallback(async (): Promise<string> => {
    try {
      // Create patient with current form data
      const patientData: Omit<Patient, 'id'> = {
        personalInfo: state.formData.personalInfo!,
        hairLossHistory: state.formData.hairLossHistory!,
        currentTreatments: state.formData.currentTreatments!,
        previousTransplants: state.formData.previousTransplants!,
        norwoodScale: state.formData.norwoodScale,
        photos: state.formData.photos || {},
        desiredOutcome: state.formData.desiredOutcome!,
        budgetScheduling: state.formData.budgetScheduling!,
        status: 'Submitted',
        aiQualificationScore: 0, // Will be calculated
        riskIndicators: [],
        submittedAt: new Date(),
        updatedAt: new Date(),
        timeline: [
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'submission',
            description: 'Assessment submitted',
            timestamp: new Date(),
          },
        ],
        staffNotes: [],
        doctorNotes: [],
        appointments: [],
        messages: [],
      };

      const patient = mockDataStore.createPatient(patientData);

      // Mark assessment as complete
      setState((prev) => ({
        ...prev,
        isComplete: true,
      }));

      // Clear saved draft
      if (typeof window !== 'undefined') {
        const draftKey = `${STORAGE_KEY_PREFIX}draft`;
        localStorage.removeItem(draftKey);
        
        // Clear resume code saved assessment if exists
        if (state.resumeCode) {
          const storageKey = `${STORAGE_KEY_PREFIX}${state.resumeCode}`;
          localStorage.removeItem(storageKey);
        }
      }

      return patient.id;
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      throw error;
    }
  }, [state.formData, state.resumeCode]);

  const resetAssessment = useCallback(() => {
    setState({
      currentStep: 1,
      formData: {},
      isComplete: false,
    });

    if (typeof window !== 'undefined') {
      const draftKey = `${STORAGE_KEY_PREFIX}draft`;
      localStorage.removeItem(draftKey);
    }
  }, []);

  const contextValue: AssessmentContextValue = {
    state,
    actions: {
      updateStep,
      nextStep,
      previousStep,
      saveProgress,
      loadProgress,
      submitAssessment,
      setCurrentStep,
      resetAssessment,
    },
  };

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAssessment() {
  const context = useContext(AssessmentContext);
  
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  
  return context;
}

// ============================================================================
// Exports
// ============================================================================

export type { AssessmentState, AssessmentActions, AssessmentContextValue };
export { generateResumeCode, isResumeCodeValid, isExpired, TOTAL_STEPS };
