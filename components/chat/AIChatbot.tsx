'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Send, Bot, Loader2, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  type: 'patient' | 'doctor';
  onClose: () => void;
  patientId?: string;
}

export function AIChatbot({ type, onClose, patientId }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    const greeting = type === 'patient' 
      ? "Hello! I'm your Hair Restoration AI Assistant. I can help you with:\n\n• Understanding FUE/FUT procedures\n• Post-operative care instructions\n• Recovery timeline expectations\n• Treatment options and costs\n• Booking consultations\n\nHow can I assist you today?"
      : "Hello Doctor! I'm your AI Clinical Assistant. I can help you with:\n\n• Patient case summaries\n• Automated status updates\n• Risk assessment analysis\n• Treatment recommendations\n• Documentation automation\n\nHow can I assist you today?";
    
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    }]);
  }, [type]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(input.trim(), type, patientId);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">
              {type === 'patient' ? 'Patient AI Assistant' : 'Clinical AI Assistant'}
            </h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Mock AI Response Generator
function generateAIResponse(input: string, type: 'patient' | 'doctor', patientId?: string): string {
  const lowerInput = input.toLowerCase();

  if (type === 'patient') {
    // Patient-focused responses
    if (lowerInput.includes('fue') || lowerInput.includes('procedure') || lowerInput.includes('transplant')) {
      return "FUE (Follicular Unit Extraction) is a minimally invasive hair transplant technique where individual hair follicles are extracted from the donor area and transplanted to areas of hair loss.\n\n**Key Benefits:**\n• No linear scar\n• Faster recovery (7-10 days)\n• Natural-looking results\n• Minimal discomfort\n\n**Procedure Duration:** 6-8 hours\n**Success Rate:** 95%+\n\nWould you like to know more about the recovery process?";
    }

    if (lowerInput.includes('cost') || lowerInput.includes('price') || lowerInput.includes('budget')) {
      return "Hair transplant costs vary based on several factors:\n\n**Factors:**\n• Number of grafts needed\n• Norwood scale stage\n• Procedure type (FUE/FUT)\n• Clinic location\n\n**Typical Ranges:**\n• Norwood 2-3: $5,000 - $10,000\n• Norwood 4-5: $10,000 - $15,000\n• Norwood 6-7: $15,000+\n\nWe offer flexible payment plans! Would you like to schedule a consultation for a personalized quote?";
    }

    if (lowerInput.includes('recovery') || lowerInput.includes('healing') || lowerInput.includes('after')) {
      return "**Post-Operative Recovery Timeline:**\n\n**Days 1-3:** Mild swelling, sleep elevated\n**Days 4-7:** Swelling subsides, gentle washing allowed\n**Days 7-10:** Return to work possible\n**Week 2-3:** Transplanted hair may shed (normal!)\n**Month 3-4:** New growth begins\n**Month 6-8:** Visible results\n**Month 12-18:** Final results\n\n**Important:** Avoid direct sun, swimming, and intense exercise for 2 weeks.\n\nAny specific concerns about recovery?";
    }

    if (lowerInput.includes('book') || lowerInput.includes('appointment') || lowerInput.includes('consultation')) {
      return "Great! I can help you book a consultation.\n\n**Available Consultation Options:**\n• Virtual consultation (30 min) - FREE\n• In-person consultation (60 min) - FREE\n\n**Our Doctors:**\n• Dr. Sarah Kim - FUE Specialist\n• Dr. Michael Chen - Advanced Restoration\n\n**Next Steps:**\n1. Complete your assessment (if not done)\n2. Upload 6 angle photos\n3. Choose preferred date/time\n\nWould you like to proceed with booking?";
    }

    if (lowerInput.includes('norwood') || lowerInput.includes('scale') || lowerInput.includes('stage')) {
      return "The Norwood Scale measures male pattern baldness stages:\n\n**Stages:**\n• Norwood 1-2: Minimal hair loss, preventive treatment\n• Norwood 3-4: Moderate loss, ideal for transplant\n• Norwood 5-6: Advanced loss, multiple sessions may be needed\n• Norwood 7: Severe loss, donor area assessment critical\n\n**For accurate assessment:** Upload your photos during the assessment process, and our AI + doctor will evaluate your Norwood stage.\n\nHave you completed your assessment yet?";
    }

    return "I understand your question. Here's what I can help with:\n\n• **Treatment Info:** FUE, FUT procedures, PRP therapy\n• **Costs & Financing:** Pricing, payment plans\n• **Recovery:** Timeline, aftercare, expectations\n• **Booking:** Schedule consultations\n• **Results:** Before/after, success rates\n\nCould you please be more specific about what you'd like to know?";
  } else {
    // Doctor/Staff-focused responses
    if (lowerInput.includes('review') || lowerInput.includes('case') || lowerInput.includes('patient')) {
      return `**AI Case Summary Generated:**\n\n${patientId ? `Patient ID: ${patientId}` : 'Recent Cases:'}\n\n**Automated Actions Completed:**\n✓ Medical history reviewed\n✓ Photo quality verified\n✓ Risk indicators identified\n✓ AI qualification score calculated\n\n**Recommendations:**\n• Patient meets medical criteria\n• Realistic expectations confirmed\n• Suggested graft count: 2000-2500\n• Recommend Dr. Sarah Kim assignment\n\n**Next Steps:**\n1. Review doctor notes\n2. Update status to "Qualified"\n3. Schedule initial consultation\n\nWould you like me to auto-update the status?`;
    }

    if (lowerInput.includes('update') || lowerInput.includes('status') || lowerInput.includes('change')) {
      return "**Automated Status Update Available:**\n\nI can automatically update patient statuses based on:\n• AI qualification scores\n• Complete documentation\n• Risk assessment results\n• Timeline compliance\n\n**Suggested Actions:**\n• Move high-score patients (>80) to \"Qualified\"\n• Flag medium-risk patients for review\n• Auto-reject low-score (<40) with reasoning\n\n**Safety:** All automated updates are logged in audit trail.\n\nShould I proceed with automated updates for today's submissions?";
    }

    if (lowerInput.includes('note') || lowerInput.includes('document') || lowerInput.includes('report')) {
      return "**AI Documentation Assistant:**\n\nI can auto-generate:\n\n**Medical Notes:**\n• Initial screening summaries\n• Risk assessment documentation\n• Pre-op checklists\n• Post-consultation reports\n\n**Administrative:**\n• Patient communication templates\n• Follow-up schedules\n• Insurance pre-authorization forms\n\n**Analysis:**\n• Weekly case statistics\n• Conversion rate reports\n• Doctor workload distribution\n\nWhich document would you like me to generate?";
    }

    if (lowerInput.includes('risk') || lowerInput.includes('flag') || lowerInput.includes('alert')) {
      return "**AI Risk Detection System:**\n\n**Currently Monitoring:**\n• Medical contraindications (blood thinners, conditions)\n• Unrealistic expectations (advanced stage + high density)\n• Budget misalignment (cost vs. budget)\n• Photo quality issues\n• Incomplete documentation\n\n**Recent Alerts (Last 24h):**\n⚠️ 2 patients with medical flags\n⚠️ 1 patient with budget concerns\n✓ 5 patients cleared for qualification\n\n**Auto-Actions:**\n• Email follow-ups sent to incomplete applications\n• Doctor alerts sent for high-risk cases\n\nView detailed risk dashboard?";
    }

    if (lowerInput.includes('schedule') || lowerInput.includes('appointment') || lowerInput.includes('calendar')) {
      return "**AI Scheduling Assistant:**\n\n**Today's Schedule:**\n• 3 consultations booked\n• 2 follow-up calls pending\n• 1 pre-op appointment\n\n**Optimization Suggestions:**\n• Dr. Kim has 2 open slots tomorrow\n• 4 qualified patients awaiting consultation\n• Recommended: Auto-send booking invites\n\n**Automated Actions:**\n• Send SMS reminders 24h before\n• Email confirmations with prep instructions\n• Auto-reschedule no-shows\n\nActivate automated scheduling?";
    }

    return "**Clinical AI Assistant Ready**\n\nI can help you with:\n\n**Patient Management:**\n• Auto-review new cases\n• Generate medical summaries\n• Update statuses automatically\n\n**Documentation:**\n• Write clinical notes\n• Create reports\n• Generate PDFs\n\n**Analytics:**\n• Case statistics\n• Risk assessments\n• Performance metrics\n\nWhat would you like me to do?";
  }
}
