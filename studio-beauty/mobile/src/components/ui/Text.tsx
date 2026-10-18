import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { type as typeScale, type ColorName, type TypeVariant } from '@/theme/tokens';

interface Props extends TextProps {
  variant?: TypeVariant;
  color?: ColorName;
  align?: 'left' | 'center' | 'right';
}

export function Text({ variant = 'body', color = 'text', align, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      {...rest}
      style={[typeScale[variant], { color: colors[color] }, align && { textAlign: align }, style]}
    />
  );
}
