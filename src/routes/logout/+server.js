import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals, cookies }) => {
  await locals.supabase.auth.signOut();
  cookies.delete('remember_email', { path: '/' });
  throw redirect(303, '/login');
};
