import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import { env } from '@/lib/env';
import type { BusinessSettings } from '@/types/database';

export function openDirections(s: Pick<BusinessSettings, 'studio_name' | 'address' | 'latitude' | 'longitude'>) {
  const q = encodeURIComponent(s.address ? `${s.studio_name}, ${s.address}` : s.studio_name);
  const ll = s.latitude != null && s.longitude != null ? `&ll=${s.latitude},${s.longitude}` : '';
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?q=${q}${ll}`
      : `https://www.google.com/maps/search/?api=1&query=${ll ? `${s.latitude},${s.longitude}` : q}`;
  void Linking.openURL(url);
}

export function callNumber(e164: string) {
  void Linking.openURL(`tel:${e164}`);
}

export async function openInstagram(username: string) {
  const app = `instagram://user?username=${username}`;
  if (await Linking.canOpenURL(app).catch(() => false)) return Linking.openURL(app);
  return WebBrowser.openBrowserAsync(`https://instagram.com/${username}`);
}

export function openWebPage(page: 'privacy' | 'support' | 'delete-account', lang: string) {
  return WebBrowser.openBrowserAsync(`${env.webUrl}/${page}?lang=${lang}`);
}
