import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Banner, Button, Input, Screen, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { profileSchema, type ProfileInput } from '@/features/auth/schemas';
import { errorCode } from '@/lib/errors';
import { formatPhone } from '@/lib/phone';
import { space } from '@/theme/tokens';

export default function EditProfile() {
  const { t } = useTranslation();
  const toast = useToast();
  const { profile, updateProfile, changePhone } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: profile?.full_name ?? '', phone: formatPhone(profile?.phone) },
  });
  const err = (m?: string) => (m ? t(m as never) : undefined);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const v = profileSchema.parse(values);
      if (v.fullName !== profile?.full_name) await updateProfile({ full_name: v.fullName });
      if (v.phone !== profile?.phone) await changePhone(v.phone);
      toast(t('common.saved'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  });

  return (
    <Screen keyboard footer={<Button title={t('common.save')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />}>
      <View style={{ gap: space.lg }}>
        <Controller
          control={control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Input label={t('auth.fullName')} autoCapitalize="words" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={err(fieldState.error?.message)} />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Input label={t('auth.phone')} keyboardType="phone-pad" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={err(fieldState.error?.message)} />
          )}
        />
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}
