import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBusinessSettings, useUpdateWorkingHours, useWorkingHours } from '@/api/settings';
import { Banner, Button, Card, Input, Loading, Screen, Text, useToast } from '@/components/ui';
import { resolveHours } from '@/features/hours';
import { useFormat } from '@/i18n/format';
import { errorCode } from '@/lib/errors';
import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

interface Row {
  weekday: number;
  open: string;
  close: string;
  closed: boolean;
}

export default function Hours() {
  const settings = useBusinessSettings();
  const hours = useWorkingHours();
  if (!settings.data || !hours.data) return <Loading />;
  const s = settings.data;
  const initial = resolveHours(s, hours.data).map((d) => ({
    weekday: d.weekday,
    open: d.open ?? s.open_time.slice(0, 5),
    close: d.close ?? s.close_time.slice(0, 5),
    closed: d.open === null,
  }));
  return <HoursForm initial={initial} />;
}

function HoursForm({ initial }: { initial: Row[] }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const toast = useToast();
  const save = useUpdateWorkingHours();
  const [rows, setRows] = useState<Row[]>(initial);
  const [error, setError] = useState<string | null>(null);

  const invalid = (r: Row) => !r.closed && (!TIME.test(r.open) || !TIME.test(r.close) || r.close <= r.open);
  const update = (wd: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.weekday === wd ? { ...r, ...patch } : r)));

  const onSave = async () => {
    setError(null);
    if (rows.some(invalid)) return setError(t('validation.timeOrder'));
    try {
      await save.mutateAsync(rows.map((r) => ({ weekday: r.weekday, open_time: r.open, close_time: r.close, is_closed: r.closed })));
      toast(t('common.saved'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  };

  return (
    <Screen keyboard footer={<Button title={t('common.save')} loading={save.isPending} onPress={() => void onSave()} />}>
      <View style={{ gap: space.md }}>
        <Banner tone="info" text={t('owner.settings.rulesHint')} />
        {rows.map((r) => (
          <Card key={r.weekday} style={{ gap: space.md }}>
            <View style={styles.head}>
              <Text variant="subheading" style={{ flex: 1 }}>
                {f.weekdaysLong[r.weekday - 1]}
              </Text>
              <Text variant="small" color="textMuted">
                {r.closed ? t('owner.settings.closedDay') : `${r.open}–${r.close}`}
              </Text>
              <Switch
                value={!r.closed}
                onValueChange={(v) => update(r.weekday, { closed: !v })}
                trackColor={{ true: colors.primary, false: colors.border }}
                accessibilityLabel={f.weekdaysLong[r.weekday - 1]}
              />
            </View>
            {!r.closed && (
              <View style={styles.times}>
                <View style={{ flex: 1 }}>
                  <Input label={t('owner.settings.open')} value={r.open} onChangeText={(v) => update(r.weekday, { open: v })} keyboardType="numbers-and-punctuation" maxLength={5} error={TIME.test(r.open) ? undefined : t('validation.time')} />
                </View>
                <View style={{ flex: 1 }}>
                  <Input label={t('owner.settings.close')} value={r.close} onChangeText={(v) => update(r.weekday, { close: v })} keyboardType="numbers-and-punctuation" maxLength={5} error={TIME.test(r.close) ? (invalid(r) ? t('validation.timeOrder') : undefined) : t('validation.time')} />
                </View>
              </View>
            )}
          </Card>
        ))}
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  times: { flexDirection: 'row', gap: space.md },
});
