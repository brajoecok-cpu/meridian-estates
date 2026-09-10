'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '@/lib/types';

interface ComparisonContextType {
  selectedProperties: Property[];
  toggleProperty: (property: Property) => void;
  clearComparison: () => void;
  isInComparison: (slug: string) => boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from sessionStorage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('meridian_comparison');
      if (saved) setSelectedProperties(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleProperty = (property: Property) => {
    setSelectedProperties((prev) => {
      const exists = prev.some((p) => p.slug === property.slug);
      let updated: Property[];
      if (exists) {
        updated = prev.filter((p) => p.slug !== property.slug);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 trophy residences simultaneously.');
          return prev;
        }
        updated = [...prev, property];
      }
      try {
        sessionStorage.setItem('meridian_comparison', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearComparison = () => {
    setSelectedProperties([]);
    try {
      sessionStorage.removeItem('meridian_comparison');
    } catch {}
  };

  const isInComparison = (slug: string) => {
    return selectedProperties.some((p) => p.slug === slug);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedProperties,
        toggleProperty,
        clearComparison,
        isInComparison,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
