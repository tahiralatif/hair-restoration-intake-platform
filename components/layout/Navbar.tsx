'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogIn, Home, BarChart, Users, UserCircle, LogOut } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      router.push('/');
    }
  };

  // Don't show navbar on assessment pages or login page
  if (pathname?.startsWith('/assessment') || pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">HR</span>
              </div>
              <span className="hidden sm:inline">Hair Restoration</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              <Home className="h-4 w-4 inline mr-1" />
              Home
            </button>

            <button
              onClick={() => router.push('/demo')}
              className={`text-sm font-medium transition-colors ${
                pathname === '/demo' ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              <BarChart className="h-4 w-4 inline mr-1" />
              Demo
            </button>

            <button
              onClick={() => router.push('/contact')}
              className={`text-sm font-medium transition-colors ${
                pathname === '/contact' ? 'text-primary' : 'text-gray-700 hover:text-primary'
              }`}
            >
              <Users className="h-4 w-4 inline mr-1" />
              Contact
            </button>
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <UserCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">{currentUser.username}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {currentUser.role}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push('/login')}
                variant="default"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
