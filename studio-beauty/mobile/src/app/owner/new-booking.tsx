import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAvailability } from '@/api/availability';
import { useOwnerCreateBooking, useSearchClients } from '@/api/owner';
import { useServices } from '@/api/services';
import { useBusinessToday } from '@/api/settings';
import { Banner, Button, Card, Chip, Icon, Input, Loading, Pressable, Screen, Segmented, Text, useToast } from '@/components/ui';
import { MonthCalendar } from '@/features/booking/MonthCalendar';
import { useNow } from '@/hooks/useNow';
import { useFormat } from '@/i18n/format';
import { addDays } from '@/lib/dates';
import { errorCode } from '@/lib/errors';
import { formatPhone, normalizePhone } from '@/lib/phone';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

export default function OwnerNewBooking() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const f = useFormat();
  const toast = useToast();
  const params = useLocalSearchParams<{ date?: string; slotStart?: string }>();
  const today = useBusinessToday();
  const services = useServices();
  const create = useOwnerCreateBooking();

  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [query, setQuery] = useState('');
  const [client, setClient] = useState<{ id: string; full_name: string; phone: string | null } | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [pickedService, setServiceId] = useState<string | null>(null);
  const [month, setMonth] = useState<string | undefined>();
  const [pickedDay, setDay] = useState<string | undefined>(params.date);
  const [slotStart, setSlotStart] = useState<string | undefined>(params.slotStart);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const day = pickedDay ?? today.data;
  const serviceId = pickedService ?? services.data?.[0]?.id ?? null;
  const search = useSearchClients(mode === 'existing' ? query : '');
  const slots = useAvailability(day);
  const now = useNow();

  if (!today.data || !day) return <Loading />;

  const open = (slots.data ?? []).filter((s) => s.status !== 'blocked' && new Date(s.slot_start).getTime() > now - 15 * 60_000);
  const phoneOk = !guestPhone.trim() || normalizePhone(guestPhone) !== null;
  const clientOk = mode === 'existing' ? !!client : guestName.trim().length >= 2 && phoneOk;
  const ready = clientOk && !!slotStart && !!serviceId;

  const submit = async () => {
    setError(null);
    try {
      await create.mutateAsync({
        slotStart: slotStart!,
        serviceId,
        customerId: mode === 'existing' ? client!.id : null,
        guestName: mode === 'new' ? guestName.trim() : null,
        guestPhone: mode === 'new' && guestPhone.trim() ? normalizePhone(guestPhone) : null,
        notes: notes.trim() || null,
      });
      toast(t('owner.created'));
      router.back();
    } catch (e) {
      setError(t(`errors.${errorCode(e)}`));
    }
  };

  return (
    <Screen keyboard footer={<Button title={t('owner.newBooking')} icon="checkCircle" disabled={!ready} loading={create.isPending} onPress={() => void submit()} />}>
      <View style={{ gap: space.xl }}>
        <View style={{ gap: space.md }}>
          <Text variant="overline" color="textMuted">
            {t('owner.client')}
          </Text>
          <Segmented
            value={mode}
            onChange={(m) => {
              setMode(m);
              setClient(null);
            }}
            options={[
              { value: 'new', label: t('owner.newClient') },
              { value: 'existing', label: t('owner.existingClient') },
            ]}
          />
          {mode === 'new' ? (
            <>
              <Input label={t('owner.clientName')} value={guestName} onChangeText={setGuestName} autoCapitalize="words" />
              <Input
                label={`${t('owner.clientPhone')} (${t('common.optional')})`}
                value={guestPhone}
                onChangeText={setGuestPhone}
                keyboardType="phone-pad"
                placeholder={t('auth.phoneHint')}
                error={phoneOk ? undefined : t('validation.phoneInvalid')}
              />
            </>
          ) : client ? (
            <Card tone="primary" style={styles.selected}>
              <Icon name="person" size={18} color="onPrimarySoft" />
              <View style={{ flex: 1 }}>
                <Text variant="bodyStrong">{client.full_name}</Text>
                <Text variant="caption" color="textMuted">
                  {formatPhone(client.phone)}
                </Text>
              </View>
              <Pressable haptic="selection" onPress={() => setClient(null)} hitSlop={10} accessibilityLabel={t('common.close')}>
                <Icon name="close" size={16} color="onPrimarySoft" />
              </Pressable>
            </Card>
          ) : (
            <>
              <Input label={t('owner.searchClient')} value={query} onChangeText={setQuery} autoCorrect={false} />
              {search.data?.map((c) => (
                <Pressable key={c.id} haptic="selection" onPress={() => setClient(c)} style={[styles.result, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                  <Text variant="bodyStrong" style={{ flex: 1 }}>
                    {c.full_name}
                  </Text>
                  <Text variant="small" color="textMuted">
                    {formatPhone(c.phone)}
                  </Text>
                </Pressable>
              ))}
            </>
          )}
        </View>

        {services.data && services.data.length > 0 && (
          <View style={{ gap: space.md }}>
            <Text variant="overline" color="textMuted">
              {t('booking.service')}
            </Text>
            <View style={styles.wrap}>
              {services.data.map((s) => (
                <Chip key={s.id} label={f.serviceName(s)} selected={s.id === serviceId} onPress={() => setServiceId(s.id)} />
              ))}
            </View>
          </View>
        )}

        <View style={{ gap: space.md }}>
          <Text variant="overline" color="textMuted">
            {t('booking.date')}
          </Text>
          <MonthCalendar
            month={month ?? day}
            onMonthChange={setMonth}
            minMonth={today.data}
            maxMonth={addDays(today.data, 365)}
            selected={day}
            onSelect={(d) => {
              setDay(d);
              setSlotStart(undefined);
            }}
            days={undefined}
            today={today.data}
            allSelectable
          />
        </View>

        <View style={{ gap: space.md }}>
          <Text variant="overline" color="textMuted">
            {t('owner.slot')}
          </Text>
          {slots.isPending ? (
            <Loading />
          ) : open.length === 0 ? (
            <Text variant="body" color="textMuted">
              {t('booking.noSlots')}
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
              {open.map((s) => (
                <Pressable
                  key={s.slot_start}
                  haptic="selection"
                  disabled={s.remaining === 0}
                  onPress={() => setSlotStart(s.slot_start)}
                  style={[
                    styles.slot,
                    {
                      borderColor: s.slot_start === slotStart ? colors.primary : colors.border,
                      backgroundColor: s.slot_start === slotStart ? colors.primary : s.remaining === 0 ? colors.surfaceMuted : colors.surface,
                    },
                  ]}
                >
                  <Text variant="bodyStrong" style={{ color: s.slot_start === slotStart ? colors.onPrimary : s.remaining === 0 ? colors.textSubtle : colors.text }}>
                    {s.local_time}
                  </Text>
                  <Text variant="caption" style={{ color: s.slot_start === slotStart ? colors.onPrimary : colors.textMuted }}>
                    {s.remaining === 0 ? t('booking.full') : `${s.remaining}/${s.capacity}`}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <Input label={t('booking.notes')} value={notes} onChangeText={setNotes} multiline maxLength={500} />
        {error && <Banner tone="danger" text={error} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  selected: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  result: { flexDirection: 'row', alignItems: 'center', padding: space.md, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  slot: { borderWidth: 1, borderRadius: radius.md, paddingVertical: space.sm, paddingHorizontal: space.md, alignItems: 'center', minWidth: 72 },
});
