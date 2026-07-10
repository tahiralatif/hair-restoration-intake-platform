'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { FileText, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { actions } = useAssessment();
  const [resumeCode, setResumeCode] = useState('');
  const [error, setError] = useState('');

  const handleStartNew = () => {
    actions.resetAssessment();
    router.push('/assessment/1');
  };

  const handleResume = () => {
    if (!resumeCode.trim()) {
      setError('Please enter a resume code');
      return;
    }

    const success = actions.loadProgress(resumeCode.trim().toUpperCase());
    if (success) {
      router.push('/assessment/1');
    } else {
      setError('Invalid or expired resume code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Hair Restoration Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Get personalized recommendations from our expert team
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Start New Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Complete our comprehensive 9-step assessment to receive your AI qualification score and personalized treatment plan.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Takes 10-15 minutes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Save and resume anytime
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Get results within 24-48 hours
                </li>
              </ul>
              <Button onClick={handleStartNew} className="w-full" size="lg">
                Start Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Resume Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Already started an assessment? Enter your resume code to continue where you left off.
              </p>
              <FormField
                label="Resume Code"
                error={error}
              >
                <Input
                  value={resumeCode}
                  onChange={(e) => {
                    setResumeCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="Enter 8-character code"
                  maxLength={8}
                  className="uppercase font-mono"
                />
              </FormField>
              <Button onClick={handleResume} variant="outline" className="w-full" size="lg">
                Resume Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Analysis</h3>
              <p className="text-sm text-gray-600">AI-powered assessment reviewed by experienced doctors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Personalized Plan</h3>
              <p className="text-sm text-gray-600">Customized treatment recommendations based on your profile</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Results</h3>
              <p className="text-sm text-gray-600">Receive your qualification score within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
