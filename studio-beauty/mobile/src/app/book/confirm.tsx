import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCreateBooking } from '@/api/bookings';
import { useServices } from '@/api/services';
import { useBusinessSettings } from '@/api/settings';
import { Banner, Button, Card, Icon, Input, Screen, Text, useToast, type IconName } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { Steps } from '@/features/booking/Steps';
import { useFormat } from '@/i18n/format';
import { errorCode } from '@/lib/errors';
import { formatPhone } from '@/lib/phone';
import { space } from '@/theme/tokens';

/** Booking step 3 — review and confirm. Login is required only here. */
export default function Confirm() {
  const { t } = useTranslation();
  const f = useFormat();
  const toast = useToast();
  const params = useLocalSearchParams<{ serviceId: string; slotStart: string; localDate: string; localTime: string }>();
  const { session, profile, isProfileComplete } = useAuth();
  const services = useServices();
  const settings = useBusinessSettings();
  const service = services.data?.find((s) => s.id === params.serviceId);
  const create = useCreateBooking();
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!session) return router.push('/auth/sign-in');
    if (!isProfileComplete) return router.push('/auth/complete-profile');
    try {
      const booking = await create.mutateAsync({ slotStart: params.slotStart, serviceId: params.serviceId, notes });
      router.replace({
        pathname: '/book/success',
        params: { bookingId: booking.id, slotStart: params.slotStart, localDate: params.localDate, localTime: params.localTime, serviceId: params.serviceId },
      });
    } catch (e) {
      const code = errorCode(e);
      if (code === 'SLOT_FULL' || code === 'SLOT_BLOCKED' || code === 'SLOT_TOO_SOON') {
        toast(t('booking.slotTaken'), 'error');
        router.back();
        return;
      }
      setError(t(`errors.${code}`));
    }
  };

  const rows: { icon: IconName; label: string; value: string }[] = [
    { icon: 'sparkles', label: t('booking.service'), value: f.serviceName(service) },
    { icon: 'calendar', label: t('booking.date'), value: f.fullDate(params.localDate) },
    { icon: 'clock', label: t('booking.time'), value: params.localTime },
  ];
  if (profile) rows.push({ icon: 'person', label: t('booking.client'), value: `${profile.full_name}${profile.phone ? ` · ${formatPhone(profile.phone)}` : ''}` });

  return (
    <Screen
      keyboard
      footer={
        <Button
          title={session ? t('booking.confirmCta') : t('booking.signInToConfirm')}
          icon={session ? 'checkCircle' : 'lock'}
          loading={create.isPending}
          onPress={() => void submit()}
        />
      }
    >
      <View style={{ gap: space.xl }}>
        <Steps current={3} />
        <Text variant="title">{t('booking.confirmTitle')}</Text>

        <Card elevated style={{ gap: space.lg }}>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Icon name={r.icon} size={18} color="accent" />
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="textSubtle">
                  {r.label}
                </Text>
                <Text variant="bodyStrong">{r.value}</Text>
              </View>
            </View>
          ))}
          {service?.price_mkd != null && (
            <View style={styles.total}>
              <Text variant="body" color="textMuted">
                {t('booking.price')}
              </Text>
              <Text variant="heading">{f.price(service.price_mkd)}</Text>
            </View>
          )}
        </Card>

        <Input
          label={t('booking.notes')}
          placeholder={t('booking.notesPlaceholder')}
          value={notes}
          onChangeText={setNotes}
          multiline
          maxLength={500}
        />

        {settings.data && <Banner tone="info" text={t('booking.cancelPolicy', { n: settings.data.cancel_hours })} />}
        {!session && <Banner tone="warning" text={t('auth.signInRequired')} />}
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: space.sm },
});
