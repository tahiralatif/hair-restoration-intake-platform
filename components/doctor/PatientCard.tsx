'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { RiskIndicatorBadge } from '@/components/dashboard/RiskIndicatorBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/clinic/patients/${patient.id}`)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {patient.personalInfo.firstName[0]}{patient.personalInfo.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {patient.personalInfo.firstName} {patient.personalInfo.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {patient.personalInfo.age} years • Norwood {patient.norwoodScale || 'N/A'}
                </p>
              </div>
              <StatusBadge status={patient.status} />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-3 py-1 bg-primary/10 rounded">
                <div className="text-2xl font-bold text-primary">{patient.aiQualificationScore}</div>
                <div className="text-xs text-gray-600">AI Score</div>
              </div>
              {patient.riskIndicators && patient.riskIndicators.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {patient.riskIndicators.slice(0, 2).map((risk) => (
                    <RiskIndicatorBadge key={risk.id} risk={risk} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
