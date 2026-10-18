import { useTranslation } from 'react-i18next';
import { isoWeekday, parts, type DateKey } from '@/lib/dates';
import type { AppLanguage, Service } from '@/types/database';

/** Date/label formatting from translation tables (no Intl locale data needed on device). */
export function useFormat() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as AppLanguage) ?? 'sq';
  const months = t('months.long', { returnObjects: true }) as string[];
  const weekdaysLong = t('weekdays.long', { returnObjects: true }) as string[];
  const weekdaysShort = t('weekdays.short', { returnObjects: true }) as string[];

  const dayMonth = (key: DateKey) => {
    const { month, day } = parts(key);
    return t('months.dayMonth', { day, month: months[month - 1] });
  };

  const fullDate = (key: DateKey) => {
    const { month, day } = parts(key);
    return t('months.full', { weekday: weekdaysLong[isoWeekday(key) - 1], day, month: months[month - 1] });
  };

  const relativeDate = (key: DateKey, today: DateKey | undefined) => {
    if (today && key === today) return `${t('common.today')}, ${dayMonth(key)}`;
    return fullDate(key);
  };

  const monthTitle = (key: DateKey) => {
    const { year, month } = parts(key);
    const name = months[month - 1] ?? '';
    return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
  };

  const serviceName = (s: Pick<Service, 'name_sq' | 'name_mk' | 'name_en'> | null | undefined) =>
    s ? (lang === 'mk' ? s.name_mk : lang === 'en' ? s.name_en : s.name_sq) : '';

  const serviceDescription = (s: Pick<Service, 'description_sq' | 'description_mk' | 'description_en'>) =>
    (lang === 'mk' ? s.description_mk : lang === 'en' ? s.description_en : s.description_sq) ?? '';

  const price = (mkd: number | null | undefined) =>
    mkd == null ? '' : t('common.price', { price: mkd.toLocaleString('en-US').replace(/,/g, '.') });

  return {
    lang,
    weekdaysShort,
    weekdaysLong,
    dayMonth,
    fullDate,
    relativeDate,
    monthTitle,
    serviceName,
    serviceDescription,
    price,
  };
}
