import type { ColorValue } from 'react-native';
import { Icon, type IconName } from '@/components/ui';

export const tabIcon = (name: IconName) =>
  function TabIcon({ color }: { color: ColorValue }) {
    return <Icon name={name} size={22} tint={String(color)} />;
  };
