'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Play as Paw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (helpDropdownOpen && !(event.target as Element).closest('.help-dropdown')) {
        setHelpDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [helpDropdownOpen]);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Paw className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Pups & Paws</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {user && user.user_type === 'NGO' && (
              <>
                {pathname === '/ngo' ? (
                  <Link
                    href="/"
                    className="text-base font-medium transition-colors cursor-pointer text-foreground hover:text-primary"
                  >
                    Listing
                  </Link>
                ) : (
                  <Link
                    href="/ngo"
                    className="text-base font-medium transition-colors cursor-pointer text-foreground hover:text-primary"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
            
            {user && user.user_type !== 'NGO' && (
              <>
                {pathname === '/my-requests' || pathname === '/guide' || pathname === '/faq' || pathname === '/care-guide' ? (
                  <Link
                    href="/"
                    className="text-base font-medium transition-colors cursor-pointer text-foreground hover:text-primary"
                  >
                    Listing
                  </Link>
                ) : (
                  <Link
                    href="/my-requests"
                    className="text-base font-medium transition-colors cursor-pointer text-foreground hover:text-primary"
                  >
                    My Requests
                  </Link>
                )}
              </>
            )}

            {/* Help Dropdown */}
            {user && user.user_type !== 'NGO' && (
              <div className="relative help-dropdown">
                <button
                  onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors text-base font-medium cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help
                  <ChevronDown className="h-3 w-3" />
                </button>

                {helpDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      href="/guide"
                      onClick={() => setHelpDropdownOpen(false)}
                      className={`block px-4 py-2 text-base hover:bg-gray-50 transition-colors ${
                        pathname === '/guide' ? 'text-primary bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      Adoption Guide
                    </Link>
                    <Link
                      href="/faq"
                      onClick={() => setHelpDropdownOpen(false)}
                      className={`block px-4 py-2 text-base hover:bg-gray-50 transition-colors ${
                        pathname === '/faq' ? 'text-primary bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      FAQ
                    </Link>
                    <Link
                      href="/care-guide"
                      onClick={() => setHelpDropdownOpen(false)}
                      className={`block px-4 py-2 text-base hover:bg-gray-50 transition-colors ${
                        pathname === '/care-guide' ? 'text-primary bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      Care Guide
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Auth Buttons */}
            {loading ? null : user ? (
              <div className="flex items-center gap-4">
                <span className="text-base text-muted-foreground">
                  {user.name}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
