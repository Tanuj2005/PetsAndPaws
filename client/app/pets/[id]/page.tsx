'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Badge from '@/components/badge';
import { ArrowLeft, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { api, Pet } from '@/lib/api';

interface PageProps {
  params: { id: string };
}

export default function PetDetailsPage({ params }: PageProps) {
  const { id } = params;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; user_type: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    adopter_name: '',
    adopter_email: '',
    adopter_phone: '',
    adopter_city: '',
    message: '',
  });

  useEffect(() => {
    console.log('Pet ID from params:', id);
    if (!id) return;

    async function fetchPet() {
      try {
        setLoading(true);
        const petData = await api.getPetById(id);
        setPet(petData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pet');
      } finally {
        setLoading(false);
      }
    }

    fetchPet();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        adopter_name: parsedUser?.name || '',
        adopter_email: parsedUser?.email || '',
      }));
    }
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;

    setFormError(null);
    setFormSuccess(null);
    setFormLoading(true);

    try {
      await api.createAdoptionRequest(pet._id, {
        adopter_name: formData.adopter_name,
        adopter_email: formData.adopter_email,
        adopter_phone: formData.adopter_phone,
        adopter_city: formData.adopter_city,
        message: formData.message || undefined,
      });

      setFormSuccess('Your adoption request has been submitted successfully.');
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Pet Not Found</h1>
              <p className="text-muted-foreground mb-6">
                {error || "The pet you're looking for doesn't exist or has been removed."}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Listing
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listing
          </Link>

          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Image */}
              <div>
                <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={pet.image_url || "/placeholder.svg"}
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                    {pet.name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="type">{pet.type}</Badge>
                    <Badge variant="health">
                      {pet.vaccinated ? 'Vaccinated' : 'Needs Care'}
                    </Badge>
                  </div>
                </div>

                {/* Key Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="text-foreground font-medium">
                        {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-foreground font-medium">{pet.location}</p>
                    </div>
                  </div>
                </div>

                {/* Health Info */}
                <div className="border-t border-border pt-6">
                  <h2 className="font-semibold text-foreground mb-3">Health Information</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {pet.vaccinated ? (
                        <CheckCircle className="w-5 h-5 text-secondary" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-accent" />
                      )}
                      <span className="text-foreground">
                        {pet.vaccinated ? 'Vaccinated' : 'Vaccination needed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {pet.neutered ? (
                        <CheckCircle className="w-5 h-5 text-secondary" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-accent" />
                      )}
                      <span className="text-foreground">
                        {pet.neutered ? 'Neutered/Spayed' : 'Neutering pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical Notes */}
                {pet.medical_notes && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">Medical Notes</p>
                    <p className="text-foreground">{pet.medical_notes}</p>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3 pt-6">
                  {user?.user_type === 'Adopter' ? (
                    <button
                      onClick={() => setShowForm((prev) => !prev)}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {showForm ? 'Hide Form' : 'Adopt This Pet'}
                    </button>
                  ) : user?.user_type === 'NGO' ? (
                    <button
                      disabled
                      className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg font-semibold cursor-not-allowed"
                    >
                      NGO accounts cannot submit requests
                    </button>
                  ) : (
                    <Link
                      href="/auth"
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center"
                    >
                      Sign In to Adopt
                    </Link>
                  )}
                  <Link
                    href="/"
                    className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-center"
                  >
                    Back to Listing
                  </Link>
                </div>

                {formSuccess && (
                  <div className="bg-green-100 text-green-800 rounded-lg px-4 py-3 text-sm font-medium">
                    {formSuccess}
                  </div>
                )}

                {formError && (
                  <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
                    {formError}
                  </div>
                )}

                {showForm && user?.user_type === 'Adopter' && (
                  <form onSubmit={handleSubmitRequest} className="border-t border-border pt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Adoption Request Form</h3>

                    <input
                      type="text"
                      name="adopter_name"
                      value={formData.adopter_name}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      required
                    />

                    <input
                      type="email"
                      name="adopter_email"
                      value={formData.adopter_email}
                      onChange={handleFormChange}
                      placeholder="Your email"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      required
                    />

                    <input
                      type="tel"
                      name="adopter_phone"
                      value={formData.adopter_phone}
                      onChange={handleFormChange}
                      placeholder="Phone number"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      required
                    />

                    <input
                      type="text"
                      name="adopter_city"
                      value={formData.adopter_city}
                      onChange={handleFormChange}
                      placeholder="Your city"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                      required
                    />

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder="Why do you want to adopt this pet?"
                      rows={4}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground"
                    />

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {formLoading ? 'Submitting...' : 'Submit Adoption Request'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
