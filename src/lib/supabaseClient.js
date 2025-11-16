import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

let browserClient;

export const getSupabaseClient = () => {
  if (browserClient) return browserClient;
  browserClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'task-app-session'
    }
  });
  return browserClient;
};
