import { fail, redirect } from '@sveltejs/kit';
import { registerSchema } from '$lib/validation/auth.js';

const formatErrors = (error) => {
  const { fieldErrors } = error.flatten();
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]])
  );
};

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const raw = {
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      remember: false
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return fail(400, {
        errors: formatErrors(parsed.error),
        values: { email: raw.email }
      });
    }

    const { email, password } = parsed.data;
    const { error } = await locals.supabase.auth.signUp({ email, password });

    if (error) {
      return fail(400, {
        values: { email },
        message: error.message
      });
    }

    // ✅ Signup succeeded: send user to login with a success flag
    throw redirect(303, '/auth/login?registered=1');
  }
};
