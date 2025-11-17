<script>
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { toast } from '$lib/components/ui/use-toast.js';

  let loading = false;
  let successMessage = '';
  let errorMessage = '';
  let sessionReady = false; // we’ll set this once we process the recovery link

  let formEl; // 

  // ✅ 1. When the page loads from the email link, read tokens & set session
  onMount(async () => {
    if (!browser) return;

    // Clear any stale values when the page loads
    formEl?.reset();

    try {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;

      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      if (type !== 'recovery' || !access_token || !refresh_token) {
        errorMessage = 'Your reset link is invalid or has expired. Please request a new one.';
        return;
      }

      const { getSupabaseClient } = await import('$lib/supabaseClient.js');
      const supabase = getSupabaseClient();

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });

      if (error) {
        console.error('Error setting recovery session:', error);
        errorMessage = 'Could not start a reset session. Please request a new reset link.';
        return;
      }

      // Optional: clean up the URL (remove the # tokens)
      history.replaceState(null, '', window.location.pathname + window.location.search);

      sessionReady = true;
    } catch (err) {
      console.error('Unexpected error initializing recovery session:', err);
      errorMessage = 'Unexpected error. Please request a new reset link.';
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();

    if (!browser) return;

    successMessage = '';
    errorMessage = '';

    if (!sessionReady) {
      errorMessage = 'Auth session missing. Please use the latest reset link from your email.';
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '').trim();
    const confirmPassword = String(formData.get('confirmPassword') || '').trim();

    if (!password || !confirmPassword) {
      errorMessage = 'Please fill in both password fields.';
      return;
    }

    if (password.length < 8) {
      errorMessage = 'Password should be at least 8 characters long.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
      return;
    }

    loading = true;

    try {
      const { getSupabaseClient } = await import('$lib/supabaseClient.js');
      const supabase = getSupabaseClient();

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Supabase updateUser error:', error);
        errorMessage = error.message;

        toast({
          title: 'Could not update password',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        successMessage = 'Your password has been updated. You can now sign in.';

        toast({
          title: 'Password updated',
          description: 'You can now log in with your new password.'
        });
      }
    } catch (err) {
      console.error('Unexpected error in new-password handler:', err);
      const description = err?.message ?? 'Unexpected error. Please try again.';
      errorMessage = description;

      toast({
        title: 'Unexpected error',
        description,
        variant: 'destructive'
      });
    } finally {
      loading = false;
    }
  }
</script>

<div class="mx-auto flex w-full max-w-md flex-col gap-6">
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold">Set a new password</h1>
    <p class="text-sm text-muted-foreground">
      Choose a strong password you haven’t used before.
    </p>
  </div>

  <form
    class="space-y-5"
    bind:this={formEl}
    on:submit|preventDefault={handleSubmit}
  >
    <div class="space-y-2">
      <Label forId="password">New password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        required
      />
      <p class="text-xs text-muted-foreground">
        Minimum 8 characters. Use a mix of letters, numbers, and symbols.
      </p>
    </div>

    <div class="space-y-2">
      <Label forId="confirmPassword">Confirm new password</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        required
      />
    </div>

    <Button type="submit" class="w-full" disabled={loading}>
      {#if loading}
        Updating password…
      {:else}
        Update password
      {/if}
    </Button>

    {#if errorMessage}
      <p class="text-center text-sm text-destructive mt-1">{errorMessage}</p>
    {/if}

    {#if successMessage}
      <p class="text-center text-sm text-emerald-500 mt-1">
        {successMessage}
        <br />
        <a href="/login" class="text-primary hover:underline">Back to Sign in</a>
      </p>
    {/if}
  </form>
</div>
