'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const staticFaqs = [
  {
    id: "faq-1",
    question: "How does the pet adoption process work?",
    answer: "The process is simple: browse our available pets, click on a pet you're interested in, and fill out the adoption request form. The NGO or shelter caring for the pet will review your application and get in touch with you."
  },
  {
    id: "faq-2",
    question: "Is there an adoption fee?",
    answer: "Adoption fees vary depending on the NGO or shelter. The fee usually covers vaccinations, spaying/neutering, microchipping, and general care provided before adoption."
  },
  {
    id: "faq-3",
    question: "What are the requirements for adopting a pet?",
    answer: "Basic requirements include being at least 18 years old, having a stable living situation, and demonstrating the ability to provide a safe, loving home. Some NGOs might have additional specific requirements."
  },
  {
    id: "faq-4",
    question: "Can I return an adopted pet if it's not a good fit?",
    answer: "Yes, most NGOs require that you return the pet to them if things don't work out. We recommend a trial period and encourage open communication with the NGO to ensure a successful adoption."
  },
  {
    id: "faq-5",
    question: "Are the pets vaccinated and neutered?",
    answer: "Yes, you can see the vaccination and neuter status on each pet's profile. We encourage NGOs to ensure pets are healthy, vaccinated, and spayed/neutered before listing them for adoption."
  }
];

export default function FAQPage() {
  const [faqs] = useState(staticFaqs);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about our pet adoption platform</p>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Available</h2>
              <p className="text-gray-600">We're working on adding helpful FAQs. Check back soon!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}