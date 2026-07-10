'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockDataStore } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AIScoreDisplay } from '@/components/dashboard/AIScoreDisplay';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { PhotoGallery } from '@/components/patient/PhotoGallery';
import { MedicalTimeline } from '@/components/patient/MedicalTimeline';
import { NotesSection } from '@/components/patient/NotesSection';
import { SendMessage } from '@/components/patient/SendMessage';
import { calculateAIScore } from '@/lib/aiScore';
import { FileText, MessageSquare, Printer } from 'lucide-react';

export default function PatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const p = mockDataStore.getPatient(id);
    if (p) setPatient(p);
  }, [params.id]);

  if (!patient) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  const scoreBreakdown = calculateAIScore(patient);

  const handlePrint = () => {
    window.print();
  };

  const handleAddNote = (content: string, type: 'staff' | 'doctor') => {
    console.log('Add note:', content, type);
  };

  const handleSendMessage = (message: string) => {
    console.log('Send message:', message);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.personalInfo.firstName} {patient.personalInfo.lastName}
            </h1>
            <p className="text-gray-600">{patient.personalInfo.age} years old • {patient.personalInfo.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowMessageDialog(true)}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Send Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Phone:</span> {patient.personalInfo.phone}</div>
                      <div><span className="text-gray-600">Gender:</span> {patient.personalInfo.gender}</div>
                      <div><span className="text-gray-600">DOB:</span> {patient.personalInfo.dateOfBirth}</div>
                      <div><span className="text-gray-600">Status:</span> <StatusBadge status={patient.status} /></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hair Loss History</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><span className="text-gray-600">Started at age:</span> {patient.hairLossHistory.ageWhenStarted}</p>
                    <p><span className="text-gray-600">Progression:</span> {patient.hairLossHistory.progressionRate}</p>
                    <p><span className="text-gray-600">Norwood Scale:</span> {patient.norwoodScale || 'N/A'}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PhotoGallery photos={patient.photos} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MedicalTimeline events={patient.timeline} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Staff Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NotesSection
                        notes={patient.staffNotes}
                        onAddNote={(content) => handleAddNote(content, 'staff')}
                        title=""
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Doctor Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NotesSection
                        notes={patient.doctorNotes}
                        onAddNote={(content) => handleAddNote(content, 'doctor')}
                        title=""
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <AIScoreDisplay scoreBreakdown={scoreBreakdown} />
          </div>
        </div>

        <SendMessage
          open={showMessageDialog}
          onClose={() => setShowMessageDialog(false)}
          onSend={handleSendMessage}
          patientName={`${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`}
        />
      </div>
    </div>
  );
}
