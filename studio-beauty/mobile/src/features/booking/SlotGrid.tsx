import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import type { AvailabilitySlot } from '@/types/database';

interface Props {
  slots: AvailabilitySlot[];
  selected: string | undefined; // slot_start ISO
  onSelect: (slot: AvailabilitySlot) => void;
}

/** Customer slot picker: Available (n left) · 1 left · Full. Blocked / too-soon slots are hidden. */
export function SlotGrid({ slots, selected, onSelect }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const visible = slots.filter((s) => s.status === 'available' || s.status === 'limited' || s.status === 'full');

  return (
    <View style={styles.grid}>
      {visible.map((s, i) => {
        const full = s.status === 'full';
        const isSelected = s.slot_start === selected;
        const last = s.remaining === 1;
        const label = full ? t('booking.full') : last ? t('booking.oneLeft') : t('booking.spotsLeft', { n: s.remaining });
        return (
          <Animated.View key={s.slot_start} entering={FadeInDown.delay(Math.min(i, 12) * 18).duration(220)} style={styles.cellWrap}>
            <Pressable
              haptic="selection"
              disabled={full}
              onPress={() => onSelect(s)}
              accessibilityLabel={`${s.local_time}, ${label}`}
              accessibilityState={{ selected: isSelected, disabled: full }}
              style={[
                styles.cell,
                {
                  backgroundColor: isSelected ? colors.primary : full ? colors.surfaceMuted : colors.surface,
                  borderColor: isSelected ? colors.primary : last ? colors.warning : colors.border,
                },
              ]}
            >
              <Text
                variant="bodyStrong"
                style={{
                  color: isSelected ? colors.onPrimary : full ? colors.textSubtle : colors.text,
                  textDecorationLine: full ? 'line-through' : 'none',
                }}
              >
                {s.local_time}
              </Text>
              <Text
                variant="caption"
                style={{ color: isSelected ? colors.onPrimary : full ? colors.textSubtle : last ? colors.warning : colors.success }}
              >
                {label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}

export function SlotLegend() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const items = [
    [colors.success, t('booking.legendAvailable')],
    [colors.warning, t('booking.legendLimited')],
    [colors.textSubtle, t('booking.legendFull')],
  ] as const;
  return (
    <View style={styles.legend}>
      {items.map(([c, l]) => (
        <View key={l} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: c }]} />
          <Text variant="caption" color="textMuted">
            {l}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -space.xs },
  cellWrap: { width: '33.333%', padding: space.xs },
  cell: { borderWidth: 1, borderRadius: radius.md, paddingVertical: space.md, alignItems: 'center', gap: 2 },
  legend: { flexDirection: 'row', gap: space.lg, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
});
