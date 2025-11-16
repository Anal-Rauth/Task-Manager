import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  const session = await locals.getSession();

  const pathname = url.pathname;
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // 1) If NOT logged in and visiting a protected route → go to login
  if (!session && !isAuthRoute) {
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(pathname + url.search)}`);
  }

  // 2) If logged in and visiting an auth route → send to home (or redirectTo)
  if (session && isAuthRoute) {
    const redirectTo = url.searchParams.get('redirectTo');
    throw redirect(303, redirectTo ?? '/');
  }

  // 3) Otherwise just load normally
  return { session };
};
