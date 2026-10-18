import * as Haptics from 'expo-haptics';
import { Pressable as RNPressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'selection' | 'none';
  scaleTo?: number;
}

/** Pressable with a soft spring scale and optional haptic tick. */
export function Pressable({ style, haptic = 'light', scaleTo = 0.97, onPressIn, onPressOut, onPress, disabled, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      accessibilityRole={rest.accessibilityRole ?? 'button'}
      accessibilityState={{ disabled: !!disabled, ...rest.accessibilityState }}
      onPressIn={(e) => {
        scale.set(withSpring(scaleTo, { damping: 20, stiffness: 400 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, { damping: 15, stiffness: 300 }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic === 'light') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (haptic === 'selection') void Haptics.selectionAsync();
        onPress?.(e);
      }}
      style={[style, animated]}
    />
  );
}
