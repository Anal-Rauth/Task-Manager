import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/validation/auth.js';

export const load = async ({ cookies, url }) => {
  const rememberedEmail = cookies.get('remember_email') ?? '';

  return {
    rememberedEmail,
    redirectTo: url.searchParams.get('redirectTo') ?? '/',
    // ✅ Whether the user just came from successful registration
    justRegistered: url.searchParams.get('registered') === '1'
  };
};

const formatErrors = (error) => {
  const { fieldErrors } = error.flatten();
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
  );
};

export const actions = {
  default: async ({ request, locals, cookies, url }) => {
    const formData = await request.formData();
    const raw = {
      email: formData.get('email'),
      password: formData.get('password'),
      remember: formData.get('remember') === 'on'
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        errors: formatErrors(parsed.error),
        values: raw,
        message: 'Please fix the highlighted errors.'
      });
    }

    const { email, password, remember } = parsed.data;
    const {
      data: { session },
      error
    } = await locals.supabase.auth.signInWithPassword({ email, password });

    if (error || !session) {
      const message =
        error?.message === 'Invalid login credentials'
          ? 'Invalid email or password, or your email is not confirmed yet.'
          : error?.message ?? 'Unable to log in with those credentials.';

      return fail(400, {
        values: { email, remember },
        message
      });
    }

    if (remember) {
      cookies.set('remember_email', email, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    } else {
      cookies.delete('remember_email', { path: '/' });
    }

    // ✅ Login succeeded: redirect to dashboard or redirectTo
    throw redirect(303, url.searchParams.get('redirectTo') ?? '/');
  }
};
