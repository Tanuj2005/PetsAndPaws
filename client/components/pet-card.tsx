'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Pet } from '@/lib/api';
import Badge from './badge';
import { MapPin, Calendar } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <Link href={`/pets/${pet._id}`}>
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <Image
            src={pet.image_url || "/placeholder.svg"}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Name & Badges */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-2">{pet.name}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="type">{pet.type}</Badge>
              <Badge variant="health">
                {pet.vaccinated ? 'Vaccinated' : 'Needs Care'}
              </Badge>
            </div>
          </div>

          {/* Meta Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{pet.location}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2 mt-auto">
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
