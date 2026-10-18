import { Stack } from 'expo-router';
import { useStackOptions } from '@/theme/navigation';

export default function AuthLayout() {
  const options = useStackOptions();
  return <Stack screenOptions={{ ...options, headerShown: false }} />;
}
