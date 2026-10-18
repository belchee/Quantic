import { useTheme } from './ThemeProvider';
import { fonts } from './tokens';

export function useTabOptions() {
  const { colors } = useTheme();
  return {
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerTitleStyle: { fontFamily: fonts.bodySemibold, fontSize: 17 },
    sceneStyle: { backgroundColor: colors.background },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSubtle,
    tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
    tabBarLabelStyle: { fontFamily: fonts.bodySemibold, fontSize: 11 },
  };
}
