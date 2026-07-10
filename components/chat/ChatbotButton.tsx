'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { AIChatbot } from './AIChatbot';

interface ChatbotButtonProps {
  type: 'patient' | 'doctor';
  patientId?: string;
}

export function ChatbotButton({ type, patientId }: ChatbotButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return <AIChatbot type={type} onClose={() => setIsOpen(false)} patientId={patientId} />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    </div>
  );
}
