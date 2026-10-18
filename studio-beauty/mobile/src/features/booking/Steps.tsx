import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const labels = [t('booking.stepService'), t('booking.stepTime'), t('booking.stepConfirm')];
  return (
    <View style={styles.row} accessibilityLabel={`${current}/3 ${labels[current - 1]}`}>
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n <= current;
        return (
          <View key={l} style={styles.step}>
            <View style={[styles.bar, { backgroundColor: active ? colors.primary : colors.border }]} />
            <Text variant="caption" color={n === current ? 'text' : 'textSubtle'} numberOfLines={1}>
              {l}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  step: { flex: 1, gap: space.xs },
  bar: { height: 3, borderRadius: 2 },
});
