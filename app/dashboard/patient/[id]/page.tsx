'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDataStore } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { AIScoreDisplay } from '@/components/dashboard/AIScoreDisplay';
import { RiskIndicatorBadge } from '@/components/dashboard/RiskIndicatorBadge';
import { Calendar, MessageSquare, Phone, Mail } from 'lucide-react';
import { calculateAIScore } from '@/lib/aiScore';
import { ChatbotButton } from '@/components/chat/ChatbotButton';

export default function PatientDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const p = mockDataStore.getPatient(id);
    if (p) {
      const score = calculateAIScore(p);
      setPatient({ ...p, aiQualificationScore: score.totalScore });
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  if (!patient) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  const scoreBreakdown = calculateAIScore(patient);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Track your assessment and consultation status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Submitted</span>
                  <span className="text-sm font-medium">{new Date(patient.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confirmation Number</span>
                  <span className="text-sm font-mono font-medium">HRP-{patient.id.slice(-8)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.timeline.slice(0, 5).map((event, idx) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {patient.status === 'Qualified' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-green-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 mb-2">Ready to Schedule</h3>
                      <p className="text-sm text-green-800 mb-4">You're qualified for a consultation! Schedule your appointment with our specialists.</p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Consultation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <AIScoreDisplay scoreBreakdown={scoreBreakdown} />

            {patient.riskIndicators && patient.riskIndicators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Risk Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patient.riskIndicators.map((risk) => (
                      <RiskIndicatorBadge key={risk.id} risk={risk} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No new messages</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  1-800-HAIR-123
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  support@hairrestoration.com
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Patient AI Chatbot */}
      <ChatbotButton type="patient" patientId={patient.id} />
    </div>
  );
}
