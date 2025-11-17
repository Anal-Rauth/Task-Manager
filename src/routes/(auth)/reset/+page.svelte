<script>
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import { browser } from '$app/environment';
  import { toast } from '$lib/components/ui/use-toast.js';

  let loading = false;
  let successMessage = '';
  let errorMessage = '';

  async function handleSubmit(event) {
    event.preventDefault();

    if (!browser) return;

    successMessage = '';
    errorMessage = '';

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();

    if (!email) {
      errorMessage = 'Please enter your email address.';
      return;
    }

    loading = true;

    try {
      const { getSupabaseClient } = await import('$lib/supabaseClient.js');
      const supabase = getSupabaseClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`
      });

      if (error) {
        console.error('Supabase reset error:', error);
        errorMessage = error.message;

        toast({
          title: 'Could not send reset link',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        successMessage =
          'If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.';

        toast({
          title: 'Check your email',
          description:
            'If we found an account for that email, you will receive a password reset link shortly.'
        });
      }
    } catch (err) {
      console.error('Unexpected error in reset handler:', err);
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
    <h1 class="text-2xl font-semibold">Reset your password</h1>
    <p class="text-sm text-muted-foreground">
      Enter the email associated with your account and we&apos;ll send you a reset link.
    </p>
  </div>

  <form class="space-y-5" on:submit|preventDefault={handleSubmit}>
    <div class="space-y-2">
      <Label forId="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        autocapitalize="none"
        autocorrect="off"
        required
        value=""          
      />
    </div>

    <Button type="submit" class="w-full" disabled={loading}>
      {#if loading}
        Sending reset link…
      {:else}
        Send reset link
      {/if}
    </Button>

    {#if errorMessage}
      <p class="text-center text-sm text-destructive mt-1">{errorMessage}</p>
    {/if}

    {#if successMessage}
      <p class="text-center text-sm text-emerald-500 mt-1">{successMessage}</p>
    {/if}
  </form>

  <p class="text-center text-sm text-muted-foreground">
    Remembered your password?
    <a class="text-primary hover:underline" href="/login">Back to login</a>
  </p>
</div>
