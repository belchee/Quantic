import { router } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useServices } from '@/api/services';
import { Button, EmptyState, ErrorState, ListGroup, ListRow, Loading, Screen } from '@/components/ui';
import { useFormat } from '@/i18n/format';
import { space } from '@/theme/tokens';

export default function OwnerServices() {
  const { t } = useTranslation();
  const f = useFormat();
  const services = useServices({ includeInactive: true });
  return (
    <Screen refreshing={services.isRefetching} onRefresh={() => void services.refetch()}>
      <View style={{ gap: space.xl }}>
        <Button title={t('owner.settings.addService')} icon="plus" onPress={() => router.push({ pathname: '/owner/services/[id]', params: { id: 'new' } })} />
        {services.isPending ? (
          <Loading />
        ) : services.isError ? (
          <ErrorState error={services.error} onRetry={() => void services.refetch()} />
        ) : services.data.length === 0 ? (
          <EmptyState icon="tag" title={t('services.empty')} />
        ) : (
          <ListGroup>
            {services.data.map((s, i) => (
              <ListRow
                key={s.id}
                label={f.serviceName(s)}
                value={[s.price_mkd != null ? f.price(s.price_mkd) : null, s.active ? null : t('owner.settings.inactive')].filter(Boolean).join(' · ')}
                tone={s.active ? 'text' : 'textSubtle'}
                onPress={() => router.push({ pathname: '/owner/services/[id]', params: { id: s.id } })}
                last={i === services.data.length - 1}
              />
            ))}
          </ListGroup>
        )}
      </View>
    </Screen>
  );
}
