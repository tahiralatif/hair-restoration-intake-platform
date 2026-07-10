'use client';

import React, { useState } from 'react';
import { PatientStatus } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/dashboard/StatusBadge';

interface StatusManagerProps {
  currentStatus: PatientStatus;
  onStatusChange: (status: PatientStatus, reason?: string) => void;
}

export function StatusManager({ currentStatus, onStatusChange }: StatusManagerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus>(currentStatus);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleStatusSelect = (status: PatientStatus) => {
    setSelectedStatus(status);
    setShowDialog(true);
  };

  const handleConfirm = () => {
    onStatusChange(selectedStatus, selectedStatus === 'Rejected' ? rejectionReason : undefined);
    setShowDialog(false);
    setRejectionReason('');
  };

  return (
    <>
      <Select value={currentStatus} onValueChange={(value) => handleStatusSelect(value as PatientStatus)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            <StatusBadge status={currentStatus} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Submitted">Submitted</SelectItem>
          <SelectItem value="Under Review">Under Review</SelectItem>
          <SelectItem value="Qualified">Qualified</SelectItem>
          <SelectItem value="Booked">Booked</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Change patient status from <strong>{currentStatus}</strong> to <strong>{selectedStatus}</strong>?
            </DialogDescription>
          </DialogHeader>

          {selectedStatus === 'Rejected' && (
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">Rejection Reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
