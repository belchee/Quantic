import * as AppleAuthentication from 'expo-apple-authentication';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

export function AppleButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { scheme, colors } = useTheme();
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'ios') void AppleAuthentication.isAvailableAsync().then(setAvailable);
  }, []);
  if (!available) return null;
  return (
    <View style={{ gap: space.lg }}>
      <View style={styles.or}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text variant="caption" color="textSubtle">
          {t('auth.or')}
        </Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={scheme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={radius.pill}
        style={{ height: 52 }}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  or: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
});
