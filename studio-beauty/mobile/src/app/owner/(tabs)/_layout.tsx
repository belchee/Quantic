import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { tabIcon } from '@/components/TabIcon';
import { useTabOptions } from '@/theme/tabs';

export default function OwnerTabs() {
  const { t } = useTranslation();
  const options = useTabOptions();
  return (
    <Tabs screenOptions={options}>
      <Tabs.Screen name="index" options={{ title: t('tabs.today'), headerShown: false, tabBarIcon: tabIcon('today') }} />
      <Tabs.Screen name="calendar" options={{ title: t('tabs.calendar'), tabBarIcon: tabIcon('calendar') }} />
      <Tabs.Screen name="free-time" options={{ title: t('tabs.freeTime'), tabBarIcon: tabIcon('freeTime') }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings'), tabBarIcon: tabIcon('settings') }} />
    </Tabs>
  );
}
