import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCancelBooking } from '@/api/bookings';
import { useSetBookingStatus } from '@/api/owner';
import { useToast } from '@/components/ui';
import { callNumber } from '@/features/studio';
import { showActionSheet, type SheetAction } from '@/lib/actionSheet';
import { errorCode } from '@/lib/errors';
import type { OwnerBookingRow } from '@/types/database';

/** Owner actions for one booking: call, completed, no-show, restore, cancel. */
export function useBookingActions() {
  const { t } = useTranslation();
  const toast = useToast();
  const setStatus = useSetBookingStatus();
  const cancel = useCancelBooking();

  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    try {
      await fn();
      if (ok) toast(ok);
    } catch (e) {
      toast(t(`errors.${errorCode(e)}`), 'error');
    }
  };

  return (b: OwnerBookingRow, serviceLabel: string) => {
    const actions: SheetAction[] = [];
    if (b.client_phone) actions.push({ label: `${t('owner.call')} ${b.client_phone}`, onPress: () => callNumber(b.client_phone!) });
    if (b.status === 'confirmed') {
      actions.push({ label: t('owner.markCompleted'), onPress: () => void run(() => setStatus.mutateAsync({ id: b.id, status: 'completed' })) });
      actions.push({ label: t('owner.markNoShow'), onPress: () => void run(() => setStatus.mutateAsync({ id: b.id, status: 'no_show' })) });
      actions.push({
        label: t('owner.cancelBooking'),
        destructive: true,
        onPress: () =>
          Alert.alert(t('owner.cancelBooking'), t('owner.cancelBookingBody'), [
            { text: t('appointments.keep'), style: 'cancel' },
            {
              text: t('appointments.cancelConfirm'),
              style: 'destructive',
              onPress: () => void run(() => cancel.mutateAsync(b.id), t('appointments.cancelled')),
            },
          ]),
      });
    } else if (b.status === 'completed' || b.status === 'no_show') {
      actions.push({ label: t('owner.restore'), onPress: () => void run(() => setStatus.mutateAsync({ id: b.id, status: 'confirmed' })) });
    }
    showActionSheet(`${b.client_name} · ${b.local_time}`, actions, t('common.close'), [serviceLabel, b.notes].filter(Boolean).join('\n'));
  };
}
