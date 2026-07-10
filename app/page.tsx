'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { useAssessment } from '@/lib/contexts/AssessmentContext';
import { 
  FileText, ArrowRight, Check, Clock, Shield, Users, 
  Sparkles, Camera, ClipboardList, Calendar, Star,
  ChevronDown, MessageCircle, Award
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { actions } = useAssessment();
  const [resumeCode, setResumeCode] = useState('');
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleStartNew = () => {
    actions.resetAssessment();
    router.push('/assessment/1');
  };

  const handleResume = () => {
    if (!resumeCode.trim()) {
      setError('Please enter a resume code');
      return;
    }

    const success = actions.loadProgress(resumeCode.trim().toUpperCase());
    if (success) {
      router.push('/assessment/1');
    } else {
      setError('Invalid or expired resume code');
    }
  };

  const faqs = [
    {
      q: 'How long does the assessment take?',
      a: 'The comprehensive assessment takes approximately 10-15 minutes to complete. You can save your progress at any time and continue later.'
    },
    {
      q: 'Is my information secure?',
      a: 'Yes, all your personal and medical information is encrypted and stored securely. We follow strict HIPAA compliance guidelines to protect your privacy.'
    },
    {
      q: 'When will I receive my results?',
      a: 'You will receive your AI qualification score immediately after submission. A doctor will review your case and contact you within 24-48 hours with personalized recommendations.'
    },
    {
      q: 'Do I need to upload photos?',
      a: 'Yes, photos are essential for accurate assessment. You will need to upload 6 photos showing different angles of your scalp and hair.'
    },
    {
      q: 'What happens after I submit?',
      a: 'After submission, your case will be reviewed by our medical team. You will receive a consultation booking link via email and SMS to schedule your appointment.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Hair Restoration Assessment</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Get Your Personalized Hair Restoration Plan in Minutes
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Complete our intelligent assessment and receive a professional consultation with our expert hair restoration specialists
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                onClick={handleStartNew} 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              >
                Start Free Assessment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">1,500+</div>
                <div className="text-sm text-white/80">Successful Cases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">98%</div>
                <div className="text-sm text-white/80">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">24hrs</div>
                <div className="text-sm text-white/80">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">15+</div>
                <div className="text-sm text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Assessment Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get expert medical evaluation without leaving your home
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600">
                  Our advanced AI analyzes your hair loss pattern, medical history, and photos to generate an accurate qualification score reviewed by experienced doctors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Save Time & Money</h3>
                <p className="text-gray-600">
                  No need to visit the clinic for initial screening. Complete the assessment at your convenience and get professional feedback within 24-48 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">100% Confidential</h3>
                <p className="text-gray-600">
                  Your personal and medical information is encrypted and stored securely. We follow strict medical privacy standards (HIPAA compliant).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete your assessment in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: ClipboardList,
                step: '1',
                title: 'Complete Assessment',
                desc: 'Answer questions about your hair loss history, medical conditions, and current treatments'
              },
              {
                icon: Camera,
                step: '2',
                title: 'Upload Photos',
                desc: 'Take 6 photos of your scalp from different angles using your smartphone'
              },
              {
                icon: Sparkles,
                step: '3',
                title: 'AI Analysis',
                desc: 'Our AI analyzes your case and generates a qualification score for doctor review'
              },
              {
                icon: Calendar,
                step: '4',
                title: 'Book Consultation',
                desc: 'Receive your results and schedule a consultation with our specialist'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                )}
                <div className="relative">
                  <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <item.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md font-bold text-primary border-2 border-primary mx-auto left-0 right-0">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={handleStartNew} size="lg" className="px-8">
              Get Started Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Resume Assessment Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Already Started?</CardTitle>
              <p className="text-gray-600 mt-2">Resume your assessment using your code</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  label="Resume Code"
                  error={error}
                >
                  <Input
                    value={resumeCode}
                    onChange={(e) => {
                      setResumeCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Enter 8-character code"
                    maxLength={8}
                    className="uppercase font-mono text-center text-lg"
                  />
                </FormField>
                <Button onClick={handleResume} variant="outline" className="w-full" size="lg">
                  Continue Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-gray-700 mb-4">
                  "The assessment was incredibly thorough and the AI analysis helped me understand my options. Highly recommend!"
                </p>
                <p className="text-sm text-gray-600 font-medium">— Michael R., Verified Patient</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-gray-700 mb-4">
                  "Quick, professional, and convenient. I got my consultation booked within 2 days and felt confident in my decision."
                </p>
                <p className="text-sm text-gray-600 font-medium">— David S., Verified Patient</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-gray-700 mb-4">
                  "The whole process was smooth from start to finish. The doctors were knowledgeable and answered all my questions."
                </p>
                <p className="text-sm text-gray-600 font-medium">— James T., Verified Patient</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap justify-center gap-8 items-center pt-8 border-t">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              <div className="text-left">
                <div className="font-semibold">HIPAA Compliant</div>
                <div className="text-sm text-gray-600">Medical Privacy Protected</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-left">
                <div className="font-semibold">256-bit Encryption</div>
                <div className="text-sm text-gray-600">Bank-Level Security</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Board Certified</div>
                <div className="text-sm text-gray-600">Expert Specialists</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-2">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.q}</span>
                    <ChevronDown 
                      className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.a}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Restore Your Confidence?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards your hair restoration journey. Complete your free assessment today and receive expert recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartNew}
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              Start Free Assessment
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
          </div>
          <p className="mt-8 text-white/80">
            <Check className="h-5 w-5 inline mr-2" />
            No credit card required • Free consultation • 100% confidential
          </p>
        </div>
      </section>
    </div>
  );
}
