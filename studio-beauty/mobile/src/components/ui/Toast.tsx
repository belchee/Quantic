import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { Icon } from './Icon';
import { Text } from './Text';

type Tone = 'success' | 'error' | 'info';
interface ToastState {
  id: number;
  text: string;
  tone: Tone;
}

const ToastContext = createContext<(text: string, tone?: Tone) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((text: string, tone: Tone = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), text, tone });
    void Haptics.notificationAsync(
      tone === 'error' ? Haptics.NotificationFeedbackType.Error : Haptics.NotificationFeedbackType.Success,
    );
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { paddingTop: insets.top + space.sm }]}>
        {toast && (
          <Animated.View
            key={toast.id}
            entering={FadeInUp.springify().damping(18)}
            exiting={FadeOutUp.duration(200)}
            accessibilityLiveRegion="polite"
            style={[styles.toast, { backgroundColor: colors.text }]}
          >
            <Icon
              name={toast.tone === 'error' ? 'warning' : toast.tone === 'info' ? 'info' : 'checkCircle'}
              size={18}
              tint={colors.background}
            />
            <Text variant="smallStrong" style={{ color: colors.background, flex: 1 }}>
              {toast.text}
            </Text>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
});
