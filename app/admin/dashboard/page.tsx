'use client';

import React, { useEffect, useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import { Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { TrendingUp, Users, UserCheck, Calendar } from 'lucide-react';

export default function AdminDashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    booked: 0,
    conversionRate: 0,
    bookingRate: 0,
    avgScore: 0,
  });

  useEffect(() => {
    const allPatients = mockDataStore.getAllPatients();
    setPatients(allPatients);

    const qualified = allPatients.filter((p) => p.status === 'Qualified').length;
    const booked = allPatients.filter((p) => p.status === 'Booked').length;
    const avgScore = allPatients.reduce((sum, p) => sum + p.aiQualificationScore, 0) / allPatients.length || 0;

    setStats({
      total: allPatients.length,
      qualified,
      booked,
      conversionRate: allPatients.length > 0 ? (qualified / allPatients.length) * 100 : 0,
      bookingRate: qualified > 0 ? (booked / qualified) * 100 : 0,
      avgScore: Math.round(avgScore),
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Analytics and system overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Applications" value={stats.total} icon={Users} />
          <StatCard title="Qualified" value={stats.qualified} icon={UserCheck} />
          <StatCard title="Conversion Rate" value={`${stats.conversionRate.toFixed(1)}%`} icon={TrendingUp} />
          <StatCard title="Booking Rate" value={`${stats.bookingRate.toFixed(1)}%`} icon={Calendar} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Average AI Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.avgScore}</div>
              <p className="text-sm text-gray-600 mt-2">Across all submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex justify-between items-center text-sm">
                    <span>{patient.personalInfo.firstName} {patient.personalInfo.lastName}</span>
                    <span className="text-gray-600">{patient.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
