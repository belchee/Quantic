import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, Pressable, Screen, Text, Wordmark } from '@/components/ui';
import { space } from '@/theme/tokens';

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <Screen keyboard edgeTop footer={footer}>
      <View style={styles.close}>
        <Pressable haptic="selection" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={12} accessibilityLabel="close">
          <Icon name="close" size={20} color="textMuted" />
        </Pressable>
      </View>
      <View style={{ gap: space.xxl }}>
        <View style={{ gap: space.lg, alignItems: 'center' }}>
          <Wordmark size="sm" />
          <View style={{ gap: space.xs, alignItems: 'center' }}>
            <Text variant="title" align="center">
              {title}
            </Text>
            <Text variant="body" color="textMuted" align="center">
              {subtitle}
            </Text>
          </View>
        </View>
        {children}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  close: { alignItems: 'flex-end', marginBottom: space.sm },
});
