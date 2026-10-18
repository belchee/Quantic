import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Banner, Button, Input } from '@/components/ui';
import { AuthShell } from '@/features/auth/AuthShell';
import { useAuth } from '@/features/auth/AuthProvider';
import { profileSchema, type ProfileInput } from '@/features/auth/schemas';
import { errorCode } from '@/lib/errors';
import { space } from '@/theme/tokens';

/** Shown after Sign in with Apple (or any account without name/phone) before the first booking. */
export default function CompleteProfile() {
  const { t } = useTranslation();
  const { profile, updateProfile, changePhone } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: profile?.full_name ?? '', phone: profile?.phone ?? '' },
  });
  const err = (m?: string) => (m ? t(m as never) : undefined);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const v = profileSchema.parse(values);
      if (v.fullName !== profile?.full_name) await updateProfile({ full_name: v.fullName });
      if (v.phone !== profile?.phone) await changePhone(v.phone);
      if (router.canDismiss()) router.dismissAll();
      else router.replace('/');
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  });

  return (
    <AuthShell title={t('auth.completeTitle')} subtitle={t('auth.completeBody')}>
      <View style={{ gap: space.lg }}>
        <Controller
          control={control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Input label={t('auth.fullName')} autoCapitalize="words" textContentType="name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={err(fieldState.error?.message)} />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Input label={t('auth.phone')} placeholder={t('auth.phoneHint')} keyboardType="phone-pad" textContentType="telephoneNumber" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={err(fieldState.error?.message)} />
          )}
        />
        {error && <Banner tone="danger" text={error} />}
        <Button title={t('common.continue')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />
      </View>
    </AuthShell>
  );
}
