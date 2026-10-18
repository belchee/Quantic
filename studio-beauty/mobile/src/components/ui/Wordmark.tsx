import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';
import { Text } from './Text';

/**
 * Placeholder wordmark until the client supplies a logo:
 * "Studio" in an italic serif, "BEAUTY" in widely tracked caps, a fine rule between.
 */
export function Wordmark({ size = 'md', align = 'center' }: { size?: 'sm' | 'md' | 'lg'; align?: 'center' | 'left' }) {
  const { colors } = useTheme();
  const scale = { sm: 0.62, md: 1, lg: 1.35 }[size];
  return (
    <View
      style={[styles.wrap, { alignItems: align === 'center' ? 'center' : 'flex-start' }]}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Studio Beauty"
    >
      <Text style={{ fontFamily: fonts.displayItalic, fontSize: 40 * scale, lineHeight: 44 * scale, color: colors.text }}>
        Studio
      </Text>
      <View style={[styles.rule, { backgroundColor: colors.accent, width: 28 * scale, marginVertical: 5 * scale }]} />
      <Text
        style={{
          fontFamily: fonts.bodySemibold,
          fontSize: 11 * scale,
          letterSpacing: 6 * scale,
          color: colors.primary,
          marginLeft: align === 'center' ? 6 * scale : 0,
        }}
      >
        BEAUTY
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  rule: { height: StyleSheet.hairlineWidth * 2 },
});
