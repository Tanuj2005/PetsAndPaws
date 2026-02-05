'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AddPetPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog' as 'Dog' | 'Cat',
    age: '',
    location: '',
    vaccinated: true,
    neutered: true,
    medicalNotes: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget;
    const { name, value } = target;
    
    // Check if it's a checkbox input
    const isCheckbox = target instanceof HTMLInputElement && target.type === 'checkbox';
    
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? target.checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.name || !formData.age || !formData.location || !imageFile) {
      alert('Please fill in all required fields including the pet image');
      setLoading(false);
      return;
    }

    try {
      await api.createPet({
        name: formData.name,
        type: formData.type,
        age: parseInt(formData.age),
        location: formData.location,
        image: imageFile,
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        medical_notes: formData.medicalNotes || undefined,
      });

      // Show success message
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-secondary/10 border border-secondary rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-secondary" />
              <div>
                <p className="font-semibold text-foreground">Pet added successfully!</p>
                <p className="text-sm text-muted-foreground">Redirecting you back home...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Add a Pet</h1>
              <p className="text-muted-foreground">
                Fill in the details below to add a new pet to our adoption platform.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Pet Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Max"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  disabled={loading}
                />
              </div>

              {/* Pet Type & Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Pet Type <span className="text-accent">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={loading}
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Age (years) <span className="text-accent">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 3"
                    min="0"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Location <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  disabled={loading}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Upload Pet Photo <span className="text-accent">*</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepted formats: JPEG, PNG, WebP. Max size: 10MB
                </p>
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                    />
                  </div>
                )}
              </div>

              {/* Health Info Section */}
              <div className="border-t border-border pt-6">
                <h2 className="font-semibold text-foreground mb-4">Health Information</h2>

                <div className="space-y-4">
                  {/* Vaccinated */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="vaccinated"
                      checked={formData.vaccinated}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded"
                      disabled={loading}
                    />
                    <span className="text-sm text-foreground">Vaccinated</span>
                  </label>

                  {/* Neutered/Spayed */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="neutered"
                      checked={formData.neutered}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded"
                      disabled={loading}
                    />
                    <span className="text-sm text-foreground">Neutered/Spayed</span>
                  </label>
                </div>
              </div>

              {/* Medical Notes */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Medical Notes
                </label>
                <textarea
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional health or behavioral information..."
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  disabled={loading}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Adding Pet...' : 'Add Pet'}
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
