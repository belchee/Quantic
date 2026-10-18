import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import { preferences } from '@/lib/preferences';
import { supabase } from '@/lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function getPushPermission(): Promise<'granted' | 'denied' | 'undetermined'> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

/**
 * Asks for permission (if `prompt`) and registers this device's Expo push token
 * for the signed-in user. Safe to call repeatedly.
 */
export async function registerForPush(opts: { prompt: boolean }): Promise<boolean> {
  if (!Device.isDevice) return false;

  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted' && opts.prompt) {
    ({ status } = await Notifications.requestPermissionsAsync());
  }
  if (status !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Studio Beauty',
      importance: AndroidImportance.HIGH,
    });
  }

  const projectId =
    (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn('EAS projectId missing — set EAS_PROJECT_ID to enable push notifications.');
    return false;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  const { error } = await supabase.rpc('register_push_token', {
    p_token: token,
    p_platform: Platform.OS === 'android' ? 'android' : 'ios',
  });
  if (error) throw error;
  await preferences.setPushToken(token);
  return true;
}

export async function unregisterPushToken() {
  const token = await preferences.getPushToken();
  if (!token) return;
  try {
    await supabase.rpc('unregister_push_token', { p_token: token });
  } catch {
    // ignore — the dispatcher drops dead tokens anyway
  }
  await preferences.setPushToken(null);
}
