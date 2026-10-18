// Push notification texts. Pure functions (no Deno APIs) so they can be unit-tested.

export type Lang = 'sq' | 'mk' | 'en';
export type Kind =
  | 'booking_confirmed'
  | 'booking_cancelled_by_studio'
  | 'reminder_24h'
  | 'reminder_2h'
  | 'owner_new_booking'
  | 'owner_booking_cancelled';

export interface Payload {
  local_date?: string; // YYYY-MM-DD (Europe/Skopje)
  local_time?: string; // HH:MM
  client_name?: string | null;
  service_sq?: string | null;
  service_mk?: string | null;
  service_en?: string | null;
}

const MONTHS: Record<Lang, string[]> = {
  sq: ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'],
  mk: ['јануари', 'февруари', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септември', 'октомври', 'ноември', 'декември'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export function formatDay(isoDate: string | undefined, lang: Lang): string {
  if (!isoDate) return '';
  const [, m, d] = isoDate.split('-').map(Number);
  return lang === 'en' ? `${MONTHS.en[m - 1]} ${d}` : `${d} ${MONTHS[lang][m - 1]}`;
}

type Builder = (p: { when: string; time: string; service: string; client: string }) => { title: string; body: string };

const T: Record<Lang, Record<Kind, Builder>> = {
  sq: {
    booking_confirmed: (p) => ({ title: 'Termini u konfirmua', body: `${p.when}, ora ${p.time}${p.service ? ` · ${p.service}` : ''}. Ju presim!` }),
    booking_cancelled_by_studio: (p) => ({ title: 'Termini u anulua', body: `Studio anuloi terminin tuaj më ${p.when}, ora ${p.time}. Na vjen keq — zgjidhni një orar tjetër në aplikacion.` }),
    reminder_24h: (p) => ({ title: 'Kujtesë për terminin', body: `Termini juaj: ${p.when}, ora ${p.time}${p.service ? ` · ${p.service}` : ''}.` }),
    reminder_2h: (p) => ({ title: 'Termini juaj së shpejti', body: `Sot në orën ${p.time}. Shihemi në Studio Beauty!` }),
    owner_new_booking: (p) => ({ title: 'Rezervim i ri', body: `${p.client} · ${p.when}, ${p.time}${p.service ? ` · ${p.service}` : ''}` }),
    owner_booking_cancelled: (p) => ({ title: 'Rezervim i anuluar', body: `${p.client} anuloi ${p.when}, ${p.time}` }),
  },
  mk: {
    booking_confirmed: (p) => ({ title: 'Терминот е потврден', body: `${p.when}, во ${p.time}${p.service ? ` · ${p.service}` : ''}. Ве очекуваме!` }),
    booking_cancelled_by_studio: (p) => ({ title: 'Терминот е откажан', body: `Студиото го откажа вашиот термин на ${p.when} во ${p.time}. Изберете друг термин во апликацијата.` }),
    reminder_24h: (p) => ({ title: 'Потсетник за термин', body: `Вашиот термин: ${p.when}, во ${p.time}${p.service ? ` · ${p.service}` : ''}.` }),
    reminder_2h: (p) => ({ title: 'Вашиот термин наскоро', body: `Денес во ${p.time}. Се гледаме во Studio Beauty!` }),
    owner_new_booking: (p) => ({ title: 'Нова резервација', body: `${p.client} · ${p.when}, ${p.time}${p.service ? ` · ${p.service}` : ''}` }),
    owner_booking_cancelled: (p) => ({ title: 'Откажана резервација', body: `${p.client} откажа ${p.when}, ${p.time}` }),
  },
  en: {
    booking_confirmed: (p) => ({ title: 'Appointment confirmed', body: `${p.when} at ${p.time}${p.service ? ` · ${p.service}` : ''}. See you soon!` }),
    booking_cancelled_by_studio: (p) => ({ title: 'Appointment cancelled', body: `The studio cancelled your appointment on ${p.when} at ${p.time}. Please pick another time in the app.` }),
    reminder_24h: (p) => ({ title: 'Appointment reminder', body: `Your appointment: ${p.when} at ${p.time}${p.service ? ` · ${p.service}` : ''}.` }),
    reminder_2h: (p) => ({ title: 'Your appointment is soon', body: `Today at ${p.time}. See you at Studio Beauty!` }),
    owner_new_booking: (p) => ({ title: 'New booking', body: `${p.client} · ${p.when}, ${p.time}${p.service ? ` · ${p.service}` : ''}` }),
    owner_booking_cancelled: (p) => ({ title: 'Booking cancelled', body: `${p.client} cancelled ${p.when}, ${p.time}` }),
  },
};

export function buildMessage(kind: Kind, lang: Lang, payload: Payload) {
  const l: Lang = lang in T ? lang : 'sq';
  const service = (l === 'mk' ? payload.service_mk : l === 'en' ? payload.service_en : payload.service_sq) ?? '';
  const client = payload.client_name || (l === 'mk' ? 'Клиент' : l === 'en' ? 'Client' : 'Klient');
  return T[l][kind]({ when: formatDay(payload.local_date, l), time: payload.local_time ?? '', service, client });
}
