import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};