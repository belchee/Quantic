import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

/**
 * After signing in: ask for missing name/phone, otherwise close the auth modal
 * and return the user to where they were (e.g. the booking confirmation).
 */
export async function finishAuth() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  const { data: p } = await supabase.from('profiles').select('full_name, phone').eq('id', data.user.id).single();
  if (!p?.phone || p.full_name.trim().length < 2) {
    router.replace('/auth/complete-profile');
    return;
  }
  if (router.canDismiss()) router.dismissAll();
  else router.replace('/');
}
