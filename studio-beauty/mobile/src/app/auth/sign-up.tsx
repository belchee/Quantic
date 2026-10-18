import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Banner, Button, Input, Pressable, Text } from '@/components/ui';
import { AppleButton } from '@/features/auth/AppleButton';
import { AuthShell } from '@/features/auth/AuthShell';
import { useAuth } from '@/features/auth/AuthProvider';
import { finishAuth } from '@/features/auth/finish';
import { signUpSchema, type SignUpInput } from '@/features/auth/schemas';
import { openWebPage } from '@/features/studio';
import { errorCode } from '@/lib/errors';
import { space } from '@/theme/tokens';

export default function SignUp() {
  const { t, i18n } = useTranslation();
  const { signUp, signInWithApple } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', phone: '', password: '' },
  });
  const err = (m?: string) => (m ? t(m as never) : undefined);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const v = signUpSchema.parse(values);
      await signUp({ fullName: v.fullName, phoneE164: v.phone, password: v.password });
      await finishAuth();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  });

  const onApple = async () => {
    setError(null);
    try {
      if (await signInWithApple()) await finishAuth();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  };

  return (
    <AuthShell
      title={t('auth.signUpTitle')}
      subtitle={t('auth.signUpSubtitle')}
      footer={
        <Link href="/auth/sign-in" replace asChild>
          <Pressable haptic="selection" style={{ alignItems: 'center', padding: space.sm }}>
            <Text variant="small" color="textMuted">
              {t('auth.haveAccount')}{' '}
              <Text variant="smallStrong" color="primary">
                {t('auth.signIn')}
              </Text>
            </Text>
          </Pressable>
        </Link>
      }
    >
      <View style={{ gap: space.lg }}>
        <Controller
          control={control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Input
              label={t('auth.fullName')}
              textContentType="name"
              autoComplete="name"
              autoCapitalize="words"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={err(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Input
              label={t('auth.phone')}
              placeholder={t('auth.phoneHint')}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={err(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label={t('auth.password')}
              hint={t('auth.passwordHint')}
              secureTextEntry
              secureToggle
              textContentType="newPassword"
              autoComplete="new-password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={err(fieldState.error?.message)}
            />
          )}
        />
        {error && <Banner tone="danger" text={error} />}
        <Button title={t('auth.signUp')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />
        <Pressable haptic="selection" onPress={() => void openWebPage('privacy', i18n.language)}>
          <Text variant="caption" color="textSubtle" align="center">
            {t('auth.consent')}{' '}
            <Text variant="caption" color="primary">
              {t('auth.privacy')}
            </Text>
          </Text>
        </Pressable>
        <AppleButton onPress={() => void onApple()} />
      </View>
    </AuthShell>
  );
}
