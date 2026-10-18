import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Add top safe-area padding (screens without a native header). */
  edgeTop?: boolean;
  footer?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: ViewStyle;
  keyboard?: boolean;
}

export function Screen({ children, scroll = true, padded = true, edgeTop = false, footer, refreshing, onRefresh, contentStyle, keyboard }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const pad: ViewStyle = {
    paddingHorizontal: padded ? space.xl : 0,
    paddingTop: (edgeTop ? insets.top : 0) + (padded ? space.lg : 0),
    paddingBottom: footer ? space.lg : space.xxxl,
  };

  const body = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[pad, contentStyle]}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
  );

  const content = (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {body}
      {footer && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, space.lg), backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );

  return keyboard ? (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  footer: { paddingHorizontal: space.xl, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, gap: space.sm },
});
