import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { ColorName } from '@/theme/tokens';

type Ion = ComponentProps<typeof Ionicons>['name'];

/** Semantic icon set: SF Symbols on iOS, Ionicons elsewhere. */
const ICONS = {
  home: ['house', 'home-outline'],
  calendar: ['calendar', 'calendar-outline'],
  book: ['calendar.badge.plus', 'add-circle-outline'],
  appointments: ['list.bullet.rectangle', 'list-outline'],
  profile: ['person.crop.circle', 'person-circle-outline'],
  today: ['sun.horizon', 'sunny-outline'],
  freeTime: ['moon.zzz', 'moon-outline'],
  settings: ['gearshape', 'settings-outline'],
  clock: ['clock', 'time-outline'],
  phone: ['phone', 'call-outline'],
  location: ['mappin.and.ellipse', 'location-outline'],
  sparkles: ['sparkles', 'sparkles-outline'],
  chevronRight: ['chevron.right', 'chevron-forward'],
  chevronLeft: ['chevron.left', 'chevron-back'],
  close: ['xmark', 'close'],
  check: ['checkmark', 'checkmark'],
  checkCircle: ['checkmark.circle.fill', 'checkmark-circle'],
  trash: ['trash', 'trash-outline'],
  plus: ['plus', 'add'],
  globe: ['globe', 'globe-outline'],
  moon: ['moon', 'moon-outline'],
  bell: ['bell', 'notifications-outline'],
  lock: ['lock', 'lock-closed-outline'],
  signOut: ['rectangle.portrait.and.arrow.right', 'log-out-outline'],
  doc: ['doc.text', 'document-text-outline'],
  help: ['questionmark.circle', 'help-circle-outline'],
  person: ['person', 'person-outline'],
  edit: ['pencil', 'create-outline'],
  calendarAdd: ['calendar.badge.plus', 'calendar-outline'],
  chart: ['chart.bar', 'bar-chart-outline'],
  scissors: ['scissors', 'cut-outline'],
  tag: ['tag', 'pricetag-outline'],
  info: ['info.circle', 'information-circle-outline'],
  warning: ['exclamationmark.triangle', 'warning-outline'],
} as const satisfies Record<string, readonly [SFSymbol, Ion]>;

export type IconName = keyof typeof ICONS | 'instagram';

interface Props {
  name: IconName;
  size?: number;
  color?: ColorName;
  tint?: string;
}

export function Icon({ name, size = 22, color = 'text', tint }: Props) {
  const { colors } = useTheme();
  const c = tint ?? colors[color];
  if (name === 'instagram') return <Ionicons name="logo-instagram" size={size} color={c} />;
  const [sf, ion] = ICONS[name];
  if (Platform.OS === 'ios') {
    return <SymbolView name={sf} size={size} tintColor={c} weight="regular" resizeMode="scaleAspectFit" />;
  }
  return <Ionicons name={ion} size={size} color={c} />;
}
