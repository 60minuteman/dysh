import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ExploreCategory } from '../services/api';

interface ExploreContextType {
  category: ExploreCategory;
  setCategory: (category: ExploreCategory) => void;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<ExploreCategory>('thirty-min-meals');

  return (
    <ExploreContext.Provider value={{ category, setCategory }}>
      {children}
    </ExploreContext.Provider>
  );
}

export function useExploreContext() {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error('useExploreContext must be used within an ExploreProvider');
  }
  return context;
} 