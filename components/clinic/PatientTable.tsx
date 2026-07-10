'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
  const router = useRouter();

  const handleRowClick = (patientId: string) => {
    router.push(`/clinic/patients/${patientId}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Norwood Scale</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              onClick={() => handleRowClick(patient.id)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell className="font-medium">
                {patient.personalInfo.firstName} {patient.personalInfo.lastName}
              </TableCell>
              <TableCell>{patient.personalInfo.age}</TableCell>
              <TableCell>{patient.norwoodScale || 'N/A'}</TableCell>
              <TableCell>
                <span className="font-semibold">{patient.aiQualificationScore}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={patient.status} />
              </TableCell>
              <TableCell>{new Date(patient.submittedAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
