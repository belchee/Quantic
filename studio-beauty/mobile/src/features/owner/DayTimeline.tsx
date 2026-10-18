import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAvailability } from '@/api/availability';
import { useOwnerBookings } from '@/api/owner';
import { useServices } from '@/api/services';
import { useBusinessSettings } from '@/api/settings';
import { EmptyState, ErrorState, Icon, Loading, Pressable, StatusBadge, Text } from '@/components/ui';
import { useNow } from '@/hooks/useNow';
import { useFormat } from '@/i18n/format';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import type { OwnerBookingRow } from '@/types/database';
import { useBookingActions } from './useBookingActions';

interface Row {
  slot_start: string;
  local_time: string;
  capacity: number;
  blocked: boolean;
  bookings: OwnerBookingRow[];
}

/** All slots of one day with who is booked; free seats open "new booking". */
export function DayTimeline({ day }: { day: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const slots = useAvailability(day);
  const bookings = useOwnerBookings(day, day);
  const services = useServices({ includeInactive: true });
  const openActions = useBookingActions();
  const settings = useBusinessSettings();
  const now = useNow(60_000);

  if (slots.isPending || bookings.isPending) return <Loading />;
  if (slots.isError || bookings.isError) return <ErrorState error={slots.error ?? bookings.error} onRetry={() => { void slots.refetch(); void bookings.refetch(); }} />;

  const active = bookings.data.filter((b) => b.status !== 'cancelled');
  const rows = new Map<string, Row>();
  for (const s of slots.data) {
    rows.set(s.slot_start, { slot_start: s.slot_start, local_time: s.local_time, capacity: s.capacity, blocked: s.status === 'blocked', bookings: [] });
  }
  for (const b of active) {
    const key = new Date(b.slot_start).toISOString();
    const match = [...rows.values()].find((r) => new Date(r.slot_start).toISOString() === key);
    if (match) match.bookings.push(b);
    else rows.set(b.slot_start, { slot_start: b.slot_start, local_time: b.local_time, capacity: 0, blocked: false, bookings: [b] });
  }
  const list = [...rows.values()].sort((a, b) => a.slot_start.localeCompare(b.slot_start));
  const slotMs = (settings.data?.slot_minutes ?? 30) * 60_000;

  if (list.length === 0) return <EmptyState icon="moon" title={t('owner.closedDay')} />;

  const serviceName = (id: string | null) => f.serviceName(services.data?.find((s) => s.id === id));

  return (
    <View style={{ gap: space.sm }}>
      {list.map((r) => {
        const past = new Date(r.slot_start).getTime() + slotMs < now;
        const free = Math.max(r.capacity - r.bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'no_show').length, 0);
        return (
          <View key={r.slot_start} style={[styles.row, { opacity: past && r.bookings.length === 0 ? 0.45 : 1 }]}>
            <View style={styles.timeCol}>
              <Text variant="smallStrong" color={past ? 'textSubtle' : 'text'}>
                {r.local_time}
              </Text>
            </View>
            <View style={[styles.seats, { borderLeftColor: r.bookings.length ? colors.primary : colors.border }]}>
              {r.bookings.map((b) => (
                <Pressable key={b.id} scaleTo={0.99} onPress={() => openActions(b, serviceName(b.service_id))} style={[styles.booking, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="bodyStrong" numberOfLines={1}>
                      {b.client_name || '—'}
                      {b.is_guest ? (
                        <Text variant="caption" color="textSubtle">
                          {'  '}
                          {t('owner.guest')}
                        </Text>
                      ) : null}
                    </Text>
                    <Text variant="caption" color="textMuted" numberOfLines={1}>
                      {[serviceName(b.service_id), b.client_phone].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                  {b.status !== 'confirmed' ? <StatusBadge status={b.status} /> : <Icon name="phone" size={16} color="primary" />}
                </Pressable>
              ))}
              {r.blocked ? (
                <View style={[styles.free, { backgroundColor: colors.surfaceMuted }]}>
                  <Icon name="freeTime" size={14} color="textSubtle" />
                  <Text variant="caption" color="textSubtle">
                    {t('booking.blocked')}
                  </Text>
                </View>
              ) : (
                !past &&
                Array.from({ length: free }).map((_, i) => (
                  <Pressable
                    key={i}
                    haptic="selection"
                    onPress={() => router.push({ pathname: '/owner/new-booking', params: { date: day, slotStart: r.slot_start } })}
                    style={[styles.free, { borderColor: colors.border, borderStyle: 'dashed', borderWidth: 1 }]}
                    accessibilityLabel={`${t('owner.newBooking')} ${r.local_time}`}
                  >
                    <Icon name="plus" size={14} color="textSubtle" />
                    <Text variant="caption" color="textSubtle">
                      {t('owner.free')}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.md },
  timeCol: { width: 48, paddingTop: space.md },
  seats: { flex: 1, gap: space.xs, borderLeftWidth: 2, paddingLeft: space.md, paddingVertical: space.xs },
  booking: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  free: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.md },
});
