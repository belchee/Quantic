import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

interface Args {
  title: string;
  startIso: string;
  minutes: number;
  location?: string | null;
  timeZone: string;
}

/** Adds the appointment to the device calendar with a 2-hour alarm. Returns false if not permitted. */
export async function addToCalendar({ title, startIso, minutes, location, timeZone }: Args): Promise<boolean> {
  const { status } = await Calendar.requestCalendarPermissions(true); // iOS 17+: write-only access
  if (status !== 'granted') return false;

  const start = new Date(startIso);
  const end = new Date(start.getTime() + minutes * 60_000);

  let calendar: Calendar.ExpoCalendar | undefined;
  if (Platform.OS === 'ios') {
    calendar = Calendar.getDefaultCalendarSync();
  } else {
    const calendars = await Calendar.getCalendars();
    calendar = calendars.find((c) => c.isPrimary && c.allowsModifications) ?? calendars.find((c) => c.allowsModifications);
  }
  if (!calendar) return false;

  await calendar.createEvent({
    title,
    startDate: start,
    endDate: end,
    timeZone,
    location: location ?? undefined,
    alarms: [{ relativeOffset: -120 }],
  });
  return true;
}
