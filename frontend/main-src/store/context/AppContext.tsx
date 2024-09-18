// src > store > context > AppContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);


    return (
        <AppContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            {children}
        </AppContext.Provider>
    );
};
