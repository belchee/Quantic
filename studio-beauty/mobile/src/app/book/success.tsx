import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useServices } from '@/api/services';
import { useBusinessSettings } from '@/api/settings';
import { Button, Card, Icon, Screen, Text, useToast } from '@/components/ui';
import { addToCalendar } from '@/features/booking/addToCalendar';
import { getPushPermission, registerForPush } from '@/features/notifications/push';
import { useFormat } from '@/i18n/format';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

export default function Success() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const toast = useToast();
  const params = useLocalSearchParams<{ slotStart: string; localDate: string; localTime: string; serviceId: string }>();
  const settings = useBusinessSettings();
  const services = useServices();
  const service = services.data?.find((s) => s.id === params.serviceId);
  const [askPush, setAskPush] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    void getPushPermission().then((p) => setAskPush(p !== 'granted'));
  }, []);

  const onCalendar = async () => {
    const s = settings.data;
    if (!s) return;
    const ok = await addToCalendar({
      title: `${s.studio_name} · ${f.serviceName(service)}`,
      startIso: params.slotStart,
      minutes: s.slot_minutes,
      location: s.address,
      timeZone: s.timezone,
    }).catch(() => false);
    if (ok) {
      setAdded(true);
      toast(t('booking.addedToCalendar'));
    }
  };

  const onPush = async () => {
    const ok = await registerForPush({ prompt: true }).catch(() => false);
    setAskPush(!ok);
  };

  return (
    <Screen edgeTop>
      <View style={styles.wrap}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
          <Icon name="checkCircle" size={46} color="primary" />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(150)} style={{ gap: space.sm, alignItems: 'center' }}>
          <Text variant="hero" align="center">
            {t('booking.successTitle')}
          </Text>
          <Text variant="body" color="textMuted" align="center">
            {t('booking.successBody', { date: f.fullDate(params.localDate), time: params.localTime })}
          </Text>
          {service && (
            <Text variant="smallStrong" color="primary">
              {f.serviceName(service)}
            </Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260)} style={{ alignSelf: 'stretch', gap: space.md }}>
          <Button title={added ? t('booking.addedToCalendar') : t('booking.addToCalendar')} variant="secondary" icon="calendarAdd" disabled={added} onPress={() => void onCalendar()} />
          {askPush && (
            <Card tone="muted" style={{ gap: space.md }}>
              <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
                <Icon name="bell" size={20} color="accent" />
                <Text variant="small" color="textMuted" style={{ flex: 1 }}>
                  {t('booking.remindMeBody')}
                </Text>
              </View>
              <Button title={t('booking.remindMe')} variant="outline" size="md" onPress={() => void onPush()} />
            </Card>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(340)} style={{ alignSelf: 'stretch', gap: space.sm, marginTop: 'auto' }}>
          <Button title={t('booking.viewAppointments')} onPress={() => router.dismissTo('/appointments')} />
          <Button title={t('booking.backHome')} variant="ghost" onPress={() => router.dismissTo('/')} />
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.xxl, paddingTop: space.xxxl, minHeight: 640 },
  badge: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
});
