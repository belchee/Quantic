import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { tabIcon } from '@/components/TabIcon';
import { useTabOptions } from '@/theme/tabs';

export default function CustomerTabs() {
  const { t } = useTranslation();
  const options = useTabOptions();
  return (
    <Tabs screenOptions={options}>
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), headerShown: false, tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="services" options={{ title: t('tabs.book'), tabBarIcon: tabIcon('book'), headerTitle: t('booking.stepService') }} />
      <Tabs.Screen name="appointments" options={{ title: t('tabs.appointments'), tabBarIcon: tabIcon('appointments') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: tabIcon('profile') }} />
    </Tabs>
  );
}
