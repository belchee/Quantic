import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useMyBookings } from '@/api/bookings';
import { useServices } from '@/api/services';
import { useBusinessSettings, useBusinessToday, useWorkingHours } from '@/api/settings';
import { Button, Card, Icon, Pressable, Text, Wordmark, type IconName } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { resolveHours, sameEveryDay } from '@/features/hours';
import { callNumber, openDirections, openInstagram } from '@/features/studio';
import { useFormat } from '@/i18n/format';
import { useNow } from '@/hooks/useNow';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

export default function Home() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const f = useFormat();
  const { session, profile } = useAuth();
  const settings = useBusinessSettings();
  const hours = useWorkingHours();
  const services = useServices();
  const today = useBusinessToday();
  const bookings = useMyBookings(session?.user.id);
  const now = useNow();

  const next = bookings.data
    ?.filter((b) => b.status === 'confirmed' && new Date(b.slot_start).getTime() > now)
    .sort((a, b) => a.slot_start.localeCompare(b.slot_start))[0];

  const s = settings.data;
  const days = s && hours.data ? resolveHours(s, hours.data) : [];
  const firstName = profile?.full_name.split(' ')[0];

  const actions: { icon: IconName; label: string; onPress: () => void }[] = [];
  if (s) {
    actions.push({ icon: 'location', label: t('home.directions'), onPress: () => openDirections(s) });
    if (s.contact_phone) actions.push({ icon: 'phone', label: t('home.call'), onPress: () => callNumber(s.contact_phone!) });
    if (s.instagram) actions.push({ icon: 'instagram', label: t('home.instagram'), onPress: () => void openInstagram(s.instagram!) });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: space.xxxl }}>
      <LinearGradient colors={[colors.heroStart, colors.heroEnd]} style={[styles.hero, { paddingTop: insets.top + space.xxl }]}>
        <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center', gap: space.lg }}>
          <Wordmark size="lg" />
          <Text variant="body" color="textMuted" align="center">
            {firstName ? t('home.welcomeName', { name: firstName }) : t('home.tagline')}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(120).duration(500)} style={{ alignSelf: 'stretch' }}>
          <Button title={t('home.bookCta')} icon="book" onPress={() => router.push('/services')} />
        </Animated.View>
      </LinearGradient>

      <View style={styles.body}>
        {next && (
          <Animated.View entering={FadeInDown.delay(160)}>
            <Pressable onPress={() => router.push('/appointments')} scaleTo={0.99}>
              <Card tone="primary" style={styles.nextCard}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text variant="overline" color="onPrimarySoft">
                    {t('home.nextAppointment')}
                  </Text>
                  <Text variant="heading">{f.relativeDate(next.local_date, today.data)}</Text>
                  <Text variant="small" color="textMuted">
                    {next.local_time} · {f.serviceName(next.service)}
                  </Text>
                </View>
                <Icon name="chevronRight" size={16} color="onPrimarySoft" />
              </Card>
            </Pressable>
          </Animated.View>
        )}

        {actions.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.actions}>
            {actions.map((a) => (
              <Pressable key={a.label} onPress={a.onPress} style={[styles.action, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
                  <Icon name={a.icon} size={19} color="primary" />
                </View>
                <Text variant="caption" color="text">
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        )}

        {s && (
          <Animated.View entering={FadeInDown.delay(240)}>
            <Card style={{ gap: space.md }}>
              <View style={styles.cardTitle}>
                <Icon name="clock" size={18} color="accent" />
                <Text variant="subheading">{t('home.hours')}</Text>
              </View>
              {days.length > 0 && sameEveryDay(days) ? (
                <View style={styles.hoursRow}>
                  <Text variant="body" color="textMuted">
                    {t('home.everyDay')}
                  </Text>
                  <Text variant="bodyStrong">
                    {days[0]!.open} – {days[0]!.close}
                  </Text>
                </View>
              ) : (
                days.map((d) => (
                  <View key={d.weekday} style={styles.hoursRow}>
                    <Text variant="body" color="textMuted">
                      {f.weekdaysLong[d.weekday - 1]}
                    </Text>
                    <Text variant="bodyStrong" color={d.open ? 'text' : 'textSubtle'}>
                      {d.open ? `${d.open} – ${d.close}` : t('home.closed')}
                    </Text>
                  </View>
                ))
              )}
              {s.address ? (
                <Pressable onPress={() => openDirections(s)} haptic="selection" style={[styles.address, { borderTopColor: colors.border }]}>
                  <Icon name="location" size={16} color="textMuted" />
                  <Text variant="small" color="textMuted" style={{ flex: 1 }}>
                    {s.address}
                  </Text>
                </Pressable>
              ) : null}
            </Card>
          </Animated.View>
        )}

        {services.data && services.data.length > 0 && (
          <Animated.View entering={FadeInDown.delay(280)} style={{ gap: space.md }}>
            <View style={styles.sectionHead}>
              <Text variant="heading">{t('home.services')}</Text>
              <Pressable haptic="selection" onPress={() => router.push('/services')} hitSlop={8}>
                <Text variant="smallStrong" color="primary">
                  {t('home.seeAll')}
                </Text>
              </Pressable>
            </View>
            <Card padded={false}>
              {services.data.slice(0, 5).map((svc, i, arr) => (
                <Pressable
                  key={svc.id}
                  scaleTo={0.99}
                  onPress={() => router.push({ pathname: '/book/time', params: { serviceId: svc.id } })}
                  style={[styles.serviceRow, i < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
                >
                  <Text variant="body" style={{ flex: 1 }}>
                    {f.serviceName(svc)}
                  </Text>
                  {svc.price_mkd != null && (
                    <Text variant="smallStrong" color="textMuted">
                      {f.price(svc.price_mkd)}
                    </Text>
                  )}
                  <Icon name="chevronRight" size={14} color="textSubtle" />
                </Pressable>
              ))}
            </Card>
          </Animated.View>
        )}

        {!session && (
          <Pressable haptic="selection" onPress={() => router.push('/auth/sign-in')} style={{ alignSelf: 'center', padding: space.sm }}>
            <Text variant="smallStrong" color="primary">
              {t('auth.haveAccount')} {t('auth.signIn')}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: space.xl, paddingBottom: space.xxl, gap: space.xxl, alignItems: 'center', borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  body: { paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.xl },
  nextCard: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  actions: { flexDirection: 'row', gap: space.md },
  action: { flex: 1, alignItems: 'center', gap: space.sm, paddingVertical: space.lg, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth },
  actionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between' },
  address: { flexDirection: 'row', gap: space.sm, alignItems: 'center', paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.lg },
});
