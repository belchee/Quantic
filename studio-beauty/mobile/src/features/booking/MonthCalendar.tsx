import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Icon, Pressable, Text } from '@/components/ui';
import { useFormat } from '@/i18n/format';
import { addMonths, firstOfMonth, monthGrid, monthKey, parts, type DateKey } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import type { CalendarDay } from '@/types/database';

interface Props {
  month: DateKey; // any day in the visible month
  onMonthChange: (month: DateKey) => void;
  minMonth: DateKey;
  maxMonth: DateKey;
  selected: DateKey | undefined;
  onSelect: (day: DateKey) => void;
  days: Map<string, CalendarDay> | undefined;
  today: DateKey;
  /** Owner mode: every day is selectable, status only decorates. */
  allSelectable?: boolean;
}

export function MonthCalendar({ month, onMonthChange, minMonth, maxMonth, selected, onSelect, days, today, allSelectable }: Props) {
  const { colors } = useTheme();
  const f = useFormat();
  const weeks = monthGrid(month);
  const canPrev = monthKey(month) > monthKey(minMonth);
  const canNext = monthKey(month) < monthKey(maxMonth);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Pressable
          haptic="selection"
          disabled={!canPrev}
          onPress={() => onMonthChange(addMonths(firstOfMonth(month), -1))}
          style={[styles.nav, { opacity: canPrev ? 1 : 0.25 }]}
          accessibilityLabel="previous month"
          hitSlop={8}
        >
          <Icon name="chevronLeft" size={16} color="text" />
        </Pressable>
        <Text variant="heading" accessibilityRole="header">
          {f.monthTitle(month)}
        </Text>
        <Pressable
          haptic="selection"
          disabled={!canNext}
          onPress={() => onMonthChange(addMonths(firstOfMonth(month), 1))}
          style={[styles.nav, { opacity: canNext ? 1 : 0.25 }]}
          accessibilityLabel="next month"
          hitSlop={8}
        >
          <Icon name="chevronRight" size={16} color="text" />
        </Pressable>
      </View>

      <View style={styles.week}>
        {f.weekdaysShort.map((d) => (
          <Text key={d} variant="caption" color="textSubtle" style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      <Animated.View key={monthKey(month)} entering={FadeIn.duration(180)}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((day, di) => {
              if (!day) return <View key={di} style={styles.cell} />;
              const info = days?.get(day);
              const bookable = allSelectable || info?.status === 'available';
              const isSelected = day === selected;
              const isToday = day === today;
              const dot =
                info?.status === 'available' && info.available_slots <= 4
                  ? colors.warning
                  : info?.status === 'available'
                    ? colors.success
                    : info?.status === 'full'
                      ? colors.danger
                      : undefined;
              return (
                <Pressable
                  key={day}
                  haptic="selection"
                  disabled={!bookable}
                  onPress={() => onSelect(day)}
                  accessibilityLabel={f.fullDate(day)}
                  accessibilityState={{ selected: isSelected, disabled: !bookable }}
                  style={styles.cell}
                >
                  <View
                    style={[
                      styles.day,
                      isSelected && { backgroundColor: colors.primary },
                      !isSelected && isToday && { borderColor: colors.primary, borderWidth: 1 },
                    ]}
                  >
                    <Text
                      variant="bodyStrong"
                      style={{
                        color: isSelected ? colors.onPrimary : bookable ? colors.text : colors.textSubtle,
                        opacity: bookable ? 1 : 0.5,
                      }}
                    >
                      {parts(day).day}
                    </Text>
                  </View>
                  <View style={[styles.dot, { backgroundColor: !isSelected && dot ? dot : 'transparent' }]} />
                </Pressable>
              );
            })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth, padding: space.md, gap: space.xs },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xs, paddingBottom: space.sm },
  nav: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row' },
  weekday: { flex: 1, textAlign: 'center', paddingVertical: space.xs },
  cell: { flex: 1, alignItems: 'center', paddingVertical: 3 },
  day: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});
