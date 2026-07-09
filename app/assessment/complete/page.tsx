'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Mail, MessageSquare, Home } from 'lucide-react';

// ============================================================================
// Component Content
// ============================================================================

function AssessmentCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setPatientId(id);
      // Generate a mock confirmation number based on ID
      setConfirmationNumber(`HRP-${Date.now().toString().slice(-8)}`);
    } else {
      // If no ID, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  if (!patientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for completing your hair restoration assessment.
          </p>
        </div>

        {/* Confirmation Number */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Your Confirmation Number</p>
              <p className="text-2xl font-bold text-primary">{confirmationNumber}</p>
              <p className="text-xs text-gray-500 mt-2">
                Please save this number for your records
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Review by Our Medical Team</h3>
                  <p className="text-sm text-gray-600">
                    Our experienced doctors will carefully review your assessment and photos within 24-48 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receive Your Qualification Score</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive your AI qualification score and personalized recommendations via email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Schedule Your Consultation</h3>
                  <p className="text-sm text-gray-600">
                    If you're qualified, you'll be able to schedule an in-person or virtual consultation with our specialists.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Messages */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Email Confirmation</h3>
                  <p className="text-sm text-blue-700">
                    A confirmation email has been sent to your registered email address with your assessment details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">SMS Notification</h3>
                  <p className="text-sm text-green-700">
                    You'll receive a text message when your assessment has been reviewed by our medical team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push(`/dashboard/patient/${patientId}`)}
            size="lg"
            className="w-full sm:w-auto"
          >
            View Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Have questions? Contact us at{' '}
            <a href="mailto:support@hairrestoration.com" className="text-primary hover:underline">
              support@hairrestoration.com
            </a>{' '}
            or call{' '}
            <a href="tel:1-800-HAIR-123" className="text-primary hover:underline">
              1-800-HAIR-123
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Page Component
// ============================================================================

export default function AssessmentCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <AssessmentCompleteContent />
    </Suspense>
  );
}
