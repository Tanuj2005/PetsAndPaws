'use client';

import React from 'react';
import Navbar from '@/components/navbar';
import { Card } from '@/components/ui/card';
import { Heart, Apple, Pill, Activity, Droplets, Utensils, Home, AlertTriangle, Zap } from 'lucide-react';

export default function CareGuidePage() {
  const dogCareTopics = [
    {
      icon: Utensils,
      title: "Nutrition & Feeding",
      content: [
        "Feed high-quality dog food appropriate for their age, size, and health status.",
        "Adult dogs typically need 1-2 meals per day; puppies need 3-4 meals.",
        "Provide fresh water at all times throughout the day.",
        "Avoid toxic foods: chocolate, grapes, onions, avocados, and xylitol.",
        "Consult your vet about portion sizes and dietary requirements."
      ]
    },
    {
      icon: Activity,
      title: "Exercise & Play",
      content: [
        "Adult dogs need at least 30-60 minutes of exercise daily depending on breed.",
        "Puppies have shorter attention spans; multiple short play sessions work best.",
        "Regular walks help with both physical and mental stimulation.",
        "Play fetch, tug-of-war, or use puzzle toys to keep them engaged.",
        "Senior dogs benefit from gentler, shorter exercise sessions."
      ]
    },
    {
      icon: Pill,
      title: "Health & Veterinary Care",
      content: [
        "Schedule annual vet checkups; puppies and seniors may need more frequent visits.",
        "Keep vaccinations and parasite prevention current.",
        "Dental health is important - brush teeth regularly or use dental treats.",
        "Monitor for signs of illness: lethargy, loss of appetite, coughing, or vomiting.",
        "Spay/neuter your dog to prevent health and behavioral issues."
      ]
    },
    {
      icon: Home,
      title: "Creating a Safe Environment",
      content: [
        "Provide a comfortable bed, crate for training, and safe spaces to retreat.",
        "Remove hazards: secure electrical cords, chemicals, and small objects.",
        "Ensure your yard is securely fenced to prevent escapes.",
        "Temperature control is important - avoid extreme heat or cold.",
        "Keep identification tags and microchip information updated."
      ]
    }
  ];

  const catCareTopics = [
    {
      icon: Utensils,
      title: "Nutrition & Feeding",
      content: [
        "Feed high-quality cat food with proper protein and nutrients.",
        "Cats are obligate carnivores - meat should be the main ingredient.",
        "Most adult cats thrive on 2 meals per day; kittens need 3-4 meals.",
        "Always provide fresh water; consider a cat water fountain for hydration.",
        "Avoid toxic foods: chocolate, garlic, onions, and certain plants."
      ]
    },
    {
      icon: Activity,
      title: "Enrichment & Play",
      content: [
        "Provide interactive toys like feather wands, balls, and laser pointers.",
        "Cats need 10-15 minutes of active play sessions, multiple times daily.",
        "Climbing trees and shelves satisfy their natural instincts.",
        "Scratching posts protect furniture and provide good exercise.",
        "Window perches allow cats to observe the outdoors safely."
      ]
    },
    {
      icon: Pill,
      title: "Health & Veterinary Care",
      content: [
        "Schedule annual vet checkups; kittens and seniors need more visits.",
        "Keep vaccinations and parasite prevention current.",
        "Dental health is crucial - brush teeth or use dental treats regularly.",
        "Watch for changes in behavior, appetite, or litter box use.",
        "Spay/neuter your cat by 5-6 months of age."
      ]
    },
    {
      icon: Home,
      title: "Creating a Safe Environment",
      content: [
        "Provide fresh litter boxes (1 more than the number of cats).",
        "Ensure proper ventilation and litter box placement for privacy.",
        "Provide hiding spots and vertical spaces for security.",
        "Keep toxic plants out of reach: lilies, poinsettias, and philodendrons.",
        "Secure windows and balconies to prevent falls and escapes."
      ]
    }
  ];

  const generalTips = [
    {
      icon: Heart,
      title: "Emotional Care & Bonding",
      description: "Spend quality time with your pet, offer praise, and build a loving relationship through positive interaction."
    },
    {
      icon: Droplets,
      title: "Grooming & Hygiene",
      description: "Regular grooming keeps your pet healthy. Bathe them appropriately, trim nails, and maintain their coat."
    },
    {
      icon: Zap,
      title: "Training & Behavior",
      description: "Start training early with positive reinforcement. Consistent boundaries and patience lead to well-behaved pets."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Pet Care Guide</h1>
          <p className="text-gray-600 text-lg">Essential tips for giving your new pet the best care possible</p>
        </div>

        {/* General Tips Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">General Pet Care Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {generalTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600">
                    {tip.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Dog Care Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🐕 Dog Care Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dogCareTopics.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 flex items-start gap-2">
                            <span className="text-amber-500 mt-1 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Cat Care Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🐱 Cat Care Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {catCareTopics.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 flex items-start gap-2">
                            <span className="text-pink-500 mt-1 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Important Notice */}
        <Card className="p-6 bg-blue-50 border-blue-200 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Important Reminder
              </h3>
              <p className="text-blue-800">
                Every pet is unique and may have specific needs based on their age, breed, health status, and personality. This guide provides general recommendations. Always consult with your veterinarian for personalized advice about your pet's health and care. If you have concerns about your pet's behavior or health, reach out to your vet or the adoption NGO for guidance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
