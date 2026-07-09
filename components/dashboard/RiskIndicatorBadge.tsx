'use client';

import React from 'react';
import { RiskIndicator } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface RiskIndicatorBadgeProps {
  risk: RiskIndicator;
}

export function RiskIndicatorBadge({ risk }: RiskIndicatorBadgeProps) {
  const getColorClass = () => {
    switch (risk.severity) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getIcon = () => {
    switch (risk.severity) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <AlertCircle className="h-3 w-3" />;
      case 'low': return <Info className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getLabel = () => {
    return risk.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge className={`${getColorClass()} flex items-center gap-1`}>
            {getIcon()}
            <span className="capitalize">{risk.severity}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div>
            <p className="font-semibold mb-1">{getLabel()}</p>
            <p className="text-sm">{risk.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
