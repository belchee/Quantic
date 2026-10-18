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
import { signInSchema, type SignInInput } from '@/features/auth/schemas';
import { errorCode } from '@/lib/errors';
import { space } from '@/theme/tokens';

export default function SignIn() {
  const { t } = useTranslation();
  const { signIn, signInWithApple } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await signIn(signInSchema.parse(values).phone, values.password);
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
      title={t('auth.signInTitle')}
      subtitle={t('auth.signInSubtitle')}
      footer={
        <Link href="/auth/sign-up" replace asChild>
          <Pressable haptic="selection" style={{ alignItems: 'center', padding: space.sm }}>
            <Text variant="small" color="textMuted">
              {t('auth.noAccount')}{' '}
              <Text variant="smallStrong" color="primary">
                {t('auth.signUp')}
              </Text>
            </Text>
          </Pressable>
        </Link>
      }
    >
      <View style={{ gap: space.lg }}>
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
              error={fieldState.error?.message ? t(fieldState.error.message as never) : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label={t('auth.password')}
              secureTextEntry
              secureToggle
              textContentType="password"
              autoComplete="current-password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              onSubmitEditing={() => void onSubmit()}
              returnKeyType="go"
              error={fieldState.error?.message ? t(fieldState.error.message as never) : undefined}
            />
          )}
        />
        {error && <Banner tone="danger" text={error} />}
        <Button title={t('auth.signIn')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />
        <Text variant="caption" color="textSubtle" align="center">
          {t('auth.forgot')}
        </Text>
        <AppleButton onPress={() => void onApple()} />
      </View>
    </AuthShell>
  );
}
