import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'lg' | 'sm';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export function Button({ title, onPress, variant = 'primary', size = 'lg', icon, loading, disabled, style, accessibilityHint }: Props) {
  const { colors } = useTheme();
  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: colors.primarySoft, fg: colors.onPrimarySoft, border: colors.primarySoft },
    outline: { bg: 'transparent', fg: colors.text, border: colors.borderStrong },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.dangerSoft },
  }[variant];
  const height = size === 'lg' ? 56 : size === 'md' ? 46 : 36;
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ busy: !!loading }}
      style={[
        styles.base,
        {
          height,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingHorizontal: size === 'sm' ? space.md : space.xl,
          opacity: disabled ? 0.45 : 1,
        },
        variant === 'primary' && { shadowColor: colors.shadow, shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {icon && <Icon name={icon} size={size === 'sm' ? 16 : 19} tint={palette.fg} />}
          <Text variant={size === 'sm' ? 'smallStrong' : 'bodyStrong'} style={{ color: palette.fg }} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
