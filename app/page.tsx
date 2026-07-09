'use client';

import { useEffect, useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Load patients from mock data store
    const allPatients = mockDataStore.getAllPatients();
    setPatients(allPatients);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Qualified':
        return 'bg-success text-white';
      case 'Under Review':
        return 'bg-warning text-white';
      case 'Booked':
        return 'bg-purple-600 text-white';
      case 'Rejected':
        return 'bg-danger text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Vellum Hair Restoration
          </h1>
          <p className="text-lg text-muted-foreground">
            Patient Intake Platform Prototype
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sample Patients</CardTitle>
            <CardDescription>
              {patients.length} patients loaded from mock data store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Age {patient.personalInfo.age} • Norwood {patient.norwoodScale} • 
                      AI Score: {patient.aiQualificationScore}%
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {patient.riskIndicators.length > 0 && (
                      <Badge variant="destructive">
                        {patient.riskIndicators.length} Risk{patient.riskIndicators.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Task 1 & Task 2 Complete ✓
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Assessment
            </Button>
            <Button size="lg" variant="outline">
              View All Dashboards
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
