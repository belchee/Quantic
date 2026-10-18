import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStackOptions } from '@/theme/navigation';

export default function BookLayout() {
  const { t } = useTranslation();
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="time" options={{ title: t('booking.stepTime') }} />
      <Stack.Screen name="confirm" options={{ title: t('booking.stepConfirm') }} />
      <Stack.Screen name="success" options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />
    </Stack>
  );
}
