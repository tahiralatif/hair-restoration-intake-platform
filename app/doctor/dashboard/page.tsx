'use client';

import React, { useEffect, useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { PatientCard } from '@/components/doctor/PatientCard';
import { calculateAIScore } from '@/lib/aiScore';
import { ChatbotButton } from '@/components/chat/ChatbotButton';

export default function DoctorDashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const allPatients = mockDataStore.getAllPatients();
    const sorted = allPatients.sort((a, b) => b.aiQualificationScore - a.aiQualificationScore);
    setPatients(sorted);
  }, []);

  const underReview = patients.filter((p) => p.status === 'Under Review');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Review and manage assigned patient cases</p>
          {underReview.length > 0 && (
            <div className="mt-2 text-sm text-orange-600 font-medium">
              {underReview.length} patient{underReview.length !== 1 ? 's' : ''} needing review
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>

        {patients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No patients assigned yet</p>
          </div>
        )}
      </div>

      {/* Doctor AI Assistant */}
      <ChatbotButton type="doctor" />
    </div>
  );
}
