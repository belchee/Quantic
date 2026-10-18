import type { ExpoConfig } from 'expo/config';

/**
 * App identity. ⚠️ Confirm with the client before the first EAS build —
 * the bundle identifier cannot be changed after the app is created in App Store Connect.
 */
const BUNDLE_ID = process.env.APP_BUNDLE_ID ?? 'com.studiobeauty.app';
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID; // set after `eas init`

const config: ExpoConfig = {
  name: 'Studio Beauty',
  slug: 'studio-beauty',
  scheme: 'studiobeauty',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  backgroundColor: '#FBF7F4',
  ios: {
    bundleIdentifier: BUNDLE_ID,
    buildNumber: '1',
    supportsTablet: false,
    usesAppleSignIn: true,
    config: { usesNonExemptEncryption: false },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      CFBundleDevelopmentRegion: 'sq',
      CFBundleLocalizations: ['sq', 'mk', 'en'],
      LSApplicationQueriesSchemes: ['instagram'],
    },
    privacyManifests: {
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeName',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
        },
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePhoneNumber',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
        },
        {
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeUserID',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
        },
      ],
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },
  android: {
    package: BUNDLE_ID,
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#F3DED6',
      foregroundImage: './assets/android-icon-foreground.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
  },
  plugins: [
    'expo-router',
    'expo-localization',
    'expo-apple-authentication',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: '#FBF7F4',
        dark: { image: './assets/splash-icon-dark.png', backgroundColor: '#141012' },
      },
    ],
    [
      'expo-notifications',
      { icon: './assets/notification-icon.png', color: '#965C4F' },
    ],
    [
      'expo-calendar',
      {
        writeOnlyAccess: true,
        writeOnlyCalendarPermission:
          'Studio Beauty adds your appointment to your calendar only when you tap “Add to calendar”.',
        calendarPermission:
          'Studio Beauty adds your appointment to your calendar only when you tap “Add to calendar”.',
      },
    ],
  ],
  locales: {
    sq: './locales/sq.json',
    mk: './locales/mk.json',
    en: './locales/en.json',
  },
  experiments: { typedRoutes: true },
  extra: {
    eas: EAS_PROJECT_ID ? { projectId: EAS_PROJECT_ID } : undefined,
  },
  owner: process.env.EAS_OWNER,
};

export default config;
