import { router } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBusinessSettings } from '@/api/settings';
import { ListGroup, ListRow, Screen } from '@/components/ui';
import { AccountSections } from '@/features/account/AccountSections';
import { space } from '@/theme/tokens';

export default function OwnerSettings() {
  const { t } = useTranslation();
  const settings = useBusinessSettings();
  const s = settings.data;
  return (
    <Screen>
      <View style={{ gap: space.xl }}>
        <ListGroup title={t('owner.settings.studio')}>
          <ListRow icon="sparkles" label={t('owner.settings.studioInfo')} value={s?.studio_name} onPress={() => router.push('/owner/studio')} />
          <ListRow icon="clock" label={t('owner.settings.hours')} onPress={() => router.push('/owner/hours')} />
          <ListRow
            icon="calendar"
            label={t('owner.settings.rules')}
            value={s ? `${s.slot_minutes} min · ${s.slot_capacity}×` : undefined}
            onPress={() => router.push('/owner/rules')}
          />
          <ListRow icon="tag" label={t('owner.settings.services')} onPress={() => router.push('/owner/services')} last />
        </ListGroup>
        <AccountSections />
      </View>
    </Screen>
  );
}
