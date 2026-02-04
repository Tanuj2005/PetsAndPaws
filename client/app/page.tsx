'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Filters, { FilterState } from '@/components/filters';
import PetCard from '@/components/pet-card';
import EmptyState from '@/components/empty-state';
import { ArrowRight } from 'lucide-react';
import { api, Pet } from '@/lib/api';

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    age: 'All',
    location: ''
  });
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pets from API
  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        const response = await api.getPets({
          type: filters.type !== 'All' ? filters.type : undefined,
          location: filters.location || undefined,
          limit: 100,
        });
        setAllPets(response.pets);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, [filters.type, filters.location]);

  // Filter pets by age on client-side
  const filteredPets = useMemo(() => {
    return allPets.filter((pet) => {
      // Age filter
      if (filters.age !== 'All') {
        const age = pet.age;
        switch (filters.age) {
          case '0-2':
            if (age > 2) return false;
            break;
          case '3-5':
            if (age < 3 || age > 5) return false;
            break;
          case '6+':
            if (age < 6) return false;
            break;
        }
      }

      return true;
    });
  }, [allPets, filters.age]);

  const handleClearFilters = () => {
    setFilters({ type: 'All', age: 'All', location: '' });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Find Your Perfect Companion
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Discover loving pets waiting for their forever homes. Browse, filter, and connect with your new family member today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pets"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Browse Pets
                  <ArrowRight className="w-4 h-4" />
                </a>
                
              </div>
            </div>
          </div>
        </section>

        {/* Pet Listing Section */}
        <section id="pets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Available Pets</h2>
            <p className="text-muted-foreground">
              Filter by type, age, and location to find the right companion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredPets.length}
              />
            </div>

            {/* Pet Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-muted-foreground">Loading pets...</p>
                </div>
              ) : filteredPets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPets.map((pet) => (
                    <PetCard key={pet._id} pet={pet} />
                  ))}
                </div>
              ) : (
                <EmptyState onClearFilters={handleClearFilters} />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
