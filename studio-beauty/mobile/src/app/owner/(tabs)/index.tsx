import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useOwnerStats } from '@/api/owner';
import { useBusinessToday } from '@/api/settings';
import { Button, Card, Loading, Screen, Text, Wordmark } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { DayNav } from '@/features/owner/DayNav';
import { DayTimeline } from '@/features/owner/DayTimeline';
import { space } from '@/theme/tokens';
import { useQueryClient } from '@tanstack/react-query';

export default function OwnerToday() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const qc = useQueryClient();
  const today = useBusinessToday();
  const stats = useOwnerStats();
  const [day, setDay] = useState<string | undefined>();
  const current = day ?? today.data;
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await qc.invalidateQueries();
    setRefreshing(false);
  };

  const tiles = [
    { label: t('owner.statsToday'), value: stats.data?.today_count },
    { label: t('owner.statsWeek'), value: stats.data?.week_count },
    { label: t('owner.statsNoShows'), value: stats.data?.no_shows_30d },
  ];

  return (
    <Screen edgeTop refreshing={refreshing} onRefresh={() => void refresh()}>
      <View style={{ gap: space.xl }}>
        <View style={styles.header}>
          <View style={{ flex: 1, gap: 2 }}>
            <Wordmark size="sm" align="left" />
            <Text variant="body" color="textMuted" style={{ marginTop: space.sm }}>
              {t('owner.greeting', { name: profile?.full_name.split(' ')[0] ?? '' })}
            </Text>
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(300)} style={styles.tiles}>
          {tiles.map((s) => (
            <Card key={s.label} tone="muted" style={styles.tile}>
              <Text variant="title">{s.value ?? '–'}</Text>
              <Text variant="caption" color="textMuted" numberOfLines={2}>
                {s.label}
              </Text>
            </Card>
          ))}
        </Animated.View>

        <Button title={t('owner.newBooking')} icon="plus" onPress={() => router.push({ pathname: '/owner/new-booking', params: { date: current } })} />

        {current && today.data ? (
          <>
            <DayNav day={current} today={today.data} onChange={setDay} />
            <DayTimeline day={current} />
          </>
        ) : (
          <Loading />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  tiles: { flexDirection: 'row', gap: space.sm },
  tile: { flex: 1, gap: 2, paddingVertical: space.md },
});
