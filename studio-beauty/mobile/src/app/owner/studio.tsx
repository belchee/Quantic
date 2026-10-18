import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useBusinessSettings, useUpdateSettings } from '@/api/settings';
import { Banner, Button, Input, Loading, Screen, Text, useToast } from '@/components/ui';
import { errorCode } from '@/lib/errors';
import { formatPhone, normalizePhone } from '@/lib/phone';
import { space } from '@/theme/tokens';

const coord = (min: number, max: number) =>
  z.string().trim().refine((v) => v === '' || (!Number.isNaN(Number(v.replace(',', '.'))) && Math.abs(Number(v.replace(',', '.'))) <= max && Number(v.replace(',', '.')) >= min), 'validation.number');

const schema = z.object({
  studio_name: z.string().trim().min(2, 'validation.required').max(80),
  address: z.string().trim().max(200),
  contact_phone: z.string().trim().refine((v) => v === '' || normalizePhone(v) !== null, 'validation.phoneInvalid'),
  instagram: z.string().trim().transform((v) => v.replace(/^@/, '')).refine((v) => v === '' || /^[A-Za-z0-9._]{1,30}$/.test(v), 'validation.required'),
  latitude: coord(-90, 90),
  longitude: coord(-180, 180),
});
type Values = z.input<typeof schema>;

export default function Studio() {
  const { t } = useTranslation();
  const toast = useToast();
  const settings = useBusinessSettings();
  const save = useUpdateSettings();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const s = settings.data;
    if (!s) return;
    reset({
      studio_name: s.studio_name,
      address: s.address ?? '',
      contact_phone: formatPhone(s.contact_phone),
      instagram: s.instagram ?? '',
      latitude: s.latitude?.toString() ?? '',
      longitude: s.longitude?.toString() ?? '',
    });
  }, [settings.data, reset]);

  if (!settings.data) return <Loading />;

  const onSubmit = handleSubmit(async (raw) => {
    setError(null);
    const v = schema.parse(raw);
    const num = (x: string) => (x === '' ? null : Number(x.replace(',', '.')));
    try {
      await save.mutateAsync({
        studio_name: v.studio_name,
        address: v.address || null,
        contact_phone: v.contact_phone ? normalizePhone(v.contact_phone) : null,
        instagram: v.instagram || null,
        latitude: num(v.latitude),
        longitude: num(v.longitude),
      });
      toast(t('common.saved'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  });

  const field = (name: keyof Values, label: string, extra: Partial<React.ComponentProps<typeof Input>> = {}) => (
    <Controller
      control={control}
      name={name}
      render={({ field: f, fieldState }) => (
        <Input label={label} value={f.value} onChangeText={f.onChange} onBlur={f.onBlur} error={fieldState.error?.message ? t(fieldState.error.message as never) : undefined} {...extra} />
      )}
    />
  );

  return (
    <Screen keyboard footer={<Button title={t('common.save')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />}>
      <View style={{ gap: space.lg }}>
        {field('studio_name', t('owner.settings.studioName'))}
        {field('address', t('owner.settings.address'), { multiline: true })}
        {field('contact_phone', t('owner.settings.contactPhone'), { keyboardType: 'phone-pad' })}
        {field('instagram', t('owner.settings.instagram'), { autoCapitalize: 'none', autoCorrect: false })}
        <View style={{ flexDirection: 'row', gap: space.md }}>
          <View style={{ flex: 1 }}>{field('latitude', t('owner.settings.latitude'), { keyboardType: 'numbers-and-punctuation' })}</View>
          <View style={{ flex: 1 }}>{field('longitude', t('owner.settings.longitude'), { keyboardType: 'numbers-and-punctuation' })}</View>
        </View>
        <Text variant="caption" color="textSubtle">
          {t('owner.settings.mapHint')}
        </Text>
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}
