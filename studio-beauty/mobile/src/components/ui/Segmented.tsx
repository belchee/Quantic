import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceMuted }]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            haptic="selection"
            scaleTo={0.98}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.item, active && { backgroundColor: colors.surface, shadowColor: colors.shadow, shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }]}
          >
            <Text variant="smallStrong" color={active ? 'text' : 'textMuted'} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderRadius: radius.pill, padding: 4 },
  item: { flex: 1, alignItems: 'center', paddingVertical: space.sm + 2, borderRadius: radius.pill },
});
