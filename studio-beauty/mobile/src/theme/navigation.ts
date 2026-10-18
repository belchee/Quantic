import { useTheme } from './ThemeProvider';
import { fonts } from './tokens';

/** Shared native-stack header styling. */
export function useStackOptions() {
  const { colors } = useTheme();
  return {
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerTitleStyle: { fontFamily: fonts.bodySemibold, fontSize: 17, color: colors.text },
    headerLargeTitleStyle: { fontFamily: fonts.display, color: colors.text },
    headerBackButtonDisplayMode: 'minimal' as const,
    contentStyle: { backgroundColor: colors.background },
  };
}
