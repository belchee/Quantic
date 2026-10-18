// Changes the caller's phone number. For phone+password accounts the phone is
// also the login identifier, so the auth e-mail is updated in the same step.
import { corsHeaders, fail, json } from '../_shared/http.ts';
import { E164, isPhoneLoginEmail, loginEmailForPhone } from '../_shared/phone.ts';
import { admin, getCaller } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return fail('METHOD_NOT_ALLOWED', 405);

  const user = await getCaller(req);
  if (!user) return fail('NOT_AUTHENTICATED', 401);

  let phone: unknown;
  try {
    ({ phone } = await req.json());
  } catch {
    return fail('INVALID_BODY');
  }
  if (typeof phone !== 'string' || !E164.test(phone)) return fail('PHONE_INVALID');

  const { data: taken } = await admin.from('profiles').select('id').eq('phone', phone).neq('id', user.id).maybeSingle();
  if (taken) return fail('PHONE_TAKEN', 409);

  if (isPhoneLoginEmail(user.email)) {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      email: loginEmailForPhone(phone),
      email_confirm: true,
    });
    if (error) {
      console.error('updateUserById', error);
      return fail(error.message.includes('already') ? 'PHONE_TAKEN' : 'UPDATE_FAILED', 409);
    }
  }

  const { error } = await admin.from('profiles').update({ phone }).eq('id', user.id);
  if (error) {
    console.error('profiles.update', error);
    return fail(error.code === '23505' ? 'PHONE_TAKEN' : 'UPDATE_FAILED', 409);
  }
  return json({ ok: true, phone });
});
