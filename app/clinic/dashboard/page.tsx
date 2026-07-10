'use client';

import React, { useEffect, useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { PatientTable } from '@/components/clinic/PatientTable';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users, UserCheck, Clock, Calendar } from 'lucide-react';

export default function ClinicDashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    pending: 0,
    booked: 0,
  });

  useEffect(() => {
    const allPatients = mockDataStore.getAllPatients();
    setPatients(allPatients);

    setStats({
      total: allPatients.length,
      qualified: allPatients.filter((p) => p.status === 'Qualified').length,
      pending: allPatients.filter((p) => p.status === 'Under Review').length,
      booked: allPatients.filter((p) => p.status === 'Booked').length,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clinic Dashboard</h1>
          <p className="text-gray-600">Manage patient applications and assessments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Qualified"
            value={stats.qualified}
            icon={UserCheck}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
          />
          <StatCard
            title="Booked"
            value={stats.booked}
            icon={Calendar}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Patient Applications</h2>
          </div>
          <div className="p-6">
            <PatientTable patients={patients} />
          </div>
        </div>
      </div>
    </div>
  );
}
