'use client';

import React from 'react';
import { TimelineEvent } from '@/lib/types';
import { FileText, AlertCircle, UserPlus, StickyNote, Calendar, MessageSquare } from 'lucide-react';

interface MedicalTimelineProps {
  events: TimelineEvent[];
}

export function MedicalTimeline({ events }: MedicalTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'submission': return <FileText className="h-4 w-4" />;
      case 'status-change': return <AlertCircle className="h-4 w-4" />;
      case 'doctor-assigned': return <UserPlus className="h-4 w-4" />;
      case 'note-added': return <StickyNote className="h-4 w-4" />;
      case 'appointment-scheduled': return <Calendar className="h-4 w-4" />;
      case 'message-sent': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      {sortedEvents.map((event, idx) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {getIcon(event.type)}
          </div>
          <div className="flex-1 pb-4 border-b border-gray-200">
            <p className="font-medium text-gray-900">{event.description}</p>
            <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
            {event.userName && <p className="text-xs text-gray-400 mt-1">By {event.userName}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
