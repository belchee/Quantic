import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStackOptions } from '@/theme/navigation';

export default function OwnerLayout() {
  const { t } = useTranslation();
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="new-booking" options={{ title: t('owner.newBooking'), presentation: 'modal' }} />
      <Stack.Screen name="new-block" options={{ title: t('owner.freeTime.add'), presentation: 'modal' }} />
      <Stack.Screen name="hours" options={{ title: t('owner.settings.hours') }} />
      <Stack.Screen name="rules" options={{ title: t('owner.settings.rules') }} />
      <Stack.Screen name="studio" options={{ title: t('owner.settings.studioInfo') }} />
      <Stack.Screen name="services/index" options={{ title: t('owner.settings.services') }} />
      <Stack.Screen name="services/[id]" options={{ title: t('owner.settings.editService'), presentation: 'modal' }} />
    </Stack>
  );
}
