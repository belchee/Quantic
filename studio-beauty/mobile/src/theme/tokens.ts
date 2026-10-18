/**
 * Studio Beauty design tokens.
 * Palette: warm ivory, nude & blush with a rose-clay accent (light);
 * deep plum-black with rose-gold (dark). Swap here once the client confirms brand colours.
 */
export const palettes = {
  light: {
    background: '#FBF7F4',
    surface: '#FFFFFF',
    surfaceMuted: '#F5EDE7',
    surfaceRaised: '#FFFFFF',
    border: '#EADFD7',
    borderStrong: '#D9C7BC',
    text: '#2B2024',
    textMuted: '#7A676C',
    textSubtle: '#806D72',
    primary: '#965C4F',
    primaryPressed: '#82493D',
    onPrimary: '#FFFFFF',
    primarySoft: '#F3DED6',
    onPrimarySoft: '#7A4A3F',
    accent: '#8C6A3F',
    accentSoft: '#F1E6D6',
    success: '#4F7F63',
    successSoft: '#E3EFE7',
    warning: '#8C5B20',
    warningSoft: '#F6EBDA',
    danger: '#A8434E',
    dangerSoft: '#F7E1E3',
    overlay: 'rgba(43, 32, 36, 0.35)',
    shadow: '#7A4A3F',
    heroStart: '#F7E7DF',
    heroEnd: '#FBF7F4',
  },
  dark: {
    background: '#141012',
    surface: '#1D171A',
    surfaceMuted: '#262024',
    surfaceRaised: '#2A2327',
    border: '#3A3035',
    borderStrong: '#4C4046',
    text: '#F6EEEA',
    textMuted: '#BBA9AE',
    textSubtle: '#8C7B80',
    primary: '#E2B3A0',
    primaryPressed: '#D29D88',
    onPrimary: '#2A1A17',
    primarySoft: '#3B2A2A',
    onPrimarySoft: '#F0CDBF',
    accent: '#D7BC90',
    accentSoft: '#352D24',
    success: '#8EC3A2',
    successSoft: '#20302A',
    warning: '#E2B66F',
    warningSoft: '#352A1B',
    danger: '#EC8E98',
    dangerSoft: '#3A2226',
    overlay: 'rgba(0, 0, 0, 0.55)',
    shadow: '#000000',
    heroStart: '#2A1E21',
    heroEnd: '#141012',
  },
} as const;

export type ColorName = keyof (typeof palettes)['light'];
export type Colors = Record<ColorName, string>;

export const fonts = {
  display: 'CormorantGaramond_500Medium',
  displaySemibold: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemibold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, letterSpacing: -0.5 },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.displaySemibold, fontSize: 24, lineHeight: 30 },
  subheading: { fontFamily: fonts.bodySemibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bodySemibold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fonts.bodySemibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
  overline: { fontFamily: fonts.bodyBold, fontSize: 11, lineHeight: 14, letterSpacing: 1.6, textTransform: 'uppercase' as const },
} as const;

export type TypeVariant = keyof typeof type;
