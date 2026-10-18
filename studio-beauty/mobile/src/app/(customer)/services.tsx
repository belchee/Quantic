import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useServices } from '@/api/services';
import { useBusinessSettings } from '@/api/settings';
import { Card, EmptyState, ErrorState, Icon, Loading, Pressable, Screen, Text } from '@/components/ui';
import { Steps } from '@/features/booking/Steps';
import { useFormat } from '@/i18n/format';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

/** Booking step 1 — choose a service. */
export default function Services() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const services = useServices();
  const settings = useBusinessSettings();

  return (
    <Screen refreshing={services.isRefetching} onRefresh={() => void services.refetch()}>
      <View style={{ gap: space.xl }}>
        <Steps current={1} />
        <Text variant="title">{t('booking.chooseService')}</Text>

        {services.isPending ? (
          <Loading />
        ) : services.isError ? (
          <ErrorState error={services.error} onRetry={() => void services.refetch()} />
        ) : services.data.length === 0 ? (
          <EmptyState title={t('services.empty')} />
        ) : (
          <View style={{ gap: space.md }}>
            {services.data.map((svc, i) => {
              const desc = f.serviceDescription(svc);
              return (
                <Animated.View key={svc.id} entering={FadeInDown.delay(i * 50).duration(260)}>
                  <Pressable
                    scaleTo={0.985}
                    onPress={() => router.push({ pathname: '/book/time', params: { serviceId: svc.id } })}
                    accessibilityLabel={`${f.serviceName(svc)} ${svc.price_mkd != null ? f.price(svc.price_mkd) : ''}`}
                  >
                    <Card elevated style={styles.card}>
                      <View style={[styles.mark, { backgroundColor: colors.primarySoft }]}>
                        <Icon name="sparkles" size={18} color="primary" />
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text variant="subheading">{f.serviceName(svc)}</Text>
                        {desc ? (
                          <Text variant="small" color="textMuted" numberOfLines={2}>
                            {desc}
                          </Text>
                        ) : null}
                        <View style={styles.meta}>
                          {svc.duration_minutes ? (
                            <Text variant="caption" color="textSubtle">
                              {t('common.minutes', { n: svc.duration_minutes })}
                            </Text>
                          ) : null}
                          {svc.price_mkd != null ? (
                            <Text variant="smallStrong" color="primary">
                              {f.price(svc.price_mkd)}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      <Icon name="chevronRight" size={14} color="textSubtle" />
                    </Card>
                  </Pressable>
                </Animated.View>
              );
            })}
            {settings.data && (
              <Text variant="caption" color="textSubtle" align="center" style={{ marginTop: space.sm }}>
                {t('services.slotNote', { n: settings.data.slot_minutes })}
              </Text>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  mark: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', gap: space.md, alignItems: 'center', marginTop: 2 },
});
