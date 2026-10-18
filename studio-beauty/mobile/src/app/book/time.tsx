import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAvailability, useCalendar } from '@/api/availability';
import { useServices } from '@/api/services';
import { useBusinessSettings, useBusinessToday } from '@/api/settings';
import { Banner, Button, EmptyState, ErrorState, Loading, Screen, Text } from '@/components/ui';
import { MonthCalendar } from '@/features/booking/MonthCalendar';
import { SlotGrid, SlotLegend } from '@/features/booking/SlotGrid';
import { Steps } from '@/features/booking/Steps';
import { useFormat } from '@/i18n/format';
import { addDays, firstOfMonth, lastOfMonth } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';
import type { AvailabilitySlot } from '@/types/database';

/** Booking step 2 — pick a day (closed/blocked/full days disabled) and a live slot. */
export default function PickTime() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const services = useServices();
  const service = services.data?.find((s) => s.id === serviceId);
  const settings = useBusinessSettings();
  const todayQ = useBusinessToday();
  const today = todayQ.data;

  const lastDay = today && settings.data ? addDays(today, settings.data.booking_window_days) : undefined;
  const [month, setMonth] = useState<string | undefined>();
  const visibleMonth = month ?? today;
  const range = useMemo(() => {
    if (!visibleMonth || !today || !lastDay) return { from: undefined, to: undefined };
    const from = firstOfMonth(visibleMonth) < today ? today : firstOfMonth(visibleMonth);
    const to = lastOfMonth(visibleMonth) > lastDay ? lastDay : lastOfMonth(visibleMonth);
    return from <= to ? { from, to } : { from: undefined, to: undefined };
  }, [visibleMonth, today, lastDay]);
  const calendar = useCalendar(range.from, range.to);

  const [pickedDay, setDay] = useState<string | undefined>();
  const [pickedSlot, setSlot] = useState<AvailabilitySlot | undefined>();

  // Default to the first bookable day of the visible month.
  const day = pickedDay ?? (calendar.data ? [...calendar.data.values()].find((d) => d.status === 'available')?.day : undefined);
  const availability = useAvailability(day);

  // Live: a selected slot that just became full/unavailable is no longer selected.
  const fresh = pickedSlot && availability.data?.find((s) => s.slot_start === pickedSlot.slot_start);
  const slot = fresh && (fresh.status === 'available' || fresh.status === 'limited') ? fresh : undefined;

  if (!today || !settings.data || !lastDay || !visibleMonth) {
    return todayQ.isError || settings.isError ? <ErrorState error={todayQ.error ?? settings.error} /> : <Loading />;
  }

  const bookable = availability.data?.filter((s) => s.status === 'available' || s.status === 'limited') ?? [];
  const shown = availability.data?.filter((s) => s.status !== 'blocked' && s.status !== 'unavailable') ?? [];

  return (
    <Screen
      footer={
        <Button
          title={slot ? `${t('common.continue')} · ${slot.local_time}` : t('common.continue')}
          disabled={!slot || !day}
          onPress={() =>
            slot &&
            day &&
            router.push({
              pathname: '/book/confirm',
              params: { serviceId, slotStart: slot.slot_start, localDate: day, localTime: slot.local_time },
            })
          }
        />
      }
    >
      <View style={{ gap: space.xl }}>
        <Steps current={2} />
        {service && (
          <Text variant="small" color="textMuted">
            {f.serviceName(service)}
            {service.price_mkd != null ? ` · ${f.price(service.price_mkd)}` : ''}
          </Text>
        )}

        <MonthCalendar
          month={visibleMonth}
          onMonthChange={(m) => {
            setMonth(m);
            setDay(undefined);
            setSlot(undefined);
          }}
          minMonth={today}
          maxMonth={lastDay}
          selected={day}
          onSelect={(d) => {
            setDay(d);
            setSlot(undefined);
          }}
          days={calendar.data}
          today={today}
        />

        {day && (
          <View style={{ gap: space.md }}>
            <View style={styles.slotHead}>
              <Text variant="heading" style={{ flex: 1 }}>
                {f.relativeDate(day, today)}
              </Text>
              <View style={[styles.live, { backgroundColor: colors.successSoft }]}>
                <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
                <Text variant="caption" color="success">
                  {t('booking.live')}
                </Text>
              </View>
            </View>
            <SlotLegend />
            {availability.isPending ? (
              <Loading />
            ) : availability.isError ? (
              <ErrorState error={availability.error} onRetry={() => void availability.refetch()} />
            ) : shown.length === 0 ? (
              <EmptyState icon="moon" title={t('booking.dayClosed')} />
            ) : (
              <>
                {bookable.length === 0 && <Banner tone="info" text={t('booking.noSlots')} />}
                <SlotGrid slots={availability.data} selected={slot?.slot_start} onSelect={setSlot} />
              </>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  slotHead: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: 99 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
});
