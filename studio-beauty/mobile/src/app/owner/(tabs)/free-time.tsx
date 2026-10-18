import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useBlocks, useDeleteBlock } from '@/api/owner';
import { Button, Card, EmptyState, ErrorState, Icon, Loading, Pressable, Screen, Text, useToast } from '@/components/ui';
import { useFormat } from '@/i18n/format';
import { errorCode } from '@/lib/errors';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

function describe(range: string, f: ReturnType<typeof useFormat>) {
  // range: "YYYY-MM-DD HH:MM – YYYY-MM-DD HH:MM" (Skopje time, from the server)
  const [a, b] = range.split(' – ') as [string, string];
  const [d1, t1] = a.split(' ') as [string, string];
  const [d2, t2] = b.split(' ') as [string, string];
  if (t1 === '00:00' && t2 === '00:00') {
    // whole days; end is exclusive midnight
    const endDay = new Date(`${d2}T00:00:00Z`);
    endDay.setUTCDate(endDay.getUTCDate() - 1);
    const last = endDay.toISOString().slice(0, 10);
    return last === d1 ? f.fullDate(d1) : `${f.dayMonth(d1)} – ${f.dayMonth(last)}`;
  }
  return d1 === d2 ? `${f.fullDate(d1)} · ${t1}–${t2}` : `${f.dayMonth(d1)} ${t1} – ${f.dayMonth(d2)} ${t2}`;
}

export default function FreeTime() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const toast = useToast();
  const blocks = useBlocks();
  const remove = useDeleteBlock();

  const onRemove = (id: string, label: string) =>
    Alert.alert(t('owner.freeTime.removeTitle'), label, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('owner.freeTime.remove'),
        style: 'destructive',
        onPress: () => remove.mutateAsync(id).catch((e) => toast(t(`errors.${errorCode(e)}`), 'error')),
      },
    ]);

  return (
    <Screen refreshing={blocks.isRefetching} onRefresh={() => void blocks.refetch()}>
      <View style={{ gap: space.xl }}>
        <Text variant="body" color="textMuted">
          {t('owner.freeTime.subtitle')}
        </Text>
        <Button title={t('owner.freeTime.add')} icon="plus" onPress={() => router.push('/owner/new-block')} />
        {blocks.isPending ? (
          <Loading />
        ) : blocks.isError ? (
          <ErrorState error={blocks.error} onRetry={() => void blocks.refetch()} />
        ) : blocks.data.length === 0 ? (
          <EmptyState icon="freeTime" title={t('owner.freeTime.empty')} />
        ) : (
          blocks.data.map((b, i) => {
            const label = describe(b.local_range, f);
            return (
              <Animated.View key={b.id} entering={FadeInDown.delay(i * 30)} layout={LinearTransition}>
                <Card style={styles.card}>
                  <View style={[styles.icon, { backgroundColor: colors.accentSoft }]}>
                    <Icon name="freeTime" size={18} color="accent" />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text variant="bodyStrong">{label}</Text>
                    {b.reason ? (
                      <Text variant="small" color="textMuted">
                        {b.reason}
                      </Text>
                    ) : null}
                  </View>
                  <Pressable haptic="selection" onPress={() => onRemove(b.id, label)} hitSlop={10} accessibilityLabel={t('owner.freeTime.remove')}>
                    <Icon name="trash" size={18} color="danger" />
                  </Pressable>
                </Card>
              </Animated.View>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  icon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
