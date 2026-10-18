import { getLocales } from 'expo-localization';
import i18n, { DEFAULT_LANGUAGE } from '@/i18n';
import { preferences } from '@/lib/preferences';
import { supabase } from '@/lib/supabase';
import type { AppLanguage } from '@/types/database';

/** Saved choice → Macedonian devices get Macedonian → Albanian (studio default). */
export async function initLanguage() {
  const saved = await preferences.getLanguage();
  const device = getLocales()[0]?.languageCode;
  const lang: AppLanguage = saved ?? (device === 'mk' ? 'mk' : DEFAULT_LANGUAGE);
  if (i18n.language !== lang) await i18n.changeLanguage(lang);
}

export async function setLanguage(lang: AppLanguage, userId?: string) {
  await i18n.changeLanguage(lang);
  await preferences.setLanguage(lang);
  if (userId) {
    // Push notifications are sent in the profile language.
    await supabase.from('profiles').update({ language: lang }).eq('id', userId);
  }
}
