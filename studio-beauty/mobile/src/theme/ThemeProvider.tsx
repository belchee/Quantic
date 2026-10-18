import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { preferences, type ThemePreference } from '@/lib/preferences';
import { palettes, type Colors } from './tokens';

interface ThemeContextValue {
  colors: Colors;
  scheme: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPref] = useState<ThemePreference>('system');

  useEffect(() => {
    void preferences.getTheme().then(setPref);
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    setPref(p);
    void preferences.setTheme(p);
  }, []);

  const scheme: 'light' | 'dark' = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({ colors: palettes[scheme], scheme, preference, setPreference }),
    [scheme, preference, setPreference],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
