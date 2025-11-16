<script>
  import Button from '$lib/components/ui/button.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Checkbox from '$lib/components/ui/checkbox.svelte';
  import Label from '$lib/components/ui/label.svelte';
  import Alert from '$lib/components/ui/alert.svelte';
  import { onMount } from 'svelte';
  import { toast } from '$lib/components/ui/use-toast.js';

  export let data;
  export let form;

  const defaultValues = {
    email: data.rememberedEmail ?? '',
    password: '',
    remember: Boolean(data.rememberedEmail)
  };

  $: values = form?.values ?? defaultValues;
  $: errors = form?.errors ?? {};
  $: message = form?.message ?? '';

  onMount(() => {
    if (data.justRegistered) {
      toast({
        title: 'Account created',
        description: 'Sign in to continue.',
        variant: 'success'
      });
    }
  });
</script>

<div class="mx-auto flex w-full max-w-md flex-col gap-6">
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold">Welcome back</h1>
    <p class="text-sm text-muted-foreground">Sign in to manage your tasks.</p>
  </div>

  {#if data.justRegistered}
    <!-- Success message after registration -->
    <Alert>
      Account created successfully. Please sign in.
    </Alert>
  {/if}

  {#if message}
    <!-- Error message from the login action -->
    <Alert variant="destructive">{message}</Alert>
  {/if}

  <!-- Normal HTML form: browser will follow the redirect from the server -->
  <form method="POST" class="space-y-5">
    <div class="space-y-2">
      <Label forId="email">Email</Label>
      <Input
        name="email"
        type="email"
        placeholder="name@example.com"
        required
        value={values.email}
        className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {#if errors.email}
        <p class="text-sm text-destructive">{errors.email}</p>
      {/if}
    </div>

    <div class="space-y-2">
      <Label forId="password">Password</Label>
      <Input
        name="password"
        type="password"
        placeholder="••••••••"
        required
        value={values.password}
        className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
      />
      {#if errors.password}
        <p class="text-sm text-destructive">{errors.password}</p>
      {/if}
    </div>

    <div class="flex items-center justify-between text-sm">
      <Checkbox name="remember" checked={values.remember}>Remember me</Checkbox>
      <a class="text-primary hover:underline" href="/reset">Forgot password?</a>
    </div>

    <Button type="submit" className="w-full">
      Sign in
    </Button>
  </form>

  <p class="text-center text-sm text-muted-foreground">
    Don't have an account?
    <a class="text-primary hover:underline" href="/register">Create one</a>
  </p>
</div>
