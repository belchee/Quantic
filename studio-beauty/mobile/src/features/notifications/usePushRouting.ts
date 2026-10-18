import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { registerForPush } from './push';

/** Registers the device silently when permission exists and routes notification taps. */
export function usePushRouting() {
  const { session, isOwner } = useAuth();
  const uid = session?.user.id;

  useEffect(() => {
    if (!uid) return;
    // Owner is asked right away (she needs booking alerts); customers after their first booking.
    void registerForPush({ prompt: isOwner }).catch(() => undefined);
  }, [uid, isOwner]);

  const last = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const url = last?.notification.request.content.data?.url;
    if (typeof url === 'string' && url.startsWith('/')) {
      router.push(url as never);
    }
  }, [last]);
}
