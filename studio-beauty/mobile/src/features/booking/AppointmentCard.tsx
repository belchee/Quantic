import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { BookingWithDetails } from '@/api/bookings';
import { Button, Card, StatusBadge, Text } from '@/components/ui';
import { useFormat } from '@/i18n/format';
import { addDays, addMinutesToTime, isoWeekday } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

interface Props {
  booking: BookingWithDetails;
  now: number;
  today: string | undefined;
  cancelHours: number;
  onCancel?: () => void;
  onAddToCalendar?: () => void;
  cancelling?: boolean;
}

/** Local wall-clock deadline for display only; the server enforces the real rule. */
function cancelDeadline(localDate: string, localTime: string, hours: number) {
  const [h, m] = localTime.split(':').map(Number) as [number, number];
  const total = h * 60 + m - hours * 60;
  const dayShift = Math.floor(total / 1440);
  const minutes = ((total % 1440) + 1440) % 1440;
  return { date: addDays(localDate, dayShift), time: addMinutesToTime('00:00', minutes) };
}

export function AppointmentCard({ booking, now, today, cancelHours, onCancel, onAddToCalendar, cancelling }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const upcoming = booking.status === 'confirmed' && new Date(booking.slot_start).getTime() > now;
  const canCancel = upcoming && new Date(booking.slot_start).getTime() - cancelHours * 3_600_000 > now;
  const deadline = cancelDeadline(booking.local_date, booking.local_time, cancelHours);

  const confirmCancel = () =>
    Alert.alert(
      t('appointments.cancelTitle'),
      t('appointments.cancelBody', { date: f.fullDate(booking.local_date), time: booking.local_time }),
      [
        { text: t('appointments.keep'), style: 'cancel' },
        { text: t('appointments.cancelConfirm'), style: 'destructive', onPress: onCancel },
      ],
    );

  return (
    <Card elevated={upcoming} style={{ gap: space.md, opacity: upcoming || booking.status === 'completed' ? 1 : 0.8 }}>
      <View style={styles.top}>
        <View style={[styles.dateBox, { backgroundColor: upcoming ? colors.primarySoft : colors.surfaceMuted }]}>
          <Text variant="heading" color={upcoming ? 'onPrimarySoft' : 'textMuted'}>
            {booking.local_date.slice(8, 10)}
          </Text>
          <Text variant="caption" color={upcoming ? 'onPrimarySoft' : 'textMuted'}>
            {f.weekdaysShort[isoWeekday(booking.local_date) - 1]}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="subheading">{f.relativeDate(booking.local_date, today)}</Text>
          <Text variant="body" color="textMuted">
            {booking.local_time} · {f.serviceName(booking.service)}
          </Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      {upcoming && (
        <>
          <Text variant="caption" color="textSubtle">
            {canCancel
              ? t('appointments.cancelUntil', { date: f.dayMonth(deadline.date), time: deadline.time })
              : t('appointments.cancelClosed')}
          </Text>
          <View style={styles.actions}>
            {onAddToCalendar && (
              <Button title={t('booking.addToCalendar')} icon="calendarAdd" variant="outline" size="sm" onPress={onAddToCalendar} style={{ flex: 1 }} />
            )}
            {canCancel && onCancel && (
              <Button title={t('appointments.cancel')} variant="danger" size="sm" loading={cancelling} onPress={confirmCancel} style={{ flex: 1 }} />
            )}
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dateBox: { width: 56, height: 60, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space.sm },
});
