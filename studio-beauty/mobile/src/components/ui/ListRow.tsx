import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, type ColorName } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

interface RowProps {
  icon?: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  tone?: ColorName;
  right?: ReactNode;
  last?: boolean;
  chevron?: boolean;
}

export function ListRow({ icon, label, value, onPress, tone = 'text', right, last, chevron = !!onPress }: RowProps) {
  const { colors } = useTheme();
  const content = (
    <View style={[styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: colors.surfaceMuted }]}>
          <Icon name={icon} size={17} color={tone === 'text' ? 'primary' : tone} />
        </View>
      )}
      <Text variant="body" color={tone} style={{ flex: 1 }} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text variant="small" color="textMuted" numberOfLines={1} style={{ maxWidth: '50%' }}>
          {value}
        </Text>
      ) : null}
      {right}
      {chevron && <Icon name="chevronRight" size={14} color="textSubtle" />}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} haptic="selection" scaleTo={0.99} accessibilityLabel={value ? `${label}, ${value}` : label}>
      {content}
    </Pressable>
  );
}

export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      {title && (
        <Text variant="overline" color="textMuted" style={{ marginLeft: space.xs }}>
          {title}
        </Text>
      )}
      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md + 2, paddingHorizontal: space.lg, minHeight: 54 },
  iconWrap: { width: 32, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  group: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
});
