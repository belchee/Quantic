import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useBusinessSettings, useUpdateSettings } from '@/api/settings';
import { Banner, Button, Input, Loading, Screen, useToast } from '@/components/ui';
import { errorCode } from '@/lib/errors';
import { space } from '@/theme/tokens';

// Ranges mirror the CHECK constraints in business_settings.
const FIELDS = [
  ['slot_minutes', 'owner.settings.slotMinutes', 10, 240],
  ['slot_capacity', 'owner.settings.slotCapacity', 1, 20],
  ['booking_window_days', 'owner.settings.bookingWindow', 0, 365],
  ['min_notice_minutes', 'owner.settings.minNotice', 0, 10080],
  ['cancel_hours', 'owner.settings.cancelHours', 0, 168],
  ['max_active_bookings', 'owner.settings.maxActive', 1, 50],
] as const;

type Key = (typeof FIELDS)[number][0];
const int = (min: number, max: number) =>
  z.string().trim().regex(/^\d+$/, 'validation.number').refine((v) => Number(v) >= min && Number(v) <= max, 'validation.range');
const schema = z.object(Object.fromEntries(FIELDS.map(([k, , min, max]) => [k, int(min, max)])) as Record<Key, ReturnType<typeof int>>);
type Values = z.infer<typeof schema>;

export default function Rules() {
  const { t } = useTranslation();
  const toast = useToast();
  const settings = useBusinessSettings();
  const save = useUpdateSettings();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (settings.data) reset(Object.fromEntries(FIELDS.map(([k]) => [k, String(settings.data![k])])) as Values);
  }, [settings.data, reset]);

  if (!settings.data) return <Loading />;

  const onSubmit = handleSubmit(async (v) => {
    setError(null);
    try {
      await save.mutateAsync(Object.fromEntries(FIELDS.map(([k]) => [k, Number(v[k])])));
      toast(t('common.saved'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  });

  return (
    <Screen keyboard footer={<Button title={t('common.save')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />}>
      <View style={{ gap: space.lg }}>
        <Banner tone="info" text={t('owner.settings.rulesHint')} />
        {FIELDS.map(([k, label, min, max]) => (
          <Controller
            key={k}
            control={control}
            name={k}
            render={({ field, fieldState }) => (
              <Input
                label={t(label)}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                keyboardType="number-pad"
                error={fieldState.error?.message ? t(fieldState.error.message as never, { min, max }) : undefined}
              />
            )}
          />
        ))}
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}
