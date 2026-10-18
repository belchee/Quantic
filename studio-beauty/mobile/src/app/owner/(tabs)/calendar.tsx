import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useOwnerBookings } from '@/api/owner';
import { useBusinessToday, useBusinessSettings, useWorkingHours } from '@/api/settings';
import { Card, ErrorState, Icon, Loading, Pressable, Screen, Segmented, Text } from '@/components/ui';
import { resolveHours } from '@/features/hours';
import { DayNav } from '@/features/owner/DayNav';
import { DayTimeline } from '@/features/owner/DayTimeline';
import { useFormat } from '@/i18n/format';
import { addDays, isoWeekday, parts, startOfWeek } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

export default function OwnerCalendar() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const today = useBusinessToday();
  const settings = useBusinessSettings();
  const hours = useWorkingHours();
  const [mode, setMode] = useState<'week' | 'day'>('week');
  const [anchor, setAnchor] = useState<string | undefined>();
  const current = anchor ?? today.data;
  const weekStart = current ? startOfWeek(current) : undefined;
  const weekEnd = weekStart ? addDays(weekStart, 6) : undefined;
  const bookings = useOwnerBookings(weekStart, weekEnd);

  if (!current || !today.data || !weekStart || !weekEnd) return <Loading />;
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const resolved = settings.data && hours.data ? resolveHours(settings.data, hours.data) : [];
  const capacityPerDay = (d: string) => {
    const h = resolved.find((r) => r.weekday === isoWeekday(d));
    if (!h?.open || !h.close || !settings.data) return 0;
    const [oh, om] = h.open.split(':').map(Number) as [number, number];
    const [ch, cm] = h.close.split(':').map(Number) as [number, number];
    return Math.floor((ch * 60 + cm - oh * 60 - om) / settings.data.slot_minutes) * settings.data.slot_capacity;
  };

  return (
    <Screen refreshing={bookings.isRefetching} onRefresh={() => void bookings.refetch()}>
      <View style={{ gap: space.xl }}>
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'week', label: t('owner.weekView') },
            { value: 'day', label: t('owner.dayView') },
          ]}
        />

        {mode === 'day' ? (
          <>
            <DayNav day={current} today={today.data} onChange={setAnchor} />
            <DayTimeline day={current} />
          </>
        ) : (
          <>
            <View style={styles.weekNav}>
              <Pressable haptic="selection" onPress={() => setAnchor(addDays(weekStart, -7))} style={[styles.navBtn, { backgroundColor: colors.surfaceMuted }]} accessibilityLabel="previous week">
                <Icon name="chevronLeft" size={16} />
              </Pressable>
              <Pressable haptic="selection" onPress={() => setAnchor(today.data)} style={{ flex: 1 }}>
                <Text variant="subheading" align="center">
                  {f.dayMonth(weekStart)} – {f.dayMonth(weekEnd)}
                </Text>
              </Pressable>
              <Pressable haptic="selection" onPress={() => setAnchor(addDays(weekStart, 7))} style={[styles.navBtn, { backgroundColor: colors.surfaceMuted }]} accessibilityLabel="next week">
                <Icon name="chevronRight" size={16} />
              </Pressable>
            </View>

            {bookings.isPending ? (
              <Loading />
            ) : bookings.isError ? (
              <ErrorState error={bookings.error} onRetry={() => void bookings.refetch()} />
            ) : (
              days.map((d) => {
                const list = bookings.data.filter((b) => b.local_date === d && b.status !== 'cancelled');
                const cap = capacityPerDay(d);
                const fill = cap ? Math.min(list.length / cap, 1) : 0;
                const isToday = d === today.data;
                return (
                  <Pressable
                    key={d}
                    scaleTo={0.99}
                    onPress={() => {
                      setAnchor(d);
                      setMode('day');
                    }}
                  >
                    <Card style={[styles.dayCard, isToday && { borderColor: colors.primary, borderWidth: 1 }]}>
                      <View style={[styles.dateBox, { backgroundColor: isToday ? colors.primary : colors.surfaceMuted }]}>
                        <Text variant="caption" style={{ color: isToday ? colors.onPrimary : colors.textMuted }}>
                          {f.weekdaysShort[isoWeekday(d) - 1]}
                        </Text>
                        <Text variant="heading" style={{ color: isToday ? colors.onPrimary : colors.text }}>
                          {parts(d).day}
                        </Text>
                      </View>
                      <View style={{ flex: 1, gap: space.xs }}>
                        <Text variant="bodyStrong">{cap === 0 ? t('owner.closedDay') : t('owner.bookingsCount', { n: list.length })}</Text>
                        {list.length > 0 && (
                          <Text variant="caption" color="textMuted" numberOfLines={1}>
                            {list.slice(0, 4).map((b) => `${b.local_time} ${b.client_name.split(' ')[0]}`).join(' · ')}
                          </Text>
                        )}
                        {cap > 0 && (
                          <View style={[styles.bar, { backgroundColor: colors.surfaceMuted }]}>
                            <View style={[styles.barFill, { width: `${fill * 100}%`, backgroundColor: fill >= 1 ? colors.danger : colors.primary }]} />
                          </View>
                        )}
                      </View>
                      <Icon name="chevronRight" size={14} color="textSubtle" />
                    </Card>
                  </Pressable>
                );
              })
            )}
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  weekNav: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  navBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dayCard: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  dateBox: { width: 52, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  bar: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  barFill: { height: 4, borderRadius: 2 },
});
