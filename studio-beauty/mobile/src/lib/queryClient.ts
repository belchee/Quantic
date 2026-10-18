import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => count < 2 && !/permission|NOT_ALLOWED|JWT/i.test(String((error as Error)?.message)),
      staleTime: 15_000,
    },
    mutations: { retry: false },
  },
});

// Refetch when the app returns to the foreground.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (status) => focusManager.setFocused(status === 'active'));
}
