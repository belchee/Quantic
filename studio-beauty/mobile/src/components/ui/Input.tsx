import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radius, space } from '@/theme/tokens';
import { Icon } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

interface Props extends TextInputProps {
  ref?: Ref<TextInputInstance>;
  label: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
}

export function Input({ ref, label, error, hint, secureToggle, secureTextEntry, style, multiline, ...rest }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.wrap}>
      <Text variant="caption" color="textMuted" style={styles.label}>
        {label}
      </Text>
      <View style={[styles.field, { borderColor, backgroundColor: colors.surface }, multiline && { minHeight: 96, alignItems: 'flex-start' }]}>
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          accessibilityLabel={label}
          {...rest}
          multiline={multiline}
          secureTextEntry={hidden}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, { color: colors.text }, multiline && { paddingTop: space.md, textAlignVertical: 'top' }, style]}
        />
        {secureToggle && (
          <Pressable haptic="selection" onPress={() => setHidden((h) => !h)} hitSlop={12} accessibilityLabel="toggle password">
            <Icon name={hidden ? 'lock' : 'check'} size={18} color="textMuted" />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="textSubtle">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { marginLeft: space.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    minHeight: 54,
    gap: space.sm,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 16, paddingVertical: space.md },
});
