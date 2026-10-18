import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { CormorantGaramond_500Medium_Italic } from '@expo-google-fonts/cormorant-garamond/500Medium_Italic';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '@/i18n';
import { ToastProvider } from '@/components/ui';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { initLanguage } from '@/features/language';
import { usePushRouting } from '@/features/notifications/usePushRouting';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useStackOptions } from '@/theme/navigation';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    void initLanguage().finally(() => setLanguageReady(true));
  }, []);

  if ((!fontsLoaded && !fontError) || !languageReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <RootNavigator />
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { ready, isOwner, profileLoading } = useAuth();
  const { colors, scheme } = useTheme();
  const stackOptions = useStackOptions();

  const loading = !ready || profileLoading;

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  useEffect(() => {
    if (!loading) void SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {Platform.OS !== 'web' && <PushRouting />}
      <Stack screenOptions={stackOptions}>
        {/* Customers and guests */}
        <Stack.Protected guard={!isOwner}>
          <Stack.Screen name="(customer)" options={{ headerShown: false }} />
          <Stack.Screen name="book" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Studio owner */}
        <Stack.Protected guard={isOwner}>
          <Stack.Screen name="owner" options={{ headerShown: false }} />
        </Stack.Protected>

        {/* Shared */}
        <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

/** Push registration + notification taps (native only). */
function PushRouting() {
  usePushRouting();
  return null;
}
