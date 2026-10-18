import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon, Pressable, Text } from '@/components/ui';
import { useFormat } from '@/i18n/format';
import { addDays } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

export function DayNav({ day, today, onChange }: { day: string; today: string; onChange: (d: string) => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  return (
    <View style={styles.row}>
      <Pressable haptic="selection" onPress={() => onChange(addDays(day, -1))} style={[styles.btn, { backgroundColor: colors.surfaceMuted }]} accessibilityLabel="previous day">
        <Icon name="chevronLeft" size={16} />
      </Pressable>
      <Pressable haptic="selection" onPress={() => onChange(today)} style={{ flex: 1, alignItems: 'center' }}>
        <Text variant="subheading" align="center">
          {f.relativeDate(day, today)}
        </Text>
        {day !== today && (
          <Text variant="caption" color="primary">
            {t('common.today')}
          </Text>
        )}
      </Pressable>
      <Pressable haptic="selection" onPress={() => onChange(addDays(day, 1))} style={[styles.btn, { backgroundColor: colors.surfaceMuted }]} accessibilityLabel="next day">
        <Icon name="chevronRight" size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  btn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
