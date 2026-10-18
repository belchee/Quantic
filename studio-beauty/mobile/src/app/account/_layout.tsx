import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useStackOptions } from '@/theme/navigation';

export default function AccountLayout() {
  const { t } = useTranslation();
  const options = useStackOptions();
  return (
    <Stack screenOptions={options}>
      <Stack.Screen name="edit" options={{ title: t('profile.editProfile') }} />
      <Stack.Screen name="language" options={{ title: t('profile.language') }} />
    </Stack>
  );
}
