import type { Session } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import i18n from '@/i18n';
import { qk } from '@/api/keys';
import { AppError, functionErrorCode } from '@/lib/errors';
import { loginEmailForPhone } from '@/lib/phone';
import { preferences } from '@/lib/preferences';
import { supabase } from '@/lib/supabase';
import type { AppLanguage, Profile } from '@/types/database';
import { unregisterPushToken } from '@/features/notifications/push';

interface AuthContextValue {
  ready: boolean;
  session: Session | null;
  profile: Profile | null;
  profileLoading: boolean;
  isOwner: boolean;
  isProfileComplete: boolean;
  signIn: (phoneE164: string, password: string) => Promise<void>;
  signUp: (args: { fullName: string; phoneE164: string; password: string }) => Promise<void>;
  signInWithApple: () => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (patch: { full_name?: string; language?: AppLanguage }) => Promise<void>;
  changePhone: (phoneE164: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const uid = session?.user.id;
  const profileQuery = useQuery({
    queryKey: qk.profile(uid),
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', uid!).single();
      if (error) throw error;
      return data;
    },
  });
  const profile = uid ? (profileQuery.data ?? null) : null;

  // Adopt the account's language on a fresh device (no local choice yet).
  useEffect(() => {
    if (!profile) return;
    void preferences.getLanguage().then((local) => {
      if (!local && profile.language !== i18n.language) void i18n.changeLanguage(profile.language);
    });
  }, [profile]);

  const refreshProfile = useCallback(() => qc.invalidateQueries({ queryKey: qk.profile(uid) }), [qc, uid]);

  const signIn = useCallback(async (phoneE164: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmailForPhone(phoneE164), password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (args: { fullName: string; phoneE164: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: loginEmailForPhone(args.phoneE164),
      password: args.password,
      options: { data: { full_name: args.fullName.trim(), language: i18n.language } },
    });
    if (error) throw error;
    // Supabase returns a user without identities when the identifier already exists.
    if (data.user && data.user.identities?.length === 0) throw new AppError('USER_EXISTS');
  }, []);

  const signInWithApple = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
      });
      if (!credential.identityToken) throw new AppError('UNKNOWN');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      if (error) throw error;
      // Apple only shares the name on the very first sign-in.
      const name = [credential.fullName?.givenName, credential.fullName?.familyName].filter(Boolean).join(' ');
      if (name && data.user) {
        await supabase.from('profiles').update({ full_name: name }).eq('id', data.user.id).eq('full_name', '');
      }
      return true;
    } catch (e) {
      if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') return false;
      throw e;
    }
  }, []);

  const signOut = useCallback(async () => {
    await unregisterPushToken();
    await supabase.auth.signOut();
    qc.clear();
  }, [qc]);

  const updateProfile = useCallback(
    async (patch: { full_name?: string; language?: AppLanguage }) => {
      if (!uid) return;
      const { error } = await supabase.from('profiles').update(patch).eq('id', uid);
      if (error) throw error;
      await refreshProfile();
    },
    [uid, refreshProfile],
  );

  const changePhone = useCallback(
    async (phoneE164: string) => {
      const { error } = await supabase.functions.invoke('change-phone', { body: { phone: phoneE164 } });
      if (error) throw new AppError(await functionErrorCode(error));
      await supabase.auth.refreshSession();
      await refreshProfile();
    },
    [refreshProfile],
  );

  const deleteAccount = useCallback(async () => {
    const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
    if (error) throw new AppError(await functionErrorCode(error));
    await preferences.setPushToken(null);
    await supabase.auth.signOut({ scope: 'local' });
    qc.clear();
  }, [qc]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      session,
      profile,
      profileLoading: !!uid && profileQuery.isPending,
      isOwner: profile?.role === 'owner',
      isProfileComplete: !!profile?.phone && profile.full_name.trim().length > 1,
      signIn,
      signUp,
      signInWithApple,
      signOut,
      updateProfile,
      changePhone,
      deleteAccount,
    }),
    [ready, session, profile, uid, profileQuery.isPending, signIn, signUp, signInWithApple, signOut, updateProfile, changePhone, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
