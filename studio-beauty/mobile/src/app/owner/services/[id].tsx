import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useSaveService, useServices } from '@/api/services';
import { Banner, Button, Card, Input, Screen, Text, useToast } from '@/components/ui';
import { errorCode } from '@/lib/errors';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

const name = z.string().trim().min(1, 'validation.required').max(80);
const desc = z.string().trim().max(300);
const optInt = (max: number) =>
  z.string().trim().refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) <= max), 'validation.number');

const schema = z.object({
  name_sq: name,
  name_mk: name,
  name_en: name,
  description_sq: desc,
  description_mk: desc,
  description_en: desc,
  duration_minutes: optInt(480),
  price_mkd: optInt(1_000_000),
  sort: z.string().trim().regex(/^\d*$/, 'validation.number'),
  active: z.boolean(),
});
type Values = z.input<typeof schema>;

export default function EditService() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';
  const services = useServices({ includeInactive: true });
  const existing = services.data?.find((s) => s.id === id);
  const save = useSaveService();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_sq: '', name_mk: '', name_en: '', description_sq: '', description_mk: '', description_en: '',
      duration_minutes: '', price_mkd: '', sort: String(services.data?.length ?? 0), active: true,
    },
  });

  useEffect(() => {
    if (!existing) return;
    reset({
      name_sq: existing.name_sq,
      name_mk: existing.name_mk,
      name_en: existing.name_en,
      description_sq: existing.description_sq ?? '',
      description_mk: existing.description_mk ?? '',
      description_en: existing.description_en ?? '',
      duration_minutes: existing.duration_minutes?.toString() ?? '',
      price_mkd: existing.price_mkd?.toString() ?? '',
      sort: String(existing.sort),
      active: existing.active,
    });
  }, [existing, reset]);

  const onSubmit = handleSubmit(async (raw) => {
    setError(null);
    const v = schema.parse(raw);
    const n = (x: string) => (x === '' ? null : Number(x));
    try {
      await save.mutateAsync({
        id: isNew ? undefined : id,
        name_sq: v.name_sq,
        name_mk: v.name_mk,
        name_en: v.name_en,
        description_sq: v.description_sq || null,
        description_mk: v.description_mk || null,
        description_en: v.description_en || null,
        duration_minutes: n(v.duration_minutes),
        price_mkd: n(v.price_mkd),
        sort: Number(v.sort || 0),
        active: v.active,
      });
      toast(t('common.saved'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  });

  const text = (k: Exclude<keyof Values, 'active'>, label: string, extra: Partial<React.ComponentProps<typeof Input>> = {}) => (
    <Controller
      control={control}
      name={k}
      render={({ field, fieldState }) => (
        <Input label={label} value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message ? t(fieldState.error.message as never) : undefined} {...extra} />
      )}
    />
  );

  return (
    <Screen keyboard footer={<Button title={t('common.save')} loading={formState.isSubmitting} onPress={() => void onSubmit()} />}>
      <Stack.Screen options={{ title: isNew ? t('owner.settings.addService') : t('owner.settings.editService') }} />
      <View style={{ gap: space.lg }}>
        {text('name_sq', t('owner.settings.nameSq'))}
        {text('name_mk', t('owner.settings.nameMk'))}
        {text('name_en', t('owner.settings.nameEn'))}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>{text('price_mkd', t('owner.settings.price'), { keyboardType: 'number-pad' })}</View>
          <View style={{ flex: 1 }}>{text('duration_minutes', t('owner.settings.duration'), { keyboardType: 'number-pad' })}</View>
        </View>
        {text('description_sq', t('owner.settings.descSq'), { multiline: true })}
        {text('description_mk', t('owner.settings.descMk'), { multiline: true })}
        {text('description_en', t('owner.settings.descEn'), { multiline: true })}
        {text('sort', t('owner.settings.sort'), { keyboardType: 'number-pad' })}
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Card style={styles.row}>
              <Text variant="body" style={{ flex: 1 }}>
                {t('owner.settings.active')}
              </Text>
              <Switch value={field.value} onValueChange={field.onChange} trackColor={{ true: colors.primary, false: colors.border }} />
            </Card>
          )}
        />
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
