<script>
  import '../app.css';
  import { onMount, setContext } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { getSupabaseClient } from '$lib/supabaseClient';
  import { writable } from 'svelte/store';
  import { Moon, Sun } from 'lucide-svelte';
  import Toaster from '$lib/components/ui/toaster.svelte';

  export let data;

  let session = data?.session ?? null;
  $: if (data && 'session' in data) {
    session = data.session;
  }

  const theme = writable('light');
  const supabase = browser ? getSupabaseClient() : null;
  setContext('supabase', supabase);

  const handleTheme = (value) => {
    theme.set(value);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(value);
    localStorage.setItem('theme', value);
  };

  onMount(() => {
    if (!browser) return;
    const stored = localStorage.getItem('theme');
    handleTheme(stored ?? 'light');
  });

  const toggleTheme = () => {
    const next = $theme === 'light' ? 'dark' : 'light';
    handleTheme(next);
  };

  const logout = async () => {
    await fetch('/logout', { method: 'POST' });
    session = null;
    await goto('/login');
  };
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="flex min-h-screen flex-1 flex-col bg-background">
  <header class="border-b bg-card/60 backdrop-blur">
    <div class="container flex h-16 items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-2 font-semibold">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">TM</span>
        <span class="hidden text-lg sm:inline">Task Manager</span>
      </a>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background shadow-sm transition-colors hover:bg-muted"
          on:click={toggleTheme}
          aria-label="Toggle theme"
        >
          {#if $theme === 'light'}
            <Moon class="h-4 w-4" />
          {:else}
            <Sun class="h-4 w-4" />
          {/if}
        </button>
        {#if session}
          <div class="hidden flex-col text-right text-sm sm:flex">
            <span class="font-medium">{session.user.email}</span>
          </div>
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground shadow transition-colors hover:bg-destructive/80"
            on:click={logout}
          >
            Logout
          </button>
        {:else}
          <a
            class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/80"
            href="/login"
          >
            Sign in
          </a>
        {/if}
      </div>
    </div>
  </header>
  <main class="container flex-1 py-8">
    <slot />
  </main>
  <footer class="border-t bg-card/60 py-4 text-center text-sm text-muted-foreground">
    Built with SvelteKit · Supabase · shadcn-svelte
  </footer>
</div>

<Toaster />
