import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ListGroup, ListRow, Segmented, Text, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { getPushPermission, registerForPush } from '@/features/notifications/push';
import { openWebPage } from '@/features/studio';
import { LANGUAGES } from '@/i18n';
import { errorCode } from '@/lib/errors';
import { formatPhone } from '@/lib/phone';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

export function AccountSections() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { session, profile, signOut, deleteAccount } = useAuth();
  const { preference, setPreference } = useTheme();
  const [push, setPush] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void getPushPermission().then(setPush);
  }, []);

  const languageLabel = LANGUAGES.find((l) => l.code === i18n.language)?.label ?? '';

  const onPush = async () => {
    if (push === 'denied') return Linking.openSettings();
    const ok = await registerForPush({ prompt: true }).catch(() => false);
    setPush(ok ? 'granted' : await getPushPermission());
  };

  const onDelete = () =>
    Alert.alert(t('profile.deleteTitle'), t('profile.deleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.deleteConfirm'),
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteAccount();
            toast(t('profile.deleted'));
            router.replace('/');
          } catch (e) {
            toast(t(`errors.${errorCode(e)}`), 'error');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);

  return (
    <View style={{ gap: space.xl }}>
      {session && profile && (
        <ListGroup title={t('profile.account')}>
          <ListRow icon="person" label={profile.full_name || '—'} value={formatPhone(profile.phone)} onPress={() => router.push('/account/edit')} last />
        </ListGroup>
      )}

      <ListGroup title={t('profile.preferences')}>
        <ListRow icon="globe" label={t('profile.language')} value={languageLabel} onPress={() => router.push('/account/language')} />
        {session && (
          <ListRow
            icon="bell"
            label={t('profile.notifications')}
            value={push === 'granted' ? t('profile.notificationsOn') : t('profile.notificationsOff')}
            onPress={push === 'granted' ? undefined : () => void onPush()}
          />
        )}
        <View style={{ padding: space.lg, gap: space.sm }}>
          <Text variant="small" color="textMuted">
            {t('profile.appearance')}
          </Text>
          <Segmented
            value={preference}
            onChange={setPreference}
            options={[
              { value: 'system', label: t('profile.themeSystem') },
              { value: 'light', label: t('profile.themeLight') },
              { value: 'dark', label: t('profile.themeDark') },
            ]}
          />
        </View>
      </ListGroup>

      <ListGroup title={t('profile.help')}>
        <ListRow icon="doc" label={t('profile.privacy')} onPress={() => void openWebPage('privacy', i18n.language)} />
        <ListRow icon="help" label={t('profile.support')} onPress={() => void openWebPage('support', i18n.language)} last />
      </ListGroup>

      {session && (
        <ListGroup>
          <ListRow icon="signOut" label={t('profile.signOut')} onPress={() => void signOut()} chevron={false} />
          <ListRow icon="trash" label={deleting ? t('common.loading') : t('profile.deleteAccount')} tone="danger" onPress={deleting ? undefined : onDelete} chevron={false} last />
        </ListGroup>
      )}

      <Text variant="caption" color="textSubtle" align="center">
        {t('profile.version', { v: Constants.expoConfig?.version ?? '' })}
      </Text>
    </View>
  );
}
