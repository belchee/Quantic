import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import type { BookingStatus } from '@/types/database';
import { Text } from './Text';

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [bg, fg] = {
    confirmed: [colors.successSoft, colors.success],
    cancelled: [colors.surfaceMuted, colors.textMuted],
    completed: [colors.accentSoft, colors.accent],
    no_show: [colors.dangerSoft, colors.danger],
  }[status];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text variant="caption" style={{ color: fg }}>
        {t(`appointments.status.${status}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: space.sm + 2, paddingVertical: 3, borderRadius: radius.pill },
});
