'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Badge from '@/components/badge';
import { ArrowLeft, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { api, Pet } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PetDetailsPage({ params }: PageProps) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
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
                  <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Contact NGO
                  </button>
                  <Link
                    href="/"
                    className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-center"
                  >
                    Back to Listing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
