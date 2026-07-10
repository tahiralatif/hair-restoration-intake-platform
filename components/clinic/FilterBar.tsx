'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatientStatus, NorwoodScale } from '@/lib/types';
import { X } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
  resultCount: number;
  totalCount: number;
}

export function FilterBar({ onFilterChange, resultCount, totalCount }: FilterBarProps) {
  const [statusFilter, setStatusFilter] = React.useState<PatientStatus | 'all'>('all');
  const [norwoodFilter, setNorwoodFilter] = React.useState<string>('all');

  const handleStatusChange = (value: string | null) => {
    const newValue = (value === 'all' || value === null) ? 'all' : value as PatientStatus;
    setStatusFilter(newValue);
    onFilterChange({ status: newValue === 'all' ? null : newValue });
  };

  const handleNorwoodChange = (value: string | null) => {
    const newValue = value || 'all';
    setNorwoodFilter(newValue);
    onFilterChange({ norwood: newValue === 'all' ? null : newValue });
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setNorwoodFilter('all');
    onFilterChange({});
  };

  const hasFilters = statusFilter !== 'all' || norwoodFilter !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Booked">Booked</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Norwood Scale</label>
        <Select value={norwoodFilter} onValueChange={handleNorwoodChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="1">Stage 1</SelectItem>
            <SelectItem value="2">Stage 2</SelectItem>
            <SelectItem value="3">Stage 3</SelectItem>
            <SelectItem value="4">Stage 4</SelectItem>
            <SelectItem value="5">Stage 5</SelectItem>
            <SelectItem value="6">Stage 6</SelectItem>
            <SelectItem value="7">Stage 7</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        {hasFilters && (
          <Button variant="outline" onClick={handleClearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{resultCount}</span> of <span className="font-semibold">{totalCount}</span> patients
        </div>
      </div>
    </div>
  );
}
