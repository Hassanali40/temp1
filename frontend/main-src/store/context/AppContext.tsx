// src > store > context > AppContextTheme.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AppContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

// Create the context
export const AppContextTheme = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (isDarkMode) {
      // Light mode
      document.documentElement.classList.remove('dark');
    } else {
      // Dark mode
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);

  return <AppContextTheme.Provider value={{ isDarkMode, setIsDarkMode }}>{children}</AppContextTheme.Provider>;
};
