'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Building2, Users } from 'lucide-react';
import { api } from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'adopter' | 'ngo'>('adopter');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organizationName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.name && userType === 'adopter') {
        newErrors.name = 'Full name is required';
      }
      if (!formData.organizationName && userType === 'ngo') {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isSignUp) {
        const name = userType === 'adopter' ? formData.name : formData.organizationName;
        const result = await api.signup({
          email: formData.email,
          password: formData.password,
          name,
          user_type: userType === 'adopter' ? 'Adopter' : 'NGO',
        });
        
        router.push(result.redirect_url);
      } else {
        const result = await api.login({
          email: formData.email,
          password: formData.password,
        });
        
        router.push(result.redirect_url);
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Info Section */}
        <div className="hidden md:flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pups & Paws
            </h1>
            <p className="text-xl text-muted-foreground">
              Connecting loving homes with pets in need.
            </p>
          </div>

          <div className="space-y-6">
            {/* Adopter Benefits */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  For Pet Adopters
                </h3>
                <p className="text-sm text-muted-foreground">
                  Find your perfect pet companion and get expert guidance on pet care.
                </p>
              </div>
            </div>

            {/* NGO Benefits */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary/20">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  For NGOs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage your pets, track adoptions, and expand your rescue's reach.
                </p>
              </div>
            </div>

            {/* Community Benefit */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/20">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Join Our Community
                </h3>
                <p className="text-sm text-muted-foreground">
                  Be part of a movement to give every pet a loving home.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <Card className="w-full shadow-lg">
          <div className="p-8">
            {/* User Type Selection */}
            <Tabs value={userType} onValueChange={(value) => {
              setUserType(value as 'adopter' | 'ngo');
              setFormData({ email: '', password: '', confirmPassword: '', name: '', organizationName: '' });
              setErrors({});
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="adopter" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Adopter</span>
                </TabsTrigger>
                <TabsTrigger value="ngo" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">NGO</span>
                </TabsTrigger>
              </TabsList>

              {/* Form Container */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isSignUp
                      ? userType === 'adopter'
                        ? 'Join us to find your perfect pet'
                        : 'Register your organization and start making a difference'
                      : 'Sign in to your account to continue'}
                  </p>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">{errors.submit}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Adopter Name Field */}
                {isSignUp && userType === 'adopter' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                )}

                {/* NGO Organization Name Field */}
                {isSignUp && userType === 'ngo' && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      placeholder="Your NGO Name"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={errors.organizationName ? 'border-destructive' : ''}
                    />
                    {errors.organizationName && (
                      <p className="text-sm text-destructive">{errors.organizationName}</p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field (Sign Up Only) */}
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>

                {/* Forgot Password Link (Login Only) */}
                {!isSignUp && (
                  <div className="text-center">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                )}

                {/* Toggle Sign In / Sign Up */}
                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setFormData({ email: '', password: '', confirmPassword: '', name: '', organizationName: '' });
                        setErrors({});
                      }}
                      disabled={loading}
                      className="ml-2 text-primary font-semibold hover:text-primary/80 transition-colors disabled:opacity-50"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </form>
            </Tabs>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue as guest</span>
              </div>
            </div>

            {/* Guest Button */}
            <Link href="/">
              <Button variant="outline" className="w-full">
                Browse Pets as Guest
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
