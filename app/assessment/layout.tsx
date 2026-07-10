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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            Hair Restoration Assessment
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Complete your assessment to receive personalized recommendations
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={state.currentStep} totalSteps={9} />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 mb-6">
          {children}
        </div>

        {/* Save & Continue Later Button (hidden on step 9) */}
        {state.currentStep < 9 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleSaveProgress}
              className="text-sm border-2 hover:border-primary/50"
            >
              💾 Save & Continue Later
            </Button>
          </div>
        )}

        {/* Save Progress Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">Progress Saved!</DialogTitle>
              <DialogDescription className="text-base">
                Your assessment progress has been saved. Use this code to resume later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Resume Code Display */}
              <div className="flex items-center gap-2 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-2 font-medium">Resume Code</p>
                  <p className="text-3xl font-bold text-primary tracking-wider font-mono">
                    {savedCode}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="flex-shrink-0 h-12 px-4"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">ℹ️</span> Important Information
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Save this code in a secure location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You can resume your assessment within 30 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Enter this code on the home page to continue</span>
                  </li>
                </ul>
              </div>

              {/* Close Button */}
              <Button onClick={handleCloseDialog} className="w-full h-12 text-base font-semibold">
                Got it, Thanks!
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
