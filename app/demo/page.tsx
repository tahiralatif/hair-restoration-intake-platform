'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, User, ClipboardList, Camera, Calendar, 
  CheckCircle, Users, BarChart, FileText, ArrowRight 
} from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();

  const features = [
    {
      icon: User,
      title: 'Patient Assessment Flow',
      description: 'Complete 9-step guided assessment with real-time validation',
      demo: '/assessment/1',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Clinic Dashboard',
      description: 'Manage all patient applications with search, filter, and status tracking',
      demo: '/clinic/dashboard',
      color: 'bg-green-500'
    },
    {
      icon: FileText,
      title: 'Patient Details',
      description: 'View complete patient profile with medical history, photos, and timeline',
      demo: '/clinic/patients/1',
      color: 'bg-purple-500'
    },
    {
      icon: ClipboardList,
      title: 'Doctor Dashboard',
      description: 'Review assigned patients with AI scores and risk indicators',
      demo: '/doctor/dashboard',
      color: 'bg-orange-500'
    },
    {
      icon: BarChart,
      title: 'Admin Analytics',
      description: 'Track conversion rates, bookings, and patient statistics',
      demo: '/admin/dashboard',
      color: 'bg-red-500'
    },
    {
      icon: User,
      title: 'Patient Dashboard',
      description: 'Patient portal to view application status and appointments',
      demo: '/dashboard/patient/1',
      color: 'bg-teal-500'
    }
  ];

  const workflow = [
    {
      step: 1,
      title: 'Patient Lands on Homepage',
      description: 'Visitor sees compelling landing page with benefits and trust elements',
      path: '/'
    },
    {
      step: 2,
      title: 'Starts Assessment',
      description: 'Patient clicks "Start Assessment" and begins the 9-step process',
      path: '/assessment/1'
    },
    {
      step: 3,
      title: 'Completes All Steps',
      description: 'Patient provides personal info, medical history, photos, and preferences',
      path: '/assessment/9'
    },
    {
      step: 4,
      title: 'Receives Confirmation',
      description: 'System generates confirmation number and sends email/SMS notifications',
      path: '/assessment/complete'
    },
    {
      step: 5,
      title: 'Clinic Staff Reviews',
      description: 'Staff sees new application in clinic dashboard and assigns doctor',
      path: '/clinic/dashboard'
    },
    {
      step: 6,
      title: 'Doctor Evaluates',
      description: 'Doctor reviews AI score, photos, and medical history',
      path: '/doctor/dashboard'
    },
    {
      step: 7,
      title: 'Status Updated',
      description: 'Patient status changed to "Qualified" and consultation scheduled',
      path: '/clinic/patients/1'
    },
    {
      step: 8,
      title: 'Patient Notified',
      description: 'Patient receives booking confirmation via email/SMS',
      path: '/dashboard/patient/1'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Interactive Demo</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Experience the Complete Platform
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              Explore every feature of the Hair Restoration Patient Intake Platform
            </p>

            <Button 
              onClick={() => router.push('/assessment/1')}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              Start Live Demo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore All Features
          </h2>
          <p className="text-xl text-gray-600">
            Click any feature to see it in action
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card 
              key={idx}
              className="border-2 hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer group"
              onClick={() => router.push(feature.demo)}
            >
              <CardContent className="pt-6">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  <span>Try it now</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Complete Workflow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Complete Patient Journey
            </h2>
            <p className="text-xl text-gray-600">
              See how patients flow through the entire system
            </p>
          </div>

          <div className="space-y-6">
            {workflow.map((item, idx) => (
              <Card 
                key={idx}
                className="border-2 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => router.push(item.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => router.push('/')}
              size="lg"
              className="px-8"
            >
              Back to Homepage
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features List */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Included Features
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            'Multi-step patient assessment with validation',
            'AI-powered qualification scoring',
            'Secure photo upload (6 angles)',
            'Norwood Scale visual selection',
            'Save & resume functionality',
            'Email & SMS confirmations',
            'Clinic staff dashboard',
            'Doctor review dashboard',
            'Admin analytics dashboard',
            'Patient detail screens',
            'Search & filter capabilities',
            'Status tracking & timeline',
            'Risk indicator detection',
            'Appointment scheduling',
            'Internal notes & messaging',
            'PDF export functionality',
            'Mobile responsive design',
            'HIPAA compliant security'
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
              <span className="text-lg text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Experience the complete patient intake system now
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/assessment/1')}
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              Start Assessment Demo
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              onClick={() => router.push('/contact')}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
