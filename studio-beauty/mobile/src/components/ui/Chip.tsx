import { StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { Pressable } from './Pressable';
import { Text } from './Text';

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      haptic="selection"
      onPress={onPress}
      accessibilityState={{ selected: !!selected }}
      style={[
        styles.chip,
        { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
      ]}
    >
      <Text variant="smallStrong" style={{ color: selected ? colors.onPrimary : colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: space.lg, paddingVertical: space.sm, borderRadius: radius.pill, borderWidth: 1 },
});
