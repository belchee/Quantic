import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppLanguage } from '@/types/database';

export type ThemePreference = 'system' | 'light' | 'dark';

const KEYS = {
  theme: 'pref.theme',
  language: 'pref.language',
  pushToken: 'pref.pushToken',
} as const;

async function get(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function set(key: string, value: string | null) {
  try {
    if (value === null) await AsyncStorage.removeItem(key);
    else await AsyncStorage.setItem(key, value);
  } catch {
    // non-critical
  }
}

export const preferences = {
  getTheme: async (): Promise<ThemePreference> => {
    const v = await get(KEYS.theme);
    return v === 'light' || v === 'dark' ? v : 'system';
  },
  setTheme: (v: ThemePreference) => set(KEYS.theme, v),
  getLanguage: async (): Promise<AppLanguage | null> => {
    const v = await get(KEYS.language);
    return v === 'sq' || v === 'mk' || v === 'en' ? v : null;
  },
  setLanguage: (v: AppLanguage) => set(KEYS.language, v),
  getPushToken: () => get(KEYS.pushToken),
  setPushToken: (v: string | null) => set(KEYS.pushToken, v),
};
