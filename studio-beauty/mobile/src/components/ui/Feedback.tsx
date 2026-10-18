import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { errorCode } from '@/lib/errors';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

export function Loading() {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.center}>
      <Icon name="warning" size={28} color="textMuted" />
      <Text variant="body" color="textMuted" align="center">
        {t(`errors.${errorCode(error)}`)}
      </Text>
      {onRetry && <Button title={t('common.retry')} variant="outline" size="md" onPress={onRetry} />}
    </View>
  );
}

export function EmptyState({ icon = 'sparkles', title, action }: { icon?: IconName; title: string; action?: { label: string; onPress: () => void } }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.empty, { borderColor: colors.border }]}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
        <Icon name={icon} size={22} color="primary" />
      </View>
      <Text variant="body" color="textMuted" align="center">
        {title}
      </Text>
      {action && <Button title={action.label} size="md" variant="secondary" onPress={action.onPress} />}
    </View>
  );
}

export function Banner({ tone, text }: { tone: 'info' | 'warning' | 'danger' | 'success'; text: string }) {
  const { colors } = useTheme();
  const map = {
    info: [colors.accentSoft, 'accent', 'info'],
    warning: [colors.warningSoft, 'warning', 'warning'],
    danger: [colors.dangerSoft, 'danger', 'warning'],
    success: [colors.successSoft, 'success', 'checkCircle'],
  } as const;
  const [bg, fg, icon] = map[tone];
  return (
    <View style={[styles.banner, { backgroundColor: bg }]} accessibilityRole="alert">
      <Icon name={icon} size={18} color={fg} />
      <Text variant="small" color="text" style={{ flex: 1 }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.xxl, minHeight: 160 },
  empty: { alignItems: 'center', gap: space.md, padding: space.xxl, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed' },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  banner: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', padding: space.md, borderRadius: radius.md },
});
