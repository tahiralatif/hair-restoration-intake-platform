'use client';

import React, { useState } from 'react';
import { AssessmentProvider, useAssessment } from '@/lib/contexts/AssessmentContext';
import { StepIndicator } from '@/components/assessment/StepIndicator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Check } from 'lucide-react';

// ============================================================================
// Layout Content Component (needs to be inside AssessmentProvider)
// ============================================================================

function AssessmentLayoutContent({ children }: { children: React.ReactNode }) {
  const { state, actions } = useAssessment();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedCode, setSavedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSaveProgress = () => {
    const code = actions.saveProgress();
    setSavedCode(code);
    setShowSaveDialog(true);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(savedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCloseDialog = () => {
    setShowSaveDialog(false);
    setCopied(false);
  };

  // Don't show layout for complete page
  const isCompletePage = typeof window !== 'undefined' && window.location.pathname.includes('/complete');

  if (isCompletePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Hair Restoration Assessment
          </h1>
          <p className="text-gray-600">
            Complete your assessment to receive personalized recommendations
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={state.currentStep} totalSteps={9} />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6">
          {children}
        </div>

        {/* Save & Continue Later Button (hidden on step 9) */}
        {state.currentStep < 9 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleSaveProgress}
              className="text-sm"
            >
              Save & Continue Later
            </Button>
          </div>
        )}

        {/* Save Progress Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Progress Saved!</DialogTitle>
              <DialogDescription>
                Your assessment progress has been saved. Use this code to resume later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Resume Code Display */}
              <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Resume Code</p>
                  <p className="text-2xl font-bold text-primary tracking-wider">
                    {savedCode}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Important:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Save this code in a secure location</li>
                  <li>You can resume your assessment within 30 days</li>
                  <li>Enter this code on the home page to continue</li>
                </ul>
              </div>

              {/* Close Button */}
              <Button onClick={handleCloseDialog} className="w-full">
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// ============================================================================
// Main Layout Component
// ============================================================================

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AssessmentProvider>
      <AssessmentLayoutContent>{children}</AssessmentLayoutContent>
    </AssessmentProvider>
  );
}
