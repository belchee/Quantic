import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

interface Props extends ViewProps {
  tone?: 'surface' | 'muted' | 'primary' | 'accent';
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ tone = 'surface', padded = true, elevated = false, style, ...rest }: Props) {
  const { colors, scheme } = useTheme();
  const bg = { surface: colors.surface, muted: colors.surfaceMuted, primary: colors.primarySoft, accent: colors.accentSoft }[tone];
  return (
    <View
      {...rest}
      style={[
        styles.card,
        { backgroundColor: bg, borderColor: tone === 'surface' ? colors.border : 'transparent' },
        padded && { padding: space.lg },
        elevated &&
          scheme === 'light' && {
            shadowColor: colors.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
          },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth },
});
