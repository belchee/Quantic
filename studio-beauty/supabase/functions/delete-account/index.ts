// Deletes the caller's account and personal data (App Store guideline 5.1.1(v)).
// 1. cancels future bookings (frees the seats, notifies the owner),
// 2. scrubs notes and push tokens,
// 3. deletes the auth user → cascades to the profile; bookings keep no PII
//    (customer_id is set to NULL).
import { corsHeaders, fail, json } from '../_shared/http.ts';
import { admin, getCaller } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return fail('METHOD_NOT_ALLOWED', 405);

  const user = await getCaller(req);
  if (!user) return fail('NOT_AUTHENTICATED', 401);

  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role === 'owner') {
    const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'owner');
    if ((count ?? 0) <= 1) return fail('LAST_OWNER', 409); // keep the studio manageable
  }

  const { error: prepError } = await admin.rpc('prepare_account_deletion', { p_user_id: user.id });
  if (prepError) {
    console.error('prepare_account_deletion', prepError);
    return fail('DELETE_FAILED', 500);
  }

  const { error: delError } = await admin.auth.admin.deleteUser(user.id);
  if (delError) {
    console.error('deleteUser', delError);
    return fail('DELETE_FAILED', 500);
  }

  return json({ ok: true });
});
