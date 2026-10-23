// ==============================================================================
// LIMO PLATFORM — THEME CONTEXT
// Light/Dark Theme management with persistent storage
// ==============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeType, AppThemeColors } from '@/constants/theme';
import { safeStorage, StorageKeys } from '@/lib/storage';

interface ThemeContextType {
  theme: ThemeType;
  colors: AppThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('light');

  useEffect(() => {
    safeStorage.getItem<ThemeType | null>(StorageKeys.THEME_PREFERENCE, null).then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
      } else if (systemScheme === 'dark') {
        setThemeState('dark');
      }
    });
  }, [systemScheme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    safeStorage.setItem(StorageKeys.THEME_PREFERENCE, newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
