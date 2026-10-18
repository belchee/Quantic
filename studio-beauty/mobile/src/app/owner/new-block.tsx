import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCreateBlock } from '@/api/owner';
import { useBusinessSettings, useBusinessToday, useWorkingHours } from '@/api/settings';
import { Banner, Button, Chip, Input, Loading, Screen, Segmented, Text, useToast } from '@/components/ui';
import { MonthCalendar } from '@/features/booking/MonthCalendar';
import { timeOptions } from '@/features/owner/timeOptions';
import { useFormat } from '@/i18n/format';
import { addDays, addMinutesToTime } from '@/lib/dates';
import { errorCode } from '@/lib/errors';
import { space } from '@/theme/tokens';

type Kind = 'day' | 'range' | 'slot';

export default function NewBlock() {
  const { t } = useTranslation();
  const f = useFormat();
  const toast = useToast();
  const today = useBusinessToday();
  const settings = useBusinessSettings();
  const hours = useWorkingHours();
  const create = useCreateBlock();

  const [kind, setKind] = useState<Kind>('day');
  const [month, setMonth] = useState<string | undefined>();
  const [from, setFrom] = useState<string | undefined>();
  const [to, setTo] = useState<string | undefined>();
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const opts = useMemo(
    () => (settings.data && hours.data && from ? timeOptions(settings.data, hours.data, from) : null),
    [settings.data, hours.data, from],
  );

  if (!today.data || !settings.data) return <Loading />;
  const visible = month ?? today.data;

  const onDay = (d: string) => {
    setError(null);
    if (kind === 'day' && from && !to && d > from) return setTo(d);
    setFrom(d);
    setTo(undefined);
    setStart(undefined);
    setEnd(undefined);
  };

  const ready = !!from && (kind === 'day' || (kind === 'slot' && !!start) || (kind === 'range' && !!start && !!end && end > start));

  const submit = async () => {
    if (!from) return;
    setError(null);
    try {
      const affected = await create.mutateAsync({
        startDate: from,
        endDate: kind === 'day' ? (to ?? from) : from,
        startTime: kind === 'day' ? null : start,
        endTime: kind === 'day' ? null : kind === 'slot' ? addMinutesToTime(start!, settings.data!.slot_minutes) : end,
        reason: reason.trim() || null,
      });
      if (affected > 0) Alert.alert(t('owner.freeTime.created'), t('owner.freeTime.affected', { n: affected }));
      else toast(t('owner.freeTime.created'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  };

  const summary = from
    ? kind === 'day'
      ? to
        ? `${f.dayMonth(from)} – ${f.dayMonth(to)}`
        : f.fullDate(from)
      : `${f.fullDate(from)}${start ? ` · ${start}${kind === 'range' && end ? `–${end}` : kind === 'slot' ? `–${addMinutesToTime(start, settings.data.slot_minutes)}` : ''}` : ''}`
    : '';

  return (
    <Screen keyboard footer={<Button title={t('owner.freeTime.add')} disabled={!ready} loading={create.isPending} onPress={() => void submit()} />}>
      <View style={{ gap: space.xl }}>
        <View style={{ gap: space.sm }}>
          <Text variant="small" color="textMuted">
            {t('owner.freeTime.type')}
          </Text>
          <Segmented
            value={kind}
            onChange={(k) => {
              setKind(k);
              setTo(undefined);
              setStart(undefined);
              setEnd(undefined);
            }}
            options={[
              { value: 'day', label: t('owner.freeTime.wholeDay') },
              { value: 'range', label: t('owner.freeTime.timeRange') },
              { value: 'slot', label: t('owner.freeTime.singleSlot') },
            ]}
          />
        </View>

        <MonthCalendar
          month={visible}
          onMonthChange={setMonth}
          minMonth={today.data}
          maxMonth={addDays(today.data, 365)}
          selected={to ?? from}
          onSelect={onDay}
          days={undefined}
          today={today.data}
          allSelectable
        />
        {summary ? <Text variant="subheading" align="center">{summary}</Text> : null}

        {kind !== 'day' && from && opts && (
          <View style={{ gap: space.md }}>
            <Text variant="small" color="textMuted">
              {kind === 'slot' ? t('owner.slot') : t('owner.freeTime.from')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
              {opts.starts.map((s) => (
                <Chip key={s} label={s} selected={s === start} onPress={() => { setStart(s); if (end && end <= s) setEnd(undefined); }} />
              ))}
            </ScrollView>
            {kind === 'range' && (
              <>
                <Text variant="small" color="textMuted">
                  {t('owner.freeTime.to')}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
                  {opts.ends.filter((e) => !start || e > start).map((e) => (
                    <Chip key={e} label={e} selected={e === end} onPress={() => setEnd(e)} />
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        )}

        <Input label={t('owner.freeTime.reason')} placeholder={t('owner.freeTime.reasonPlaceholder')} value={reason} onChangeText={setReason} maxLength={120} />
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}
