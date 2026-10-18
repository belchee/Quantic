import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useCancelBooking, useMyBookings, type BookingWithDetails } from '@/api/bookings';
import { useBusinessSettings, useBusinessToday } from '@/api/settings';
import { Button, EmptyState, ErrorState, Loading, Screen, Segmented, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { addToCalendar } from '@/features/booking/addToCalendar';
import { AppointmentCard } from '@/features/booking/AppointmentCard';
import { useFormat } from '@/i18n/format';
import { errorCode } from '@/lib/errors';
import { useNow } from '@/hooks/useNow';
import { space } from '@/theme/tokens';

export default function Appointments() {
  const { t } = useTranslation();
  const f = useFormat();
  const toast = useToast();
  const { session } = useAuth();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const bookings = useMyBookings(session?.user.id);
  const settings = useBusinessSettings();
  const today = useBusinessToday();
  const cancel = useCancelBooking();
  const now = useNow();

  if (!session) {
    return (
      <Screen>
        <EmptyState icon="appointments" title={t('appointments.signInPrompt')} action={{ label: t('auth.signIn'), onPress: () => router.push('/auth/sign-in') }} />
      </Screen>
    );
  }

  const all = bookings.data ?? [];
  const upcoming = all
    .filter((b) => b.status === 'confirmed' && new Date(b.slot_start).getTime() > now)
    .sort((a, b) => a.slot_start.localeCompare(b.slot_start));
  const past = all.filter((b) => !upcoming.includes(b));
  const list = tab === 'upcoming' ? upcoming : past;

  const onCancel = async (b: BookingWithDetails) => {
    try {
      await cancel.mutateAsync(b.id);
      toast(t('appointments.cancelled'));
    } catch (e) {
      toast(t(`errors.${errorCode(e)}`), 'error');
    }
  };

  const onCalendar = async (b: BookingWithDetails) => {
    const s = settings.data;
    if (!s) return;
    const ok = await addToCalendar({
      title: `${s.studio_name} · ${f.serviceName(b.service)}`,
      startIso: b.slot_start,
      minutes: b.slot_minutes,
      location: s.address,
      timeZone: s.timezone,
    }).catch(() => false);
    if (ok) toast(t('booking.addedToCalendar'));
  };

  return (
    <Screen refreshing={bookings.isRefetching} onRefresh={() => void bookings.refetch()}>
      <View style={{ gap: space.lg }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'upcoming', label: `${t('appointments.upcoming')}${upcoming.length ? ` · ${upcoming.length}` : ''}` },
            { value: 'past', label: t('appointments.past') },
          ]}
        />
        {bookings.isPending ? (
          <Loading />
        ) : bookings.isError ? (
          <ErrorState error={bookings.error} onRetry={() => void bookings.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState
            icon="calendar"
            title={tab === 'upcoming' ? t('appointments.emptyUpcoming') : t('appointments.emptyPast')}
            action={tab === 'upcoming' ? { label: t('appointments.bookNow'), onPress: () => router.push('/services') } : undefined}
          />
        ) : (
          list.map((b, i) => (
            <Animated.View key={b.id} entering={FadeInDown.delay(i * 40)} layout={LinearTransition}>
              <AppointmentCard
                booking={b}
                now={now}
                today={today.data}
                cancelHours={settings.data?.cancel_hours ?? 2}
                cancelling={cancel.isPending && cancel.variables === b.id}
                onCancel={() => void onCancel(b)}
                onAddToCalendar={() => void onCalendar(b)}
              />
            </Animated.View>
          ))
        )}
        {tab === 'upcoming' && upcoming.length > 0 && (
          <Button title={t('home.bookCta')} variant="secondary" icon="book" onPress={() => router.push('/services')} />
        )}
      </View>
    </Screen>
  );
}
