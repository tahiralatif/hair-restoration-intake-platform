import { Badge } from '@/components/ui/badge';
import { PatientStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: PatientStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-gray-500 text-white hover:bg-gray-600';
      case 'Under Review':
        return 'bg-warning text-white hover:bg-warning/90';
      case 'Qualified':
        return 'bg-success text-white hover:bg-success/90';
      case 'Booked':
        return 'bg-purple-600 text-white hover:bg-purple-700';
      case 'Rejected':
        return 'bg-danger text-white hover:bg-danger/90';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Badge className={cn(getStatusStyles(status), className)}>
      {status}
    </Badge>
  );
}
