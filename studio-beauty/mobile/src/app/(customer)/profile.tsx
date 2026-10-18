import { router } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card, Screen, Text, Wordmark } from '@/components/ui';
import { AccountSections } from '@/features/account/AccountSections';
import { useAuth } from '@/features/auth/AuthProvider';
import { space } from '@/theme/tokens';

export default function Profile() {
  const { t } = useTranslation();
  const { session } = useAuth();
  return (
    <Screen>
      <View style={{ gap: space.xl }}>
        {!session && (
          <Card tone="primary" style={{ gap: space.lg, alignItems: 'center', paddingVertical: space.xxl }}>
            <Wordmark size="sm" />
            <Text variant="body" color="textMuted" align="center">
              {t('auth.signUpSubtitle')}
            </Text>
            <View style={{ alignSelf: 'stretch', gap: space.sm }}>
              <Button title={t('auth.signUp')} onPress={() => router.push('/auth/sign-up')} />
              <Button title={t('auth.signIn')} variant="ghost" onPress={() => router.push('/auth/sign-in')} />
            </View>
          </Card>
        )}
        <AccountSections />
      </View>
    </Screen>
  );
}
