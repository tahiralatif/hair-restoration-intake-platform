'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { AlertCircle, Lock, Mail, User } from 'lucide-react';

// Demo users
const DEMO_USERS = {
  admin: {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin1234',
    role: 'admin',
    redirect: '/admin/dashboard'
  },
  doctor: {
    username: 'doctor',
    email: 'doctor@gmail.com',
    password: 'doctor1234',
    role: 'doctor',
    redirect: '/doctor/dashboard'
  },
  john: {
    username: 'john',
    email: 'john@gmail.com',
    password: 'john12345',
    role: 'patient',
    redirect: '/dashboard/patient/1'
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.emailOrUsername || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    const user = Object.values(DEMO_USERS).find(
      u => (u.email === formData.emailOrUsername || u.username === formData.emailOrUsername) 
        && u.password === formData.password
    );

    if (user) {
      // Store user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      router.push(user.redirect);
    } else {
      setError('Invalid email/username or password');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (userKey: keyof typeof DEMO_USERS) => {
    const user = DEMO_USERS[userKey];
    setFormData({
      emailOrUsername: user.email,
      password: user.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <FormField
                label="Email or Username"
                htmlFor="emailOrUsername"
                required
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="emailOrUsername"
                    value={formData.emailOrUsername}
                    onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                    placeholder="Enter email or username"
                    className="h-12 text-base pl-10"
                  />
                </div>
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                required
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    className="h-12 text-base pl-10"
                  />
                </div>
              </FormField>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-4 text-center font-medium">
                Demo Accounts (Click to auto-fill)
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full p-3 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Admin</p>
                      <p className="text-xs text-gray-600">admin@gmail.com</p>
                    </div>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                      Click to fill
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDemoLogin('doctor')}
                  className="w-full p-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Doctor</p>
                      <p className="text-xs text-gray-600">doctor@gmail.com</p>
                    </div>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                      Click to fill
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDemoLogin('john')}
                  className="w-full p-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Patient (John)</p>
                      <p className="text-xs text-gray-600">john@gmail.com</p>
                    </div>
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                      Click to fill
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-primary hover:underline"
              >
                ← Back to Homepage
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need help? <button className="text-primary hover:underline" onClick={() => router.push('/contact')}>Contact Support</button></p>
        </div>
      </div>
    </div>
  );
}
